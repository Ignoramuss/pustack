# pustack Curriculum Roadmap

75 topics across 10 tracks, ordered by dependency. Each topic has an interactive visualization, a hands-on exercise, prerequisites, difficulty level, and estimated completion time.

**Difficulty levels:** Beginner (B), Intermediate (I), Advanced (A)

---

## Track 1: Bare Metal -- How Computers Work

### 1.01 Binary, Bits, and Data Representation
- **Visualization:** Interactive binary/hex/decimal converter with bit-level view. Toggle individual bits and watch values update across all representations. Visualize two's complement, IEEE 754 floating point layout, and character encoding (ASCII/UTF-8) side by side.
- **Exercise:** Implement functions to convert between binary, decimal, and hex. Encode a string into UTF-8 bytes manually.
- **Prerequisites:** None
- **Difficulty:** B | **Time:** 2h

### 1.02 Logic Gates and Boolean Algebra
- **Visualization:** Drag-and-drop circuit builder. Connect AND, OR, NOT, XOR, NAND gates. Input signals propagate through the circuit in real-time with signal highlighting. Build a half-adder and full-adder from gates.
- **Exercise:** Build a 4-bit adder from logic gates using the circuit builder. Verify with truth tables.
- **Prerequisites:** 1.01
- **Difficulty:** B | **Time:** 2h

### 1.03 CPU Architecture and Fetch-Decode-Execute
- **Visualization:** Animated CPU diagram showing registers, ALU, control unit, and memory bus. Step through a simple program instruction by instruction. Each phase (fetch, decode, execute, writeback) highlights the active components and data paths.
- **Exercise:** Write a simple assembly program (add two numbers, conditional branch) and predict register state after each cycle. Step through to verify.
- **Prerequisites:** 1.01, 1.02
- **Difficulty:** I | **Time:** 3h

### 1.04 Memory Hierarchy: Registers, Cache, RAM, Disk
- **Visualization:** Layered memory hierarchy diagram with animated data movement. Show cache hit/miss scenarios with timing. Visualize cache lines, associativity, and eviction. Side-by-side latency comparison (1ns to 10ms) on a logarithmic timeline.
- **Exercise:** Write a program that demonstrates cache-friendly vs cache-unfriendly access patterns. Measure and compare iteration times over a 2D array (row-major vs column-major).
- **Prerequisites:** 1.03
- **Difficulty:** I | **Time:** 2.5h

### 1.05 Stack, Heap, and Pointers
- **Visualization:** Split-view memory layout showing stack frames growing downward and heap allocations scattered. Step through function calls and see stack frames push/pop. Visualize pointer arrows from stack to heap. Show dangling pointers and double-free scenarios.
- **Exercise:** Trace the stack and heap state of a C program with nested function calls, malloc/free, and pointer arithmetic. Identify a use-after-free bug.
- **Prerequisites:** 1.03, 1.04
- **Difficulty:** I | **Time:** 3h

### 1.06 ISA: CISC vs RISC
- **Visualization:** Side-by-side comparison of x86 (CISC) and ARM/RISC-V (RISC) executing the same high-level operation. Show instruction count, cycle count, and pipeline utilization differences. Visualize micro-op decomposition in CISC.
- **Exercise:** Translate a small C function into both x86 and RISC-V assembly. Compare instruction counts and reason about trade-offs.
- **Prerequisites:** 1.03
- **Difficulty:** I | **Time:** 2h

### 1.07 Interrupts, Traps, and System Calls
- **Visualization:** Timeline view of CPU execution showing user-mode and kernel-mode transitions. Animate hardware interrupt (keyboard press), software trap (division by zero), and system call (file read) flows. Show the interrupt vector table lookup and context save/restore.
- **Exercise:** Trace the execution flow of a `read()` system call from userspace through the kernel and back. Identify each mode transition and context switch.
- **Prerequisites:** 1.03, 1.05
- **Difficulty:** I | **Time:** 2.5h

### 1.08 Booting: BIOS to Userspace
- **Visualization:** Animated boot sequence timeline: power-on, POST, BIOS/UEFI, bootloader (GRUB), kernel loading, init system, userspace. Each stage expands to show what happens at that phase, with memory map visualization.
- **Exercise:** Read a simplified bootloader listing and annotate each section's purpose. Map the memory layout at each boot stage.
- **Prerequisites:** 1.03, 1.04, 1.07
- **Difficulty:** I | **Time:** 2h

---

## Track 2: Operating Systems

### 2.01 Processes and Process Lifecycle
- **Visualization:** State machine diagram (new, ready, running, waiting, terminated) with animated transitions. Show a process table with PID, state, and resource usage. Simulate `fork()` and `exec()` with parent/child tree visualization.
- **Exercise:** Write a C program that forks a child process, has the child exec a command, and the parent waits. Draw the process tree at each step.
- **Prerequisites:** 1.05, 1.07
- **Difficulty:** I | **Time:** 2.5h

### 2.02 Threads and Threading Models
- **Visualization:** Compare 1:1, M:1, and M:N threading models with animated diagrams showing user threads mapped to kernel threads mapped to CPU cores. Visualize thread creation, context switching overhead, and shared vs private memory regions.
- **Exercise:** Implement a multi-threaded word counter. Compare performance with 1, 2, 4, and 8 threads on a large file. Explain the results.
- **Prerequisites:** 2.01
- **Difficulty:** I | **Time:** 2.5h

### 2.03 CPU Scheduling Algorithms
- **Visualization:** Gantt chart simulator for FCFS, SJF, SRTF, Round Robin, and MLFQ. Input process arrival times and burst lengths, watch the scheduler make decisions in real-time. Show waiting time, turnaround time, and response time metrics updating live.
- **Exercise:** Implement Round Robin and MLFQ schedulers. Feed the same workload through both and compare fairness and throughput metrics.
- **Prerequisites:** 2.01, 2.02
- **Difficulty:** I | **Time:** 3h

### 2.04 Virtual Memory and Paging
- **Visualization:** Side-by-side view of virtual address space and physical memory. Animate page table lookups, TLB hits/misses, and page fault handling. Show multi-level page tables expanding as accessed. Visualize how two processes see the "same" address mapping to different physical frames.
- **Exercise:** Given a sequence of virtual addresses, walk through a two-level page table to compute physical addresses. Identify TLB hits and page faults.
- **Prerequisites:** 1.04, 2.01
- **Difficulty:** A | **Time:** 3h

