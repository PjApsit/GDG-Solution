# CI/CD Setup (GitHub)

This repository includes GitHub Actions workflows for CI and CD artifacts:

- `CI`: runs on every push and pull request
- `CD Artifacts`: runs on push to `main` and on manual trigger

## Required one-time GitHub settings

To prevent bad merges, configure branch protection for `main`:

1. Go to `Settings -> Branches -> Add branch protection rule`.
2. Branch name pattern: `main`.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass before merging**.
5. Select these required checks:
   - `Client Build`
   - `Server Syntax Check`
6. Enable **Require branches to be up to date before merging**.
7. (Recommended) Enable **Require review from Code Owners**.
8. Save changes.

## What this gives you

- PRs cannot merge if frontend build fails.
- PRs cannot merge if server has JS syntax errors.
- New pushes to a PR cancel stale CI runs to avoid race conditions.
- Main branch produces versioned build artifacts (client dist + server package).
