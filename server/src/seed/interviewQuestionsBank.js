/**
 * Authentic, Company-Specific Interview Question Bank
 * Designed so every company gets questions matching its real interview bar
 * and never repeats questions a candidate has already answered for that company.
 */

module.exports = {
  Google: [
    {
      question: "At Google, we often deal with massive graphs. How would you find the shortest path in an unweighted graph versus a weighted graph with non-negative weights? When does Dijkstra fail?",
      type: "technical",
      idealPoints: ["BFS for unweighted O(V+E)", "Dijkstra with Min-Heap O((V+E) log V)", "Dijkstra fails on negative edge weights (use Bellman-Ford)"]
    },
    {
      question: "Design an autocomplete / typeahead search system like Google Search. How would you store prefixes, rank top-k suggestions, and handle millions of QPS?",
      type: "system-design",
      idealPoints: ["Trie with top-k cached at each node", "Frequency aggregation via log pipeline", "Sharding by prefix and CDN/edge caching"]
    },
    {
      question: "Given a stream of integers, how would you efficiently compute the median at any point in time? Explain the data structures and time complexity.",
      type: "dsa",
      idealPoints: ["Two heaps: Max-Heap for lower half, Min-Heap for upper half", "Balance sizes within 1", "O(log N) insert, O(1) median"]
    },
    {
      question: "Walk me through how you would detect a cycle in a directed graph vs an undirected graph. Why can't we use the exact same DFS visited-set logic for both?",
      type: "technical",
      idealPoints: ["Undirected: track parent node", "Directed: track recursion stack (visiting vs visited)", "Cross edges vs back edges"]
    },
    {
      question: "Explain how Dynamic Programming solves the Edit Distance (Levenshtein Distance) problem between two strings. What is the state transition and space optimization?",
      type: "dsa",
      idealPoints: ["dp[i][j] = min(insert, delete, replace)", "O(M*N) time", "1D rolling array O(min(M,N)) space"]
    },
    {
      question: "Tell me about a time you solved a deeply ambiguous engineering problem where requirements weren't clear. How did you bring structure and validate your solution?",
      type: "hr",
      idealPoints: ["STAR method", "Clarifying constraints & prototyping", "Measuring impact"]
    }
  ],
  Amazon: [
    {
      question: "Amazon's Leadership Principle 'Customer Obsession' is core to our engineering. Tell me about a time you went above and beyond to fix a user-facing issue or improve reliability.",
      type: "hr",
      idealPoints: ["STAR format", "Root cause analysis", "Measurable customer impact"]
    },
    {
      question: "Design an LRU Cache with O(1) get and put operations. Walk me through edge cases like capacity = 0, duplicate keys, and thread safety.",
      type: "dsa",
      idealPoints: ["Hash Map + Doubly Linked List", "Move accessed node to head, evict tail", "Mutex / concurrent locks for thread safety"]
    },
    {
      question: "In an Amazon fulfillment center, packages arrive in intervals. How would you merge overlapping intervals or find the minimum number of loading docks required?",
      type: "technical",
      idealPoints: ["Sort by start time O(N log N)", "Min-Heap of end times for meeting rooms / docks", "Greedy interval merging"]
    },
    {
      question: "How would you design a scalable Notification Service (Email, SMS, Push) that guarantees at-least-once delivery and handles sudden traffic spikes like Prime Day?",
      type: "system-design",
      idealPoints: ["Message queues (SQS/Kafka) for decoupling", "Worker pools with exponential backoff retries", "Idempotency keys & dead-letter queues"]
    },
    {
      question: "Tell me about a time you disagreed with a teammate or manager ('Have Backbone; Disagree and Commit'). What happened and what was the outcome?",
      type: "hr",
      idealPoints: ["Data-backed argument", "Respectful listening", "Full commitment once decision was made"]
    },
    {
      question: "Given a binary tree, how would you serialize and deserialize it so it can be stored in a database and reconstructed identically?",
      type: "dsa",
      idealPoints: ["Preorder traversal with null markers or level-order BFS", "O(N) time and space", "Handling negative or multi-digit values"]
    }
  ],
  Microsoft: [
    {
      question: "How does Virtual Memory work in modern Operating Systems? Explain paging, TLB (Translation Lookaside Buffer), and what happens on a page fault.",
      type: "technical",
      idealPoints: ["Virtual to physical address translation via page tables", "TLB hardware cache", "Page fault trap -> OS loads page from disk"]
    },
    {
      question: "Explain the difference between a Process and a Thread. How does context switching differ, and what synchronization primitives prevent race conditions?",
      type: "technical",
      idealPoints: ["Shared heap/code vs isolated address space", "PCB vs TCB", "Mutex, Semaphores, Monitors"]
    },
    {
      question: "Given a singly linked list, how would you reverse it in-place and detect if it contains a cycle? Prove why Floyd's Tortoise and Hare works.",
      type: "dsa",
      idealPoints: ["3-pointer iterative reversal O(N) time O(1) space", "Fast (2x) and Slow (1x) pointers", "Relative speed guarantees meeting inside cycle"]
    },
    {
      question: "Design a collaborative document editor (like Microsoft Word Online). How do you handle concurrent edits from multiple users without conflicts?",
      type: "system-design",
      idealPoints: ["Operational Transformation (OT) or CRDTs", "WebSockets for real-time sync", "Version history & conflict resolution"]
    },
    {
      question: "What are the SOLID principles in Object-Oriented Design? Give a concrete example of Dependency Inversion or Open/Closed Principle.",
      type: "technical",
      idealPoints: ["Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion", "Depend on abstractions/interfaces"]
    },
    {
      question: "Describe a project where you had to learn a completely new technology stack under a tight deadline. How did you approach it?",
      type: "hr",
      idealPoints: ["Growth mindset", "Structured learning & incremental milestones", "Delivery result"]
    }
  ],
  Infosys: [
    {
      question: "Explain the four pillars of Object-Oriented Programming (Encapsulation, Abstraction, Inheritance, Polymorphism) with real-world software examples.",
      type: "technical",
      idealPoints: ["Data hiding via private fields", "Compile-time vs Runtime polymorphism", "IS-A vs HAS-A relationships"]
    },
    {
      question: "What is Database Normalization? Explain 1NF, 2NF, 3NF, and BCNF with an example of how normalization prevents update anomalies.",
      type: "technical",
      idealPoints: ["Atomic values (1NF)", "No partial dependency (2NF)", "No transitive dependency (3NF)"]
    },
    {
      question: "Write or explain an algorithm to check if two strings are anagrams of each other, and analyze its time and space complexity.",
      type: "dsa",
      idealPoints: ["Frequency array of size 26 or Hash Map", "O(N) time, O(1) space", "Sorting alternative O(N log N)"]
    },
    {
      question: "What is the difference between INNER JOIN, LEFT JOIN, and UNION in SQL? When would you use an Index on a table?",
      type: "technical",
      idealPoints: ["Joins combine columns horizontally; UNION combines rows vertically", "B-Tree indexes speed up WHERE/JOIN lookups at the cost of write overhead"]
    },
    {
      question: "Why do you want to join Infosys, and how do you keep your technical skills updated alongside your college coursework?",
      type: "hr",
      idealPoints: ["Alignment with Infosys training & enterprise scale", "Continuous learning examples"]
    }
  ],
  TCS: [
    {
      question: "Explain the difference between `==` and `.equals()` in Java (or `is` vs `==` in Python), and how memory is managed between Stack and Heap.",
      type: "technical",
      idealPoints: ["Reference comparison vs value/content equality", "Stack for local primitives/frames, Heap for objects & GC"]
    },
    {
      question: "What are ACID properties in DBMS? Explain Atomicity and Isolation with a banking transaction example.",
      type: "technical",
      idealPoints: ["Atomicity (all or nothing)", "Consistency", "Isolation (concurrent safety)", "Durability (persisted on commit)"]
    },
    {
      question: "How would you find the second largest element in an array in a single pass without sorting? Handle edge cases like duplicates.",
      type: "dsa",
      idealPoints: ["Track firstMax and secondMax", "Update both carefully when num > firstMax or num > secondMax && num !== firstMax", "O(N) time, O(1) space"]
    },
    {
      question: "Explain the TCP 3-Way Handshake and the difference between HTTP and HTTPS.",
      type: "technical",
      idealPoints: ["SYN, SYN-ACK, ACK", "HTTPS adds TLS/SSL encryption and server authentication"]
    },
    {
      question: "Are you comfortable relocating or working across different technology stacks (cloud, backend, testing) based on project needs? Tell me about a team project you enjoyed.",
      type: "hr",
      idealPoints: ["Adaptability & team collaboration", "Specific project contribution"]
    }
  ],
  Deloitte: [
    {
      question: "A client's web application is loading slowly under peak traffic. How would you systematically diagnose whether the bottleneck is frontend, API, or database?",
      type: "technical",
      idealPoints: ["Browser DevTools / Network latency", "API profiling & caching (Redis)", "SQL EXPLAIN plans & missing indexes"]
    },
    {
      question: "Explain RESTful API principles and the difference between PUT, PATCH, and POST. How do you secure a REST API using JWT?",
      type: "technical",
      idealPoints: ["Statelessness, resource-based URIs", "PUT replaces, PATCH partial updates, POST creates", "JWT signature verification & HTTPS"]
    },
    {
      question: "How would you remove duplicates from a sorted array in-place, and what is the time/space complexity?",
      type: "dsa",
      idealPoints: ["Two pointers (slow and fast)", "O(N) time, O(1) space"]
    },
    {
      question: "Tell me about a time you had to explain a complex technical concept to a non-technical teammate or stakeholder. How did you tailor your communication?",
      type: "hr",
      idealPoints: ["Clear analogies, avoiding jargon", "Focus on business/user outcome"]
    },
    {
      question: "What is the difference between SQL and NoSQL databases? If Deloitte is building an enterprise financial ledger, which would you choose and why?",
      type: "technical",
      idealPoints: ["Relational ACID guarantees vs flexible document schema", "SQL for financial ledgers due to strict consistency and transactions"]
    }
  ]
};
