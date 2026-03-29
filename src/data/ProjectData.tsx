export type Project = {
  id: number;
  title: string;
  description: string;
  imageFolder?: string;
  numberImages?: number;
  githubLink?: string;
  youtubeLink?: string;
  demoLink?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "vulkan-renderer",
    description:
      "A proof-of-concept moving Met.3D's graphics pipeline from OpenGL to Vulkan during my bachelor's thesis. It focuses on modern rendering infrastructure and cleaner renderer architecture.",
    imageFolder: "/vulkan-renderer",
    numberImages: 5,
    githubLink: "https://github.com/JcK-l/vulkan-renderer",
  },
  {
    id: 2,
    title: "tornado-vis",
    description:
      "A Qt desktop app that turns tornado data into isolines, streamlines, and atmospheric field views. It blends scientific visualization work with graphics-focused tooling.",
    imageFolder: "/tornado-vis",
    numberImages: 4,
    githubLink: "https://github.com/JcK-l/tornado-vis",
  },
  {
    id: 3,
    title: "proud-detectives",
    description:
      "An Android app inspired by Cluedo, built with a team in two weeks. It turns deduction, movement, and note-taking into a compact social mystery game.",
    imageFolder: "/proud-detectives",
    numberImages: 12,
    githubLink: "https://github.com/JcK-l/proud-detectives",
    youtubeLink: "https://www.youtube.com/watch?v=c1fAM1WMQbg",
  },
  {
    id: 4,
    title: "simple-lights",
    description:
      "A straightforward WebGL lighting sandbox focused on forward rendering and clean scene setup. It also became the playground for exploring where clustered shading could go next.",
    imageFolder: "/simple-lights",
    numberImages: 3,
    githubLink: "https://github.com/JcK-l/simple-lights",
    demoLink: "https://jck-l.github.io/simple-lights/",
  },
  {
    id: 5,
    title: "homework-latex",
    description:
      "A public LaTeX template I built to make university homework faster to write and easier to format. It is structured for math-heavy assignments without the usual setup friction.",
    imageFolder: "/homework-latex",
    numberImages: 2,
    githubLink: "https://github.com/JcK-l/homework-latex",
  },
  {
    id: 6,
    title: "jckl.dev",
    description:
      "The website you're on right now: a portfolio experiment built as an interactive puzzle box. It mixes projects, narrative, and hidden routes you can uncover while exploring.",
    imageFolder: "/jckl-website",
    numberImages: 1,
    githubLink: "https://github.com/JcK-l/jckl.dev",
  },
  {
    id: 7,
    title: "online-chess",
    description:
      "Built an online chess web app using an AI-assisted workflow with code review and manual testing. It is a playable browser build focused on quick matches and a clean live experience.",
    demoLink: "https://chess.jckl.dev",
  },
];
