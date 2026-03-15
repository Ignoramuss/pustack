# pustack

> pustak (पुस्तक) = book in Sanskrit/Hindi + stack

A comprehensive, interactive learning platform that demystifies computers and distributed systems. Covers everything from bits and CPU architecture to Paxos and CRDTs.

## Who is this for?

Engineers aiming for senior staff/principal level in distributed systems who want to build deep, first-principles understanding of how computers and distributed systems actually work.

## Curriculum

10 tracks, ~75 topics organized in dependency order:

| # | Track | Topics | Covers |
|---|-------|--------|--------|
| 1 | Bare Metal | 8 | Binary, logic gates, CPU architecture, memory hierarchy, ISA, syscalls, booting |
| 2 | Operating Systems | 9 | Processes, threads, scheduling, virtual memory, file systems, I/O models, IPC |
| 3 | Networking | 9 | Network stack, TCP/UDP, DNS, HTTP, TLS, sockets, WebSockets |
| 4 | Serialization, RPC, and API Design | 6 | Protobuf, gRPC, REST, GraphQL, API gateways, versioning |
| 5 | Concurrency and Parallelism | 8 | Locks, deadlocks, lock-free structures, memory models, actors, CSP, coroutines |
| 6 | Data Structures for Systems | 8 | Hash tables, consistent hashing, B-trees, LSM trees, bloom filters, HyperLogLog |
| 7 | Storage and Databases | 10 | Query lifecycle, indexing, WAL, ACID, MVCC, replication, sharding, CAP |
| 8 | Distributed Systems | 10 | Clocks, Paxos, Raft, distributed locking, CRDTs, DHTs, sagas, idempotency |
| 9 | System Design Patterns | 9 | Event sourcing, CQRS, circuit breakers, rate limiting, caching, backpressure |
| 10 | Infrastructure and Security | 8 | Containers, orchestration, service mesh, observability, crypto, mTLS, auth |

See [roadmap.md](roadmap.md) for the full curriculum with topic descriptions, visualizations, exercises, prerequisites, and difficulty levels.

## Vision

Each topic includes:

- **Interactive visualization** -- animated, explorable diagrams that make abstract concepts tangible (not static images)
- **Hands-on exercise** -- write real code in the browser, validated by automated tests
- **Prerequisite graph** -- topics link to each other so you can trace any concept back to first principles

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Content | MDX with embedded interactive components |
| Visualizations | D3.js, React Flow, Framer Motion |
| Code Editor | Monaco Editor (in-browser) |
| Styling | Tailwind CSS v4 |
| Exercise Execution | Sandpack, Pyodide, WASM (multi-language) |

## Project Structure

```
pustack/
  app/                    -- Next.js app router pages
  content/topics/         -- MDX content per track/topic
  components/
    visualizations/       -- interactive viz per track
    exercises/            -- code editor + test runner
  lib/                    -- content loading, progress tracking
```

## License

MIT