### 2.05 Page Replacement and Memory Management
- **Visualization:** Animate FIFO, LRU, Clock, and Optimal page replacement algorithms on the same reference string. Show page frames updating, faults marked, and hit/miss ratios compared side by side. Demonstrate Belady's anomaly with FIFO.
- **Exercise:** Implement LRU and Clock page replacement. Run the same reference string through both and compare fault rates. Construct a reference string that triggers Belady's anomaly with FIFO.
- **Prerequisites:** 2.04
- **Difficulty:** A | **Time:** 2.5h

### 2.06 File Systems: From Bytes to Files
- **Visualization:** Visualize an ext4-like filesystem: superblock, inode table, data blocks, directory entries. Navigate a directory tree and see which inodes and blocks are read. Show direct, indirect, and double-indirect block pointers. Animate file creation, writing, and deletion.
- **Exercise:** Given a disk image (byte array), parse the superblock, locate an inode by path, and read the file contents by following block pointers.
- **Prerequisites:** 1.04, 2.04
- **Difficulty:** A | **Time:** 3h

### 2.07 I/O Models: Blocking, Non-blocking, Multiplexing, Async
- **Visualization:** Timeline comparison of the same server handling 100 connections under blocking I/O (thread-per-connection), non-blocking polling, epoll/kqueue multiplexing, and io_uring async. Show thread count, CPU utilization, and latency distribution for each model.
- **Exercise:** Build a simple TCP echo server using (1) blocking threads and (2) epoll/select multiplexing. Load-test both and compare connection throughput and memory usage.
- **Prerequisites:** 2.02, 3.08
- **Difficulty:** A | **Time:** 3.5h

### 2.08 Inter-Process Communication (IPC)
- **Visualization:** Animated comparison of pipes, named pipes (FIFOs), shared memory, message queues, and Unix domain sockets. Show data flow, kernel buffer states, and synchronization points for each mechanism.
- **Exercise:** Implement a producer-consumer system using shared memory with semaphores. Then implement the same with Unix domain sockets. Compare throughput and complexity.
- **Prerequisites:** 2.01, 2.02
- **Difficulty:** I | **Time:** 3h

### 2.09 Permissions, Users, and Security Primitives
- **Visualization:** Interactive file permission matrix (owner/group/other x read/write/execute). Show how permission checks flow for a given user and file. Visualize setuid/setgid execution. Demonstrate capability-based vs ACL-based access control.
- **Exercise:** Set up a multi-user scenario and predict which operations succeed or fail based on permissions. Trace a setuid program's effective vs real UID transitions.
- **Prerequisites:** 2.01, 2.06
- **Difficulty:** I | **Time:** 2h

---

## Track 3: Networking

### 3.01 Network Stack: Physical to Application
- **Visualization:** Interactive OSI/TCP-IP stack. Click on a layer to expand it. Animate a packet's journey from application to wire and back: show encapsulation (headers added at each layer going down) and decapsulation (headers stripped going up). Real packet capture examples at each layer.
- **Exercise:** Given a raw Ethernet frame dump (hex), parse it layer by layer: Ethernet header, IP header, TCP header, HTTP payload. Extract the HTTP request.
- **Prerequisites:** 1.01
- **Difficulty:** I | **Time:** 3h

### 3.02 IP Addressing, Subnetting, and Routing
- **Visualization:** Interactive subnet calculator. Input a CIDR block, visualize the address space as a grid. Show network/broadcast addresses, usable range. Animate routing table lookups with longest-prefix matching across multiple routers.
- **Exercise:** Given a network topology and routing tables, trace a packet's path from source to destination. Identify the next hop at each router. Design a subnetting scheme for a given set of requirements.
- **Prerequisites:** 3.01
- **Difficulty:** I | **Time:** 2.5h

### 3.03 TCP: Reliable Delivery
- **Visualization:** Animated sequence diagram showing TCP three-way handshake, data transfer with sliding window, ACKs, retransmission on timeout, and four-way teardown. Adjustable parameters: window size, RTT, loss rate. Show congestion window and slow-start/AIMD behavior on a graph.
- **Exercise:** Implement a simplified reliable delivery protocol over UDP: sequence numbers, ACKs, retransmission timer, and sliding window. Test with simulated packet loss.
- **Prerequisites:** 3.01
- **Difficulty:** A | **Time:** 4h

### 3.04 UDP and When to Use It
- **Visualization:** Side-by-side comparison of TCP and UDP for the same data transfer. Show header overhead, latency, and what happens when packets are lost (TCP retransmits, UDP continues). Visualize real-time use cases: video streaming, DNS queries, game state updates.
- **Exercise:** Build a simple DNS query sender using raw UDP sockets. Parse the DNS response manually according to the DNS wire format.
- **Prerequisites:** 3.01, 3.03
- **Difficulty:** I | **Time:** 2h

### 3.05 DNS: The Internet's Phone Book
- **Visualization:** Animated recursive DNS resolution. Start from a query, hit local cache, root server, TLD server, authoritative server. Show DNS record types (A, AAAA, CNAME, MX, NS, TXT). Visualize TTL countdown and cache expiration. Show the iterative vs recursive resolution difference.
- **Exercise:** Implement a minimal DNS resolver that sends a query to a root server and follows referrals iteratively until it gets the answer. Parse all record types in the response.
- **Prerequisites:** 3.01, 3.04
- **Difficulty:** I | **Time:** 3h

### 3.06 HTTP/1.1, HTTP/2, HTTP/3
- **Visualization:** Waterfall diagram comparison. HTTP/1.1: serial requests and head-of-line blocking. HTTP/2: multiplexed streams, header compression (HPACK), server push. HTTP/3: QUIC transport, 0-RTT handshake, stream-level loss recovery. Animate connection setup and parallel requests for each version.
- **Exercise:** Capture and analyze HTTP/1.1 vs HTTP/2 traffic for the same page load. Measure total load time, number of connections, and bytes transferred. Explain the differences.
- **Prerequisites:** 3.03, 3.05
- **Difficulty:** I | **Time:** 2.5h

