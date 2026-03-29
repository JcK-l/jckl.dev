const DEFAULT_REPO_OWNER = "JcK-l";
const DEFAULT_REPO_NAME = "jckl.dev";
const DEFAULT_WORKFLOW_FILE = "nightly-e2e.yml";

type GithubRequestOptions = {
  owner?: string;
  repo?: string;
  token?: string;
};

type WorkflowRunsResponse = {
  workflow_runs: Array<{
    conclusion: string | null;
    created_at: string;
    display_title: string;
    event: string;
    head_branch: string;
    html_url: string;
    id: number;
    run_number: number;
    status: string;
    updated_at: string;
  }>;
};

type WorkflowJobsResponse = {
  jobs: Array<{
    completed_at: string | null;
    conclusion: string | null;
    html_url: string;
    id: number;
    name: string;
    started_at: string;
    status: string;
    steps: Array<{
      conclusion: string | null;
      name: string;
      number: number;
      status: string;
    }>;
  }>;
};

type WorkflowArtifactsResponse = {
  artifacts: Array<{
    archive_download_url: string;
    expired: boolean;
    id: number;
    name: string;
    size_in_bytes: number;
    updated_at: string;
  }>;
};

export type WorkflowRunSummary = {
  conclusion: string | null;
  createdAt: string;
  displayTitle: string;
  event: string;
  headBranch: string;
  htmlUrl: string;
  id: number;
  runNumber: number;
  status: string;
  updatedAt: string;
};

export type WorkflowJobSummary = {
  completedAt: string | null;
  conclusion: string | null;
  htmlUrl: string;
  id: number;
  name: string;
  startedAt: string;
  status: string;
  steps: Array<{
    conclusion: string | null;
    name: string;
    number: number;
    status: string;
  }>;
};

export type WorkflowArtifactSummary = {
  archiveDownloadUrl: string;
  expired: boolean;
  id: number;
  name: string;
  sizeInBytes: number;
  updatedAt: string;
};

export type PlaywrightLogSummary = {
  failedCount: number;
  failedTests: string[];
  flakyCount: number;
  flakyTests: string[];
  passedCount: number;
  skippedCount: number;
};

export type WorkflowRunDiagnostics = {
  artifacts: WorkflowArtifactSummary[];
  job: WorkflowJobSummary | null;
  logSummary: PlaywrightLogSummary | null;
};

const githubRequest = async (
  path: string,
  { owner = DEFAULT_REPO_OWNER, repo = DEFAULT_REPO_NAME, token }: GithubRequestOptions
) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `GitHub Actions request failed with ${response.status} ${response.statusText}`
    );
  }

  return response;
};

export const listNightlyWorkflowRuns = async ({
  owner = DEFAULT_REPO_OWNER,
  perPage = 10,
  repo = DEFAULT_REPO_NAME,
  token,
  workflowFile = DEFAULT_WORKFLOW_FILE,
}: {
  owner?: string;
  perPage?: number;
  repo?: string;
  token?: string;
  workflowFile?: string;
} = {}): Promise<WorkflowRunSummary[]> => {
  const response = await githubRequest(
    `/actions/workflows/${encodeURIComponent(workflowFile)}/runs?per_page=${perPage}`,
    {
      owner,
      repo,
      token,
    }
  );

  const result = (await response.json()) as WorkflowRunsResponse;

  return result.workflow_runs.map((run) => ({
    conclusion: run.conclusion,
    createdAt: run.created_at,
    displayTitle: run.display_title,
    event: run.event,
    headBranch: run.head_branch,
    htmlUrl: run.html_url,
    id: run.id,
    runNumber: run.run_number,
    status: run.status,
    updatedAt: run.updated_at,
  }));
};

export const listWorkflowRunJobs = async ({
  owner = DEFAULT_REPO_OWNER,
  repo = DEFAULT_REPO_NAME,
  runId,
  token,
}: GithubRequestOptions & {
  runId: number;
}): Promise<WorkflowJobSummary[]> => {
  const response = await githubRequest(`/actions/runs/${runId}/jobs?per_page=100`, {
    owner,
    repo,
    token,
  });
  const result = (await response.json()) as WorkflowJobsResponse;

  return result.jobs.map((job) => ({
    completedAt: job.completed_at,
    conclusion: job.conclusion,
    htmlUrl: job.html_url,
    id: job.id,
    name: job.name,
    startedAt: job.started_at,
    status: job.status,
    steps: job.steps.map((step) => ({
      conclusion: step.conclusion,
      name: step.name,
      number: step.number,
      status: step.status,
    })),
  }));
};

