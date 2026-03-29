# This is my website

## Nightly E2E Dashboard

This repo includes a scheduled GitHub Actions workflow at
`.github/workflows/nightly-e2e.yml` that runs the Playwright suite in GitHub
Actions against a fresh CI build of the app.

To view the latest runs from the site itself, use `/admin/tests` on
`https://jckl.dev`.

Set these environment variables in Netlify for the dashboard:

- `ADMIN_DASHBOARD_PASSWORD`: password for the app-level admin login
- `ADMIN_DASHBOARD_SECRET`: signing secret for the dashboard session cookie
- `GITHUB_ACTIONS_DASHBOARD_TOKEN`: optional but recommended fine-grained GitHub token with read access to Actions
- `GITHUB_ACTIONS_REPO_OWNER`: optional, defaults to `JcK-l`
- `GITHUB_ACTIONS_REPO_NAME`: optional, defaults to `jckl.dev`
- `GITHUB_ACTIONS_WORKFLOW_FILE`: optional, defaults to `nightly-e2e.yml`