### 3.07 TLS and the Handshake
- **Visualization:** Step-by-step TLS 1.3 handshake animation. Show ClientHello, ServerHello, key exchange (ECDHE), certificate verification, and encrypted data flow. Visualize the certificate chain validation from leaf to root CA. Compare TLS 1.2 vs 1.3 round trips.
- **Exercise:** Given a packet capture of a TLS handshake, identify each message, extract the server certificate, and verify the chain. Explain why the chosen cipher suite is secure.
- **Prerequisites:** 3.03, 3.06, 10.06
- **Difficulty:** A | **Time:** 3h

### 3.08 Sockets Programming Deep Dive
- **Visualization:** State diagram for both client and server socket lifecycles. Animate socket(), bind(), listen(), accept(), connect(), send(), recv(), close() with kernel buffer states shown. Visualize the backlog queue and what happens when it fills up.
- **Exercise:** Build a concurrent TCP chat server from scratch using POSIX sockets. Handle multiple clients, graceful disconnect, and message broadcasting.
- **Prerequisites:** 3.03, 2.02
- **Difficulty:** I | **Time:** 3.5h

### 3.09 WebSockets and Server-Sent Events
- **Visualization:** Compare HTTP polling, long polling, SSE, and WebSocket communication patterns on a timeline. Show connection overhead, message latency, and bandwidth usage for each. Animate the WebSocket upgrade handshake and frame format.
- **Exercise:** Build a real-time collaborative counter: server tracks a shared counter, clients connect via WebSocket and see updates instantly. Then implement the same with SSE and compare.
- **Prerequisites:** 3.06, 3.08
- **Difficulty:** I | **Time:** 2.5h

---

## Track 4: Serialization, RPC, and API Design

### 4.01 Serialization Formats: JSON, Protobuf, Avro, MessagePack
- **Visualization:** Encode the same data structure in JSON, Protobuf, Avro, and MessagePack. Show the byte-level layout side by side: field tags, type indicators, length prefixes, varint encoding. Compare payload size and highlight what each byte means.
- **Exercise:** Define a schema (e.g., a user profile) and serialize/deserialize it in all four formats. Benchmark encoding/decoding speed and payload size.
- **Prerequisites:** 1.01, 3.01
- **Difficulty:** I | **Time:** 2.5h

### 4.02 RPC Fundamentals and gRPC
- **Visualization:** Animated RPC call flow: client stub serializes request, sends over network, server stub deserializes, invokes handler, serializes response, returns. Show gRPC specifics: HTTP/2 framing, Protobuf encoding, unary vs streaming modes. Visualize deadline propagation and cancellation.
- **Exercise:** Define a gRPC service with unary and server-streaming RPCs. Implement the server and client. Add deadline handling and observe timeout behavior.
- **Prerequisites:** 4.01, 3.06
- **Difficulty:** I | **Time:** 3h

### 4.03 REST API Design
- **Visualization:** Resource-oriented design explorer. Model a domain (e.g., a library system) as REST resources. Visualize URL hierarchy, HTTP method semantics (GET/POST/PUT/PATCH/DELETE), status code decision tree, and HATEOAS links. Show request/response pairs for each operation.
- **Exercise:** Design a REST API for a given domain. Implement it with proper status codes, pagination, filtering, and error responses. Write a test suite that validates the design against REST constraints.
- **Prerequisites:** 3.06
- **Difficulty:** I | **Time:** 3h

### 4.04 GraphQL
- **Visualization:** Compare REST and GraphQL for the same data-fetching scenario. Show REST's over-fetching and under-fetching (multiple round trips) vs GraphQL's single query. Visualize the query execution: parsing, validation, resolver tree traversal. Show the N+1 problem and DataLoader batching.
- **Exercise:** Build a GraphQL API for the same domain as the REST exercise. Implement resolvers, handle N+1 with DataLoader, and compare query efficiency.
- **Prerequisites:** 4.03
- **Difficulty:** I | **Time:** 3h

### 4.05 API Gateway and Load Balancing
- **Visualization:** Animate request flow through an API gateway: routing, authentication, rate limiting, request transformation, load balancing to backend instances. Compare load balancing algorithms (round-robin, least-connections, consistent hashing) with animated traffic distribution. Show health checking and instance removal.
- **Exercise:** Configure a simple API gateway (or implement one) with path-based routing, rate limiting, and round-robin load balancing across three backend instances. Test failover behavior.
- **Prerequisites:** 4.02, 4.03, 6.02
- **Difficulty:** I | **Time:** 3h

### 4.06 API Versioning and Backward Compatibility
- **Visualization:** Timeline of an API evolving through versions. Show breaking vs non-breaking changes. Visualize URL versioning, header versioning, and content negotiation strategies. Demonstrate Protobuf field number stability and how adding/removing fields affects backward/forward compatibility.
- **Exercise:** Start with a v1 API and evolve it to v2 with breaking changes. Implement a versioning strategy that keeps v1 clients working. Write tests proving backward compatibility.
- **Prerequisites:** 4.01, 4.03
- **Difficulty:** I | **Time:** 2h

---

## Track 5: Concurrency and Parallelism

### 5.01 Concurrency vs Parallelism
- **Visualization:** Two animated timelines: concurrency (single core, interleaved execution of multiple tasks) vs parallelism (multiple cores, simultaneous execution). Show the same work done in both modes. Visualize Amdahl's Law: adjust the parallelizable fraction and see speedup and efficiency graphs update.
- **Exercise:** Implement a task both concurrently (single-threaded, async) and in parallel (multi-threaded). Measure wall-clock time for CPU-bound vs I/O-bound workloads. Graph the results against Amdahl's prediction.
- **Prerequisites:** 2.02
- **Difficulty:** I | **Time:** 2h

### 5.02 Locks, Mutexes, and Semaphores
- **Visualization:** Animate multiple threads contending for a lock. Show the lock state, wait queue, and thread states. Compare mutex (binary), counting semaphore, and read-write lock behavior. Visualize priority inversion and priority inheritance protocols.
- **Exercise:** Implement a thread-safe bounded buffer using a mutex and condition variables. Then implement the same using a counting semaphore. Verify correctness under concurrent producer/consumer load.
- **Prerequisites:** 5.01
- **Difficulty:** I | **Time:** 3h

### 5.03 Deadlock, Livelock, and Starvation
- **Visualization:** Animated resource allocation graph. Show threads acquiring and waiting for resources. When a cycle forms, highlight the deadlock. Animate the four Coffman conditions. Show livelock (two threads repeatedly yielding to each other) and starvation (one thread never gets the resource).
- **Exercise:** Write a program that deadlocks (dining philosophers). Fix it using (1) resource ordering and (2) try-lock with backoff. Verify both solutions under stress testing.
- **Prerequisites:** 5.02
- **Difficulty:** I | **Time:** 2.5h

