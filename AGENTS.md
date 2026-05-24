# OpenCode — Executor Role

You execute. Tasks are planned in beads (`bd`) by a separate agent. Implement what's assigned — don't redesign or re-plan.

## Behavior

- **Surgical changes.** Touch only what the task requires. Match existing style. Don't "improve" adjacent code.
- **Simplicity.** Solve the task, nothing more. No speculative features, no premature abstractions.
- **Goal-driven.** Each task has success criteria — loop until verified. Run tests, confirm the criteria pass, then close.
- **Surface problems.** If a task is unclear or wrong, file a bug (`bd create -t bug --deps discovered-from:<id> --json`) — don't silently reinterpret it.

## Workflow
1. `bd ready --json` → pick first unblocked task
2. `bd show <id> --json` → read acceptance criteria
3. `bd update <id> --claim --json`
4. Implement per the task. Run verification steps.
5. `bd close <id> --reason "Done: summary" --json`
6. Commit code + `.beads/issues.jsonl` together, push.
7. Repeat.

If blocked: `bd dep add <blocked> <blocker> --type blocks --json`

## Session End
Close finished tasks, update in-progress ones, commit, `git push`. Work is NOT complete until push succeeds.

## Do NOT
- Create epics, re-plan work, or use markdown TODOs
- Skip tasks or reorder — respect the dependency graph
- Batch beads updates — close tasks as you finish them

## Build & Test
_Add your commands here_

## Architecture
_Add overview here_

## Conventions
_Add patterns here_

## E2E Testing

This project uses Playwright for end-to-end testing. The test suite includes:

- **Functional smoke tests** (`tests/e2e/smoke.spec.ts`): Tab navigation, marker rendering, day cards, and journey slider behavior
- **Visual regression tests** (`tests/e2e/visual.spec.ts`): Layout snapshots with automatic tile-neutralization

### Running Tests Locally

```bash
npm run test:e2e         # Run all e2e tests
npm run test:e2e:update  # Update visual snapshots
```

### Updating Snapshots

When the UI changes, generate new baselines:

1. Run `npm run test:e2e:update`
2. Visually inspect the new PNGs in `tests/e2e/visual.spec.ts-snapshots/`
3. Commit the updated snapshots if they look correct

### Interpreting Snapshot Diff Failures

If a visual test fails:

1. Download the `playwright-report` artifact from the workflow
2. Inspect the `expected.png`, `actual.png`, and `diff.png` files
3. If the differences are intentional (new UI), update the baselines
4. If the differences are unexpected, investigate the layout issue

## CI/CD

The **regression** workflow automatically deploys to production when tests pass on main. All other branches only get preview deployments.

All PRs must pass:
- **lint** workflow (ESLint + TypeScript)
- **security** workflow (audit + gitleaks + CodeQL)
- **regression** workflow (Playwright smoke + visual tests before deploy)
