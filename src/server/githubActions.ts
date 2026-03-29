const DEFAULT_REPO_OWNER = "JcK-l";
const DEFAULT_REPO_NAME = "jckl.dev";
const DEFAULT_WORKFLOW_FILE = "nightly-e2e.yml";

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
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(
      workflowFile
    )}/runs?per_page=${perPage}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub Actions request failed with ${response.status} ${response.statusText}`
    );
  }

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