### 5.04 Lock-Free and Wait-Free Data Structures
- **Visualization:** Animate a lock-free stack (Treiber stack) and queue (Michael-Scott queue) under concurrent operations. Show CAS (compare-and-swap) attempts, retries on contention, and the ABA problem. Visualize how hazard pointers or epoch-based reclamation solve safe memory reclamation.
- **Exercise:** Implement a lock-free stack using atomic CAS operations. Demonstrate the ABA problem with a test case, then fix it with tagged pointers. Benchmark against a mutex-based stack under high contention.
- **Prerequisites:** 5.02, 5.03
- **Difficulty:** A | **Time:** 4h

### 5.05 Memory Models and Ordering
- **Visualization:** Show two threads executing stores and loads to shared variables. Visualize store buffers, cache coherence (MESI protocol), and how different memory orderings (sequential consistency, acquire-release, relaxed) allow or prevent reorderings. Animate x86-TSO vs ARM's weaker model.
- **Exercise:** Write a program that breaks under relaxed memory ordering but works under sequential consistency. Fix it using appropriate memory fences. Explain which orderings are needed and why.
- **Prerequisites:** 1.04, 5.04
- **Difficulty:** A | **Time:** 3h

### 5.06 The Actor Model
- **Visualization:** Animated actors sending messages through mailboxes. Show message delivery, processing, and state changes. Visualize actor supervision trees (Erlang-style). Demonstrate how actors achieve concurrency without shared mutable state. Show message ordering guarantees (per sender-receiver pair).
- **Exercise:** Implement an actor system from scratch with a fixed thread pool. Build a simple chat room using actors (room actor, user actors). Test message ordering and error handling via supervision.
- **Prerequisites:** 5.01
- **Difficulty:** I | **Time:** 3h

### 5.07 CSP and Channels
- **Visualization:** Animate goroutine-like processes communicating through channels. Show unbuffered channels (synchronous rendezvous), buffered channels, and select/alt statements. Visualize a pipeline of stages connected by channels. Show how channel operations block and unblock processes.
- **Exercise:** Build a concurrent pipeline: read lines from a file, parse them, transform, and write output -- each stage a separate goroutine connected by channels. Add fan-out/fan-in for the transform stage.
- **Prerequisites:** 5.01, 5.06
- **Difficulty:** I | **Time:** 2.5h

### 5.08 Coroutines, Green Threads, and Async/Await
- **Visualization:** Compare OS threads, green threads, and coroutines. Show stack allocation, context switch cost, and scheduling. Animate async/await: a coroutine suspends at an await point, the executor polls another task, and resumes when the future is ready. Visualize the event loop and task queue.
- **Exercise:** Implement a minimal async runtime: a future trait, a simple executor that polls tasks, and a "sleep" future that resolves after a delay. Run multiple concurrent async tasks on a single thread.
- **Prerequisites:** 5.01, 2.07
- **Difficulty:** A | **Time:** 4h

---

## Track 6: Data Structures for Systems

### 6.01 Hash Tables: Open Addressing, Chaining, Robin Hood
- **Visualization:** Side-by-side hash table visualization. Insert/delete/lookup with animated probing. Compare chaining (linked lists), linear probing, quadratic probing, and Robin Hood hashing. Show load factor vs probe length graphs updating in real time. Visualize resizing and rehashing.
- **Exercise:** Implement a hash table with Robin Hood hashing. Compare its variance in probe lengths against linear probing by inserting the same keys into both and measuring max/avg probe length.
- **Prerequisites:** 1.04
- **Difficulty:** I | **Time:** 3h

### 6.02 Consistent Hashing and Virtual Nodes
- **Visualization:** Animated hash ring. Add/remove nodes and watch keys redistribute (only keys between the removed node and its predecessor move). Compare with naive modular hashing where all keys shuffle. Show how virtual nodes improve balance. Visualize load distribution histograms.
- **Exercise:** Implement consistent hashing with virtual nodes. Measure key redistribution when adding/removing nodes. Compare load variance with different numbers of virtual nodes.
- **Prerequisites:** 6.01
- **Difficulty:** I | **Time:** 2.5h

### 6.03 B-Trees and B+ Trees
- **Visualization:** Animated B-tree and B+ tree operations: insert, delete, search. Show node splits and merges, key redistribution. Highlight the difference: B-tree stores data in all nodes, B+ tree only in leaves with leaf-level linked list for range scans. Visualize disk I/O per operation.
- **Exercise:** Implement a B+ tree that supports insert, point lookup, and range scan. Verify with a series of operations and check the tree structure at each step.
- **Prerequisites:** 1.04
- **Difficulty:** A | **Time:** 4h

### 6.04 LSM Trees and SSTables
- **Visualization:** Animate the LSM tree write path: writes go to memtable (sorted in-memory), memtable flushes to SSTable on disk, compaction merges SSTables at each level. Show read path: check memtable, then L0, L1, L2 SSTables. Visualize write amplification and space amplification at each compaction level.
- **Exercise:** Implement a minimal LSM storage engine: in-memory AVL tree as memtable, flush to sorted file (SSTable), and a simple compaction that merges two SSTables. Support put, get, and delete.
- **Prerequisites:** 6.03
- **Difficulty:** A | **Time:** 4h

### 6.05 Bloom Filters
- **Visualization:** Animated Bloom filter: insert elements by hashing to k positions in the bit array. Show membership queries: all k positions set = "probably yes", any unset = "definitely no". Visualize false positive rate vs size/hash count with interactive parameter tuning.
- **Exercise:** Implement a Bloom filter. Empirically measure the false positive rate as a function of the number of elements and bit array size. Compare with the theoretical formula.
- **Prerequisites:** 6.01
- **Difficulty:** I | **Time:** 2h

### 6.06 Skip Lists
- **Visualization:** Animated skip list showing multiple levels. Insert elements with random level assignment. Animate search path: start from top-left, move right or down. Show how expected O(log n) search emerges from random level distribution. Compare with balanced BST operations.
- **Exercise:** Implement a skip list with insert, delete, and search. Run a benchmark against a balanced BST (e.g., red-black tree) for random insertions and lookups. Compare performance characteristics.
- **Prerequisites:** None
- **Difficulty:** I | **Time:** 2.5h

