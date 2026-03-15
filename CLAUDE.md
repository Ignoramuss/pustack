# pustack -- Project Instructions

## Overview

pustack is an interactive learning platform for computer science and distributed systems.
Framework: Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, MDX.

## Code Style

- TypeScript strict mode, no `any` unless absolutely necessary.
- React components MUST be function components with explicit return types.
- MUST use `const` by default; `let` only when reassignment is required.
- File naming: `kebab-case.tsx` for components, `kebab-case.ts` for utilities.
- Component naming: PascalCase matching the file name (e.g., `cpu-pipeline.tsx` exports `CpuPipeline`).

## Content

- Topic content lives in `content/topics/<track-number>-<track-slug>/<topic-number>-<topic-slug>.mdx`.
- Each MDX file MUST have frontmatter with: title, track, topic number, prerequisites, difficulty, estimated time.
- Interactive visualizations are React components imported into MDX.

## Testing

- SHOULD write tests for visualization logic (not DOM rendering).
- Exercise validators MUST have deterministic expected outputs.

## Commits

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Scope by track when applicable: `feat(track-8): add Raft leader election visualization`.
