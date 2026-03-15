import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ALPHA_THRESHOLD = 12;
const SIMPLIFY_EPSILON = 2.5;
const DATA_FILE = path.resolve("src", "data", "PuzzleData.tsx");

const loadSharp = async () => {
  try {
    const { default: sharp } = await import("sharp");
    return sharp;
  } catch (error) {
    throw new Error(
      "The puzzle tracer requires the `sharp` package to be available in node_modules.",
      { cause: error }
    );
  }
};

const keyForPoint = ([x, y]) => `${x},${y}`;

const perpendicularDistance = (point, start, end) => {
  const [px, py] = point;
  const [sx, sy] = start;
  const [ex, ey] = end;
  const dx = ex - sx;
  const dy = ey - sy;

  if (dx === 0 && dy === 0) {
    return Math.hypot(px - sx, py - sy);
  }

  return Math.abs(dy * px - dx * py + ex * sy - ey * sx) / Math.hypot(dx, dy);
};

const simplifyPoints = (points, epsilon) => {
  if (points.length <= 2) {
    return points;
  }

  let maxDistance = 0;
  let splitIndex = -1;

  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = perpendicularDistance(
      points[index],
      points[0],
      points[points.length - 1]
    );

    if (distance > maxDistance) {
      maxDistance = distance;
      splitIndex = index;
    }
  }

  if (maxDistance <= epsilon) {
    return [points[0], points[points.length - 1]];
  }

  const left = simplifyPoints(points.slice(0, splitIndex + 1), epsilon);
  const right = simplifyPoints(points.slice(splitIndex), epsilon);

  return [...left.slice(0, -1), ...right];
};

const buildMask = (buffer, width, height, channels) => {
  const mask = Array.from({ length: height }, () => Array(width).fill(false));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = buffer[(y * width + x) * channels + 3];
      mask[y][x] = alpha >= ALPHA_THRESHOLD;
    }
  }

  return mask;
};

const buildBoundarySegments = (mask) => {
  const height = mask.length;
  const width = mask[0]?.length ?? 0;
  const isFilled = (x, y) =>
    x >= 0 && y >= 0 && x < width && y < height && mask[y][x];
  const segments = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y][x]) {
        continue;
      }

      if (!isFilled(x, y - 1)) {
        segments.push([
          [x, y],
          [x + 1, y],
        ]);
      }

      if (!isFilled(x + 1, y)) {
        segments.push([
          [x + 1, y],
          [x + 1, y + 1],
        ]);
      }

      if (!isFilled(x, y + 1)) {
        segments.push([
          [x + 1, y + 1],
          [x, y + 1],
        ]);
      }

      if (!isFilled(x - 1, y)) {
        segments.push([
          [x, y + 1],
          [x, y],
        ]);
      }
    }
  }

  return segments;
};

const buildLoops = (segments) => {
  const nextByStart = new Map();

  for (const [start, end] of segments) {
    const startKey = keyForPoint(start);

    if (!nextByStart.has(startKey)) {
      nextByStart.set(startKey, []);
    }

    nextByStart.get(startKey).push(end);
  }

  const unusedSegments = new Set(
    segments.map(([start, end]) => `${keyForPoint(start)}>${keyForPoint(end)}`)
  );
  const loops = [];

  for (const [start, end] of segments) {
    const firstSegmentKey = `${keyForPoint(start)}>${keyForPoint(end)}`;

    if (!unusedSegments.has(firstSegmentKey)) {
      continue;
    }

    const loop = [start, end];
    unusedSegments.delete(firstSegmentKey);
    let current = end;

    while (keyForPoint(current) !== keyForPoint(start)) {
      const candidates = nextByStart.get(keyForPoint(current)) ?? [];
      const nextPoint = candidates.find((candidate) =>
        unusedSegments.has(`${keyForPoint(current)}>${keyForPoint(candidate)}`)
      );

      if (!nextPoint) {
        break;
      }

      unusedSegments.delete(
        `${keyForPoint(current)}>${keyForPoint(nextPoint)}`
      );
      current = nextPoint;
      loop.push(current);
    }

    loops.push(loop);
  }

  return loops.sort((left, right) => right.length - left.length);
};

const tracePolygonCoords = async (sharp, imagePath) => {
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const mask = buildMask(data, info.width, info.height, info.channels);
  const segments = buildBoundarySegments(mask);
  const loops = buildLoops(segments);
  const loop = loops[0];

  if (!loop || loop.length < 4) {
    throw new Error(`Failed to trace contour for ${imagePath}`);
  }

  const simplifiedLoop = simplifyPoints(
    [...loop.slice(0, -1), loop[0]],
    SIMPLIFY_EPSILON
  ).slice(0, -1);

  return simplifiedLoop.flat().join(",");
};

const parsePieces = (text) => {
  const piecePattern =
    /path:\s*"(?<path>[^"]+)"\s*,\s*snapPoint:\s*\{\s*x:\s*(?<snapX>\d+),\s*y:\s*(?<snapY>\d+)\s*\}\s*,\s*polygonCoords:\s*"(?<polygonCoords>[^"]*)"\s*,\s*startPoint:\s*\{\s*x:\s*(?<startX>\d+),\s*y:\s*(?<startY>\d+)\s*\}/g;
  const pieces = [];

  for (const match of text.matchAll(piecePattern)) {
    const groups = match.groups;

    if (!groups) {
      continue;
    }

    pieces.push({
      path: groups.path,
      snapPoint: { x: Number(groups.snapX), y: Number(groups.snapY) },
      startPoint: { x: Number(groups.startX), y: Number(groups.startY) },
      polygonCoords: groups.polygonCoords,
    });
  }

  return pieces;
};

const formatPieceFile = (pieces) => {
  const rows = pieces.map((piece) => {
    return `  {
    path: "${piece.path}",
    snapPoint: { x: ${piece.snapPoint.x}, y: ${piece.snapPoint.y} },
    polygonCoords: "${piece.polygonCoords}",
    startPoint: { x: ${piece.startPoint.x}, y: ${piece.startPoint.y} },
  },`;
  });

  return `export type PuzzlePieceType = {
  path: string;
  snapPoint: { x: number; y: number };
  polygonCoords: string;
  startPoint: { x: number; y: number };
};

export const pieces: PuzzlePieceType[] = [
${rows.join("\n")}
];
`;
};

const main = async () => {
  const sharp = await loadSharp();
  const input = await fs.readFile(DATA_FILE, "utf8");
  const pieces = parsePieces(input);

  if (pieces.length === 0) {
    throw new Error(`No puzzle pieces found in ${DATA_FILE}`);
  }

  const tracedPieces = await Promise.all(
    pieces.map(async (piece) => {
      const imagePath = path.join(
        process.cwd(),
        "public",
        piece.path.replace(/^\/+/, "")
      );
      const polygonCoords = await tracePolygonCoords(sharp, imagePath);

      return {
        ...piece,
        polygonCoords,
      };
    })
  );

  await fs.writeFile(DATA_FILE, formatPieceFile(tracedPieces), "utf8");

  console.log(
    `Updated ${tracedPieces.length} puzzle silhouettes in ${path.relative(
      process.cwd(),
      DATA_FILE
    )}`
  );
};

await main();