### 6.07 Merkle Trees
- **Visualization:** Build a Merkle tree from a set of data blocks. Show hash computation from leaves to root. Change one block and watch the recomputation propagate. Animate Merkle proof: prove a leaf belongs to the tree by providing sibling hashes along the path. Show anti-entropy sync between two replicas.
- **Exercise:** Implement a Merkle tree. Generate and verify inclusion proofs. Implement an anti-entropy protocol that uses the Merkle tree to efficiently find differences between two replicas.
- **Prerequisites:** 6.03, 10.06
- **Difficulty:** I | **Time:** 3h

### 6.08 HyperLogLog, Count-Min Sketch, Cuckoo Filter
- **Visualization:** For HyperLogLog: show registers updated on each element, the harmonic mean estimator, and error range. For Count-Min Sketch: visualize the 2D array of counters, hash functions, and point query estimation. For Cuckoo filter: show bucket-based insertion, fingerprint storage, and cuckoo eviction chain.
- **Exercise:** Implement HyperLogLog and Count-Min Sketch. Feed the same stream through both. Compare HyperLogLog's cardinality estimate with the exact count. Use Count-Min Sketch for frequency estimation and measure error.
- **Prerequisites:** 6.01, 6.05
- **Difficulty:** A | **Time:** 3.5h

---

## Track 7: Storage and Databases

### 7.01 Anatomy of a Database: Query Lifecycle
- **Visualization:** Follow a SQL query through the database engine: parser (AST), analyzer (bind names), optimizer (plan tree with cost annotations), executor (pipeline of operators). Show how each stage transforms the query. Visualize the difference between a logical and physical plan.
- **Exercise:** Given a SQL query and schema, manually walk through parsing, binding, and generating a logical plan. Propose two physical plans and estimate their cost using given statistics.
- **Prerequisites:** 6.03
- **Difficulty:** I | **Time:** 2.5h

### 7.02 Indexing: B-Tree, Hash, Bitmap, GIN, GiST
- **Visualization:** Side-by-side comparison of index types on the same dataset. Show how each index is structured and how lookups/range scans work. Animate a query using each index type: B-tree range scan, hash point lookup, bitmap AND/OR for compound filters, GIN for full-text search, GiST for spatial queries.
- **Exercise:** Design the optimal index strategy for a given set of queries on a table. Explain which index type to use for each query and why. Verify with EXPLAIN ANALYZE outputs.
- **Prerequisites:** 6.03, 7.01
- **Difficulty:** I | **Time:** 3h

### 7.03 Write-Ahead Logging (WAL)
- **Visualization:** Animate the WAL write path: log entry written to WAL file, then data page modified in buffer pool. Show crash and recovery: replay WAL entries to reconstruct uncommitted changes. Visualize checkpointing: flush dirty pages, advance the recovery start point. Show WAL segment management and archival.
- **Exercise:** Implement a simple WAL: append log records for put/delete operations, flush to disk, then apply to an in-memory store. Simulate a crash and recover state by replaying the WAL from the last checkpoint.
- **Prerequisites:** 2.06, 7.01
- **Difficulty:** A | **Time:** 3.5h

### 7.04 Transactions and ACID
- **Visualization:** Animate concurrent transactions executing interleaved operations. Show the anomalies at each isolation level: dirty read, non-repeatable read, phantom read, write skew. Visualize how strict 2PL prevents anomalies (lock acquisition timeline) vs how SSI detects conflicts (dependency graph).
- **Exercise:** Write transaction scenarios that produce each anomaly. Run them at different isolation levels and observe which anomalies are prevented. Implement a simple lock manager that enforces strict 2PL.
- **Prerequisites:** 5.02, 7.01
- **Difficulty:** A | **Time:** 3.5h

### 7.05 MVCC (Multi-Version Concurrency Control)
- **Visualization:** Animate MVCC: each write creates a new version with a transaction ID. Readers see a snapshot based on their start timestamp. Show version chains, garbage collection of old versions. Compare with lock-based concurrency: MVCC allows readers and writers to not block each other.
- **Exercise:** Implement a simplified MVCC key-value store. Support snapshot reads (transaction sees state as of its start time) and detect write-write conflicts. Verify with concurrent transaction scenarios.
- **Prerequisites:** 7.04
- **Difficulty:** A | **Time:** 4h

### 7.06 Replication: Single-Leader, Multi-Leader, Leaderless
- **Visualization:** Animate three replication topologies. Single-leader: writes go to leader, replicated to followers, read from followers (show replication lag). Multi-leader: concurrent writes to different leaders, show conflict detection and resolution. Leaderless: quorum reads and writes (R + W > N), show sloppy quorums and hinted handoff.
- **Exercise:** Implement a simulated replicated key-value store. Start with single-leader replication. Demonstrate a stale read due to replication lag. Then implement quorum reads/writes and show how they provide stronger consistency.
- **Prerequisites:** 7.03, 8.01
- **Difficulty:** A | **Time:** 4h

### 7.07 Partitioning and Sharding
- **Visualization:** Animate key-range partitioning and hash partitioning. Show how data distributes across partitions. Demonstrate hotspots in range partitioning (sequential keys) and how hash partitioning avoids them. Visualize cross-partition queries (scatter-gather) and partition rebalancing when adding/removing nodes.
- **Exercise:** Implement a partitioned key-value store with hash-based partitioning and a configurable number of partitions. Add a partition split operation and rebalancing. Measure key distribution uniformity.
- **Prerequisites:** 6.02, 7.06
- **Difficulty:** A | **Time:** 3.5h

### 7.08 CAP Theorem and Consistency Models
- **Visualization:** Interactive CAP triangle. Select two of three (C, A, P) and see which systems fall in that category. Animate a network partition scenario and show how a CP system becomes unavailable while an AP system serves stale data. Visualize the consistency spectrum: linearizability, sequential consistency, causal consistency, eventual consistency.
- **Exercise:** Build a simulated distributed store. Introduce a network partition and observe behavior under CP mode (reject writes to minority partition) and AP mode (accept writes everywhere, resolve conflicts later). Implement causal consistency using vector clocks.
- **Prerequisites:** 7.06, 8.01
- **Difficulty:** A | **Time:** 3.5h