export const listWorkflowRunArtifacts = async ({
  owner = DEFAULT_REPO_OWNER,
  repo = DEFAULT_REPO_NAME,
  runId,
  token,
}: GithubRequestOptions & {
  runId: number;
}): Promise<WorkflowArtifactSummary[]> => {
  const response = await githubRequest(`/actions/runs/${runId}/artifacts`, {
    owner,
    repo,
    token,
  });
  const result = (await response.json()) as WorkflowArtifactsResponse;

  return result.artifacts.map((artifact) => ({
    archiveDownloadUrl: artifact.archive_download_url,
    expired: artifact.expired,
    id: artifact.id,
    name: artifact.name,
    sizeInBytes: artifact.size_in_bytes,
    updatedAt: artifact.updated_at,
  }));
};

export const downloadWorkflowJobLogs = async ({
  owner = DEFAULT_REPO_OWNER,
  repo = DEFAULT_REPO_NAME,
  jobId,
  token,
}: GithubRequestOptions & {
  jobId: number;
}) => {
  const response = await githubRequest(`/actions/jobs/${jobId}/logs`, {
    owner,
    repo,
    token,
  });

  return response.text();
};

const collectSummaryBlock = (
  lines: string[],
  startIndex: number,
  expectedLabel: "failed" | "flaky"
) => {
  const tests: string[] = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      if (tests.length > 0) {
        break;
      }

      continue;
    }

    if (/^\d+\s+(failed|flaky|passed|skipped)\b/i.test(line)) {
      break;
    }

    if (line.startsWith("[") && line.includes("›")) {
      tests.push(line);
      continue;
    }

    if (tests.length > 0 && !line.startsWith("[") && !line.startsWith("(")) {
      break;
    }
  }

  return tests.filter((entry) => entry.length > 0 && expectedLabel.length > 0);
};

export const parsePlaywrightJobLog = (logText: string): PlaywrightLogSummary => {
  const passedMatch = logText.match(/(^|\n)\s*(\d+)\s+passed\b/i);
  const failedMatch = logText.match(/(^|\n)\s*(\d+)\s+failed\b/i);
  const flakyMatch = logText.match(/(^|\n)\s*(\d+)\s+flaky\b/i);
  const skippedMatch = logText.match(/(^|\n)\s*(\d+)\s+skipped\b/i);
  const lines = logText.split(/\r?\n/);
  const failedTests: string[] = [];
  const flakyTests: string[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (/^\d+\s+failed\b/i.test(trimmedLine)) {
      failedTests.push(...collectSummaryBlock(lines, index, "failed"));
    }

    if (/^\d+\s+flaky\b/i.test(trimmedLine)) {
      flakyTests.push(...collectSummaryBlock(lines, index, "flaky"));
    }
  });

  return {
    failedCount: failedMatch ? Number.parseInt(failedMatch[2] ?? "0", 10) : 0,
    failedTests: Array.from(new Set(failedTests)),
    flakyCount: flakyMatch ? Number.parseInt(flakyMatch[2] ?? "0", 10) : 0,
    flakyTests: Array.from(new Set(flakyTests)),
    passedCount: passedMatch ? Number.parseInt(passedMatch[2] ?? "0", 10) : 0,
    skippedCount: skippedMatch ? Number.parseInt(skippedMatch[2] ?? "0", 10) : 0,
  };
};

export const getWorkflowRunDiagnostics = async ({
  owner = DEFAULT_REPO_OWNER,
  repo = DEFAULT_REPO_NAME,
  token,
  run,
}: GithubRequestOptions & {
  run: WorkflowRunSummary | null;
}): Promise<WorkflowRunDiagnostics | null> => {
  if (run === null) {
    return null;
  }

  const [jobs, artifacts] = await Promise.all([
    listWorkflowRunJobs({
      owner,
      repo,
      runId: run.id,
      token,
    }),
    listWorkflowRunArtifacts({
      owner,
      repo,
      runId: run.id,
      token,
    }),
  ]);

  const job = jobs.find((candidateJob) => candidateJob.name === "e2e") ?? jobs[0] ?? null;

  if (job === null) {
    return {
      artifacts,
      job: null,
      logSummary: null,
    };
  }

  let logSummary: PlaywrightLogSummary | null = null;

  try {
    const jobLogs = await downloadWorkflowJobLogs({
      owner,
      repo,
      jobId: job.id,
      token,
    });
    logSummary = parsePlaywrightJobLog(jobLogs);
  } catch {
    logSummary = null;
  }

  return {
    artifacts,
    job,
    logSummary,
  };
};

export const getLatestWorkflowRunDiagnostics = getWorkflowRunDiagnostics;