### 7.09 Query Optimization
- **Visualization:** Show the optimizer exploring plan space. Visualize join ordering: nested loop, hash join, sort-merge join with row flow animations. Show cost estimation using table statistics (cardinality, selectivity, histogram). Compare a bad plan vs optimized plan with real row counts flowing through operators.
- **Exercise:** Given a multi-table query and table statistics, enumerate possible join orderings. Estimate the cost of each plan. Verify your analysis against the database optimizer's EXPLAIN output.
- **Prerequisites:** 7.01, 7.02
- **Difficulty:** A | **Time:** 3h

### 7.10 Column Stores, Time-Series, and Specialized Databases
- **Visualization:** Compare row-store vs column-store for the same table and query. Show how column store reads only needed columns, enables better compression (run-length, dictionary, delta encoding), and vectorized processing. Visualize time-series DB concepts: time-structured merge tree, downsampling, retention policies.
- **Exercise:** Implement a minimal column store with dictionary encoding and run-length encoding. Compare scan performance against a row-oriented store for an analytical query (SUM over one column with a filter on another).
- **Prerequisites:** 7.01, 6.04
- **Difficulty:** A | **Time:** 3.5h

---

## Track 8: Distributed Systems

### 8.01 Time: Physical, Logical, Hybrid Clocks
- **Visualization:** Animate events across multiple nodes. Show physical clock drift and why wall-clock ordering fails. Introduce Lamport clocks: increment on send, max+1 on receive. Show how Lamport clocks can't capture causality fully. Introduce vector clocks: track per-node counters, detect concurrent events. Show hybrid logical clocks (HLC) combining physical time with logical counters.
- **Exercise:** Implement Lamport clocks and vector clocks. Given a set of events across three nodes, compute clock values for each event. Identify pairs of events that are concurrent (incomparable by vector clock). Implement HLC and show how it maintains physical time proximity.
- **Prerequisites:** 5.01
- **Difficulty:** A | **Time:** 3.5h

### 8.02 Consensus: Paxos
- **Visualization:** Animate a full Paxos round: proposer sends Prepare(n), acceptors respond with Promise, proposer sends Accept(n,v), acceptors respond Accepted. Show what happens when two proposers compete (dueling proposers). Visualize Multi-Paxos optimization where a stable leader skips the Prepare phase.
- **Exercise:** Implement single-decree Paxos with three acceptors. Simulate a scenario where two proposers compete. Verify that only one value is chosen. Then implement Multi-Paxos with a stable leader optimization.
- **Prerequisites:** 8.01, 5.02
- **Difficulty:** A | **Time:** 5h

### 8.03 Consensus: Raft
- **Visualization:** Animate the Raft protocol: leader election (term, votes, timeout), log replication (AppendEntries), and safety (commitment rules). Show a leader failure and re-election. Visualize log divergence and how the new leader reconciles logs. Show joint consensus for membership changes.
- **Exercise:** Implement Raft leader election and log replication for a cluster of 5 nodes. Simulate leader crash and verify a new leader is elected and logs are consistent. Implement the AppendEntries consistency check.
- **Prerequisites:** 8.01, 8.02
- **Difficulty:** A | **Time:** 5h

### 8.04 Distributed Locking (Redis, Redlock, ZooKeeper)
- **Visualization:** Animate three distributed locking approaches. Single Redis SET NX with TTL: show how it fails with clock drift. Redlock: show the quorum-based acquisition across 5 instances and the failure modes Martin Kleppmann identified. ZooKeeper ephemeral sequential nodes: show the lock recipe with watch notifications. Visualize fencing tokens.
- **Exercise:** Implement a distributed lock client using Redis SET NX. Demonstrate the unsafe scenario (lock expires while holder is in GC pause). Add fencing tokens to make it safe. Compare with a ZooKeeper-style implementation.
- **Prerequisites:** 8.01, 5.02
- **Difficulty:** A | **Time:** 3.5h

### 8.05 Leader Election Patterns
- **Visualization:** Animate bully algorithm, ring-based election, and Raft-style election. Show message flow, failure detection, and convergence. Visualize split-brain scenarios and how they're prevented (quorum, fencing). Show lease-based leadership with lease renewal and expiry.
- **Exercise:** Implement the bully algorithm and a lease-based leader election for a cluster of nodes. Simulate node failures and network partitions. Verify that exactly one leader exists at all times (or that the system correctly detects no leader and stops serving).
- **Prerequisites:** 8.02, 8.03
- **Difficulty:** A | **Time:** 3h

### 8.06 Gossip Protocols and Failure Detection
- **Visualization:** Animate gossip-based information dissemination: a node shares state with a random peer, which shares with another random peer, exponential spread. Show how quickly information reaches all nodes. Visualize SWIM failure detector: ping, ping-req, and suspect/confirm states. Show convergence time for different cluster sizes.
- **Exercise:** Implement a gossip protocol for cluster membership. Each node periodically gossips its membership list to a random peer. Simulate a node failure and measure how long until all nodes detect it. Implement SWIM-style indirect probing.
- **Prerequisites:** 3.04, 8.01
- **Difficulty:** A | **Time:** 3.5h

### 8.07 CRDTs (Conflict-Free Replicated Data Types)
- **Visualization:** Animate state-based and operation-based CRDTs. Show a G-Counter across three nodes: each node increments its own entry, merge takes max per entry. Show LWW-Register, OR-Set, and a sequence CRDT (for collaborative text editing). Visualize concurrent edits and automatic conflict resolution without coordination.
- **Exercise:** Implement a G-Counter, PN-Counter, and OR-Set CRDT. Simulate concurrent operations across three replicas. Verify that merge is commutative, associative, and idempotent. Build a simple collaborative text editor using a sequence CRDT.
- **Prerequisites:** 8.01, 7.06
- **Difficulty:** A | **Time:** 4h

### 8.08 Distributed Hash Tables (Chord, Kademlia)
- **Visualization:** Animate the Chord ring: node joining, finger table construction, key lookup routing (O(log n) hops). Show stabilization protocol when nodes join/leave. For Kademlia: visualize the XOR distance metric, k-bucket structure, and iterative lookup. Compare routing table sizes and lookup latencies.
- **Exercise:** Implement a simplified Chord DHT with finger tables. Support node join, key put/get, and handle a node departure. Verify that lookups route correctly in O(log n) hops.
- **Prerequisites:** 6.02, 8.06
- **Difficulty:** A | **Time:** 4h

### 8.09 2PC, 3PC, and Sagas
- **Visualization:** Animate Two-Phase Commit: coordinator sends prepare, participants vote, coordinator sends commit/abort. Show the blocking problem when the coordinator crashes after prepare. Animate Three-Phase Commit's pre-commit phase and how it reduces blocking. Animate Sagas: forward execution with compensating transactions on failure.
- **Exercise:** Implement 2PC coordinator and participant logic. Simulate a coordinator crash after receiving all votes but before sending the decision. Show participants are blocked. Then implement Saga orchestration with compensating transactions for a multi-step workflow (e.g., order placement).
- **Prerequisites:** 7.04, 8.02
- **Difficulty:** A | **Time:** 4h

### 8.10 Exactly-Once Delivery and Idempotency
- **Visualization:** Show the impossibility of exactly-once delivery over unreliable networks (the two generals problem). Animate at-least-once with client retries and duplicate detection on the server (idempotency keys). Show how deduplication windows and idempotent operations achieve effectively-exactly-once semantics. Visualize Kafka's exactly-once with producer IDs and sequence numbers.
- **Exercise:** Build an HTTP API with idempotency key support. Send the same request with the same idempotency key multiple times and verify the operation executes exactly once. Implement a deduplication window and handle edge cases (expired keys, concurrent duplicate requests).
- **Prerequisites:** 3.03, 7.04
- **Difficulty:** A | **Time:** 3h

---

## Track 9: System Design Patterns

### 9.01 Event-Driven Architecture and Message Queues
- **Visualization:** Compare request-response vs event-driven architectures. Animate producers publishing to topics, consumers reading from partitions. Show message ordering within partitions, consumer groups, and offset management. Visualize at-least-once and at-most-once delivery semantics. Show dead letter queues and retry flows.
- **Exercise:** Build a simple in-memory message queue with topics, partitions, consumer groups, and offset tracking. Implement at-least-once delivery with consumer acknowledgments. Test with slow consumers and verify no message loss.
- **Prerequisites:** 2.08, 5.07
- **Difficulty:** I | **Time:** 3.5h

### 9.02 Event Sourcing
- **Visualization:** Animate an event-sourced system: commands produce events, events are appended to an event store (immutable log). Show state reconstruction by replaying events. Visualize projections: different read models built from the same event stream. Show snapshots and event compaction.
- **Exercise:** Implement an event-sourced bank account: deposit, withdraw, transfer commands produce events. Rebuild the account balance from events. Create two projections: current balance and transaction history. Add snapshots for efficient state rebuilding.
- **Prerequisites:** 7.03, 9.01
- **Difficulty:** I | **Time:** 3h

### 9.03 CQRS
- **Visualization:** Animate the CQRS pattern: separate write model (processes commands, validates, emits events) and read model (optimized for queries). Show how the read model is asynchronously updated from events. Visualize eventual consistency between write and read sides. Show how different read models can be optimized for different query patterns.
- **Exercise:** Extend the event-sourced system with CQRS. Add a denormalized read model optimized for a specific query. Demonstrate eventual consistency: write a command and show the read model lag. Implement a synchronous and asynchronous projection updater.
- **Prerequisites:** 9.02
- **Difficulty:** I | **Time:** 2.5h

### 9.04 Circuit Breaker, Bulkhead, and Retry Patterns
- **Visualization:** Animate the circuit breaker state machine: closed (requests pass through), open (requests fail fast), half-open (test with limited requests). Show failure counter, threshold, and timeout. Visualize bulkhead: isolated thread pools preventing cascading failures. Animate retry with exponential backoff and jitter.
- **Exercise:** Implement a circuit breaker that wraps an unreliable HTTP client. Simulate a failing downstream service and observe the circuit breaker transitioning states. Add exponential backoff with jitter for retries in the half-open state. Verify that the circuit breaker prevents cascading failures.
- **Prerequisites:** 3.06, 5.01
- **Difficulty:** I | **Time:** 2.5h

### 9.05 Rate Limiting Algorithms
- **Visualization:** Side-by-side comparison of token bucket, leaky bucket, fixed window, sliding window log, and sliding window counter. For each: animate requests arriving, show acceptance/rejection, visualize the internal state (tokens, counters, timestamps). Show burst behavior differences and edge cases (boundary effects in fixed window).
- **Exercise:** Implement token bucket and sliding window counter rate limiters. Test both with the same bursty traffic pattern. Compare how each handles burst traffic vs steady traffic. Add a distributed rate limiter using Redis.
- **Prerequisites:** 5.02
- **Difficulty:** I | **Time:** 2.5h

### 9.06 Caching Strategies
- **Visualization:** Animate cache-aside, read-through, write-through, write-behind, and write-around patterns. Show the data flow between application, cache, and database for each. Visualize cache invalidation challenges: stale data, thundering herd, cache stampede. Show TTL-based expiry and background refresh.
- **Exercise:** Implement cache-aside with a TTL-based in-memory cache. Add protection against thundering herd (single-flight/coalescing). Simulate a cache stampede scenario and demonstrate the mitigation. Measure hit rate under different TTL values and access patterns.
- **Prerequisites:** 1.04, 6.01
- **Difficulty:** I | **Time:** 3h

### 9.07 Service Discovery and Health Checking
- **Visualization:** Compare client-side discovery (client queries service registry, picks an instance) and server-side discovery (load balancer queries registry). Animate service registration, heartbeat health checks, and deregistration. Show DNS-based discovery and its limitations. Visualize stale entries and their impact.
- **Exercise:** Build a simple service registry with registration, heartbeat-based health checking, and discovery. Implement both client-side and server-side discovery patterns. Simulate an instance crash and measure detection time.
- **Prerequisites:** 3.05, 4.05
- **Difficulty:** I | **Time:** 2.5h

### 9.08 Distributed Tracing
- **Visualization:** Animate a request flowing through multiple microservices. Show span creation, context propagation (trace ID, span ID, parent span ID), and span completion. Visualize the resulting trace as a waterfall/Gantt chart. Show how sampling works (head-based vs tail-based) and its trade-offs.
- **Exercise:** Implement trace context propagation through three services. Generate spans with timing data, propagate trace/span IDs through HTTP headers. Collect spans and reconstruct the full trace as a tree. Visualize the trace timeline.
- **Prerequisites:** 3.06, 10.05
- **Difficulty:** I | **Time:** 3h

### 9.09 Backpressure and Flow Control
- **Visualization:** Animate a producer-consumer pipeline with a fast producer and slow consumer. Show queue buildup, memory growth, and eventual OOM without backpressure. Then show backpressure mechanisms: blocking producer, dropping messages, TCP window-based flow control, reactive streams demand signaling. Visualize throughput and latency under each strategy.
- **Exercise:** Build a streaming pipeline with configurable backpressure strategies: block, drop-oldest, drop-newest, and reactive pull-based. Load test with a fast producer and slow consumer. Compare throughput, latency, and memory usage for each strategy.
- **Prerequisites:** 5.07, 9.01
- **Difficulty:** I | **Time:** 3h

---

## Track 10: Infrastructure and Security

### 10.01 Containers: Namespaces and cgroups
- **Visualization:** Animate Linux namespace creation: PID namespace (process sees itself as PID 1), network namespace (isolated network stack), mount namespace (different filesystem view), UTS namespace (different hostname). Show cgroup resource limits: CPU throttling, memory limits, OOM kills. Visualize how a "container" is just a process with namespaces and cgroups applied.
- **Exercise:** Using raw Linux syscalls (unshare, clone), create a minimal container from scratch: isolate PID, network, mount, and UTS namespaces. Apply cgroup CPU and memory limits. Run a process inside and verify isolation.
- **Prerequisites:** 2.01, 2.04, 2.09
- **Difficulty:** A | **Time:** 3.5h

### 10.02 Container Images and Overlay Filesystems
- **Visualization:** Animate Docker image layer construction: base image, each RUN command adds a layer. Show the overlay filesystem: multiple read-only layers stacked with a writable layer on top. Visualize copy-on-write behavior when a file in a lower layer is modified. Show image pull and layer caching.
- **Exercise:** Build a container image by creating filesystem layers manually (tar archives). Stack them using an overlay mount. Demonstrate copy-on-write by modifying a file and inspecting the upper layer. Implement a simple image builder that tracks layers.
- **Prerequisites:** 2.06, 10.01
- **Difficulty:** A | **Time:** 3h

### 10.03 Container Orchestration Concepts
- **Visualization:** Animate the orchestration control loop: desired state (deployment spec), current state (running containers), reconciliation (start/stop containers to match). Show scheduling decisions: bin-packing, affinity/anti-affinity, resource requests/limits. Visualize rolling updates, health checks, and automatic rollback.
- **Exercise:** Implement a minimal container orchestrator: maintain desired replica count, schedule replicas across nodes based on available resources, perform a rolling update with configurable max-surge and max-unavailable. Simulate a node failure and verify rescheduling.
- **Prerequisites:** 10.01, 10.02, 9.07
- **Difficulty:** A | **Time:** 4h

### 10.04 Service Mesh
- **Visualization:** Animate sidecar proxy injection: each service gets a proxy. Show request flow: app sends to localhost, sidecar intercepts, applies routing/retry/circuit-breaker policies, forwards to destination sidecar, which delivers to the app. Visualize the control plane pushing configuration to all sidecars. Show mTLS between sidecars.
- **Exercise:** Set up a service mesh between three services (using a simplified sidecar proxy). Implement basic traffic routing (canary deployment: 90/10 traffic split), automatic retries, and mutual TLS between services. Observe the traffic flow and retry behavior.
- **Prerequisites:** 10.03, 9.04, 10.07
- **Difficulty:** A | **Time:** 3.5h

### 10.05 Observability: Logs, Metrics, Traces
- **Visualization:** Show the three pillars of observability side by side for a single failing request. Logs: structured log entries with correlation IDs. Metrics: time-series graphs (request rate, error rate, latency percentiles -- RED method). Traces: waterfall view of the request across services. Animate how you'd use each to diagnose a latency spike.
- **Exercise:** Instrument a multi-service application with structured logging (correlation IDs), metrics (counters, histograms), and distributed traces. Simulate a latency issue and use all three signals to diagnose the root cause.
- **Prerequisites:** 9.08
- **Difficulty:** I | **Time:** 3h

### 10.06 Cryptographic Primitives
- **Visualization:** Animate symmetric encryption (AES): plaintext split into blocks, key schedule expansion, rounds of SubBytes/ShiftRows/MixColumns/AddRoundKey. Show ECB mode's pattern leakage vs CBC/GCM. Animate asymmetric encryption (RSA): key generation, encryption with public key, decryption with private key. Show hash function (SHA-256): message padding, block processing, avalanche effect.
- **Exercise:** Implement a simplified Feistel cipher to understand block cipher structure. Demonstrate ECB vs CBC mode by encrypting an image (show pattern leakage). Implement a hash function and verify the avalanche effect (flipping one input bit changes ~50% of output bits).
- **Prerequisites:** 1.01
- **Difficulty:** I | **Time:** 3h

### 10.07 PKI, Certificates, and mTLS
- **Visualization:** Animate the PKI chain: root CA signs intermediate CA, intermediate signs server certificate. Show certificate verification: browser walks the chain to a trusted root. Animate certificate issuance with CSR. Show mTLS: both client and server present certificates, mutual verification. Visualize certificate revocation (CRL vs OCSP).
- **Exercise:** Set up a mini PKI: generate a root CA, an intermediate CA, and server/client certificates. Configure mTLS between a client and server, each verifying the other's certificate chain. Simulate a revoked certificate and verify rejection.
- **Prerequisites:** 10.06, 3.07
- **Difficulty:** A | **Time:** 3h

### 10.08 Authentication and Authorization (OAuth, JWT, RBAC/ABAC)
- **Visualization:** Animate the OAuth 2.0 authorization code flow: redirect to authorization server, user grants consent, auth code returned, exchanged for access token. Show JWT structure: header, payload, signature, base64 encoding. Visualize RBAC (role hierarchy, permission inheritance) vs ABAC (attribute-based policy evaluation with decision tree).
- **Exercise:** Implement a simplified OAuth 2.0 authorization server: authorization endpoint, token endpoint, and resource server with JWT validation. Add RBAC with role hierarchy and verify access control for different roles and resources.
- **Prerequisites:** 10.06, 10.07, 3.06
- **Difficulty:** A | **Time:** 4h
