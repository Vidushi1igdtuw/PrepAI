const StudyMaterial = require('../models/StudyMaterial');
const Question = require('../models/Question');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const UserProgress = require('../models/UserProgress');
const oaQuestionsData = require('./oaQuestionsData');

const seedDatabase = async () => {
  try {
    // 1. Seed Demo User if not exists
    const existingDemo = await User.findOne({ email: 'demo@prepai.edu' });
    let demoUser;
    if (!existingDemo) {
      demoUser = await User.create({
        name: 'Alex Rivera',
        email: 'demo@prepai.edu',
        password: 'password123',
        isOnboarded: true
      });

      await UserProfile.create({
        user: demoUser._id,
        college: 'National Institute of Technology',
        degree: 'B.Tech',
        branch: 'Computer Science and Engineering',
        currentYear: '3rd Year',
        graduationYear: 2026,
        skills: ['Data Structures & Algorithms', 'C++', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
        programmingLanguages: ['C++', 'Python', 'JavaScript', 'SQL'],
        areasOfInterest: ['Full Stack Systems', 'Distributed Systems', 'Cloud Computing'],
        targetRole: 'Software Development Engineer (SDE-1)',
        preparationGoals: 'Crack FAANG / Tier-1 Product placement with high algorithmic problem-solving mastery.',
        currentPreparationLevel: 'Intermediate',
        bio: 'Pre-final year CS student passionate about building scalable web applications and algorithmic problem solving.'
      });

      await UserProgress.create({
        user: demoUser._id,
        overallScore: 78,
        streakCount: 6,
        questionsSolved: 42,
        mockInterviewsCompleted: 3,
        mockOACompleted: 4,
        learningHours: 28.5,
        weeklyActivity: [
          { day: 'Mon', hours: 2.5, questions: 8 },
          { day: 'Tue', hours: 3.5, questions: 14 },
          { day: 'Wed', hours: 1.5, questions: 4 },
          { day: 'Thu', hours: 4.0, questions: 16 },
          { day: 'Fri', hours: 3.0, questions: 10 },
          { day: 'Sat', hours: 5.5, questions: 22 },
          { day: 'Sun', hours: 3.0, questions: 12 }
        ],
        recentActivities: [
          {
            type: 'assessment',
            title: 'Scored 85% on DSA Core Assessment Arena',
            timestamp: new Date(Date.now() - 3600000 * 2)
          },
          {
            type: 'interview',
            title: 'Completed Google SDE-1 Technical Mock Interview (Score: 84/100)',
            timestamp: new Date(Date.now() - 3600000 * 24)
          }
        ]
      });
      console.log('[Seed] Demo student user created: demo@prepai.edu / password123');
    }

    // 2. Seed Study Materials if empty
    const studyCount = await StudyMaterial.countDocuments();
    if (studyCount === 0) {
      await StudyMaterial.create([
        {
          title: 'Mastering Dynamic Programming: Memoization to Tabulation',
          category: 'Data Structures and Algorithms',
          topic: 'Dynamic Programming',
          difficulty: 'Intermediate',
          readTimeMinutes: 12,
          summary: 'A structured blueprint for recognizing overlapping subproblems, formulating recurrence relations, and optimizing auxiliary space.',
          content: `### 🎯 The Core Intuition of Dynamic Programming

Dynamic Programming (DP) is simply **careful, memoized recursion**. When an algorithm repeatedly calculates identical states, caching previously computed results reduces exponential $O(2^N)$ time to polynomial $O(N)$ or $O(N \\times W)$.

#### 🔍 4-Step Framework to Solve Any DP Problem:
1. **Identify the State:** What parameters uniquely define the current situation? (e.g., \`dp(i, target)\`).
2. **Formulate the Recurrence Relation:** Express current state in terms of smaller sub-states:
   $$\\text{dp}[i] = \\min(\\text{dp}[i], \\text{dp}[i - \\text{coin}] + 1)$$
3. **Determine Base Cases:** What is the simplest valid state (e.g., \`target == 0\`) and invalid boundary?
4. **Optimize Space:** Can you replace a 2D matrix with two 1D rows if transition only depends on previous row?

#### 💻 Classic Problem: 0/1 Knapsack
\`\`\`cpp
int knapSack(int W, const vector<int>& wt, const vector<int>& val, int n) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}
\`\`\``,
          keyTakeaways: [
            'Recognize Overlapping Subproblems and Optimal Substructure.',
            'Always start with pure recursion + Memoization table (Top-Down).',
            'Convert to Iterative Tabulation (Bottom-Up) for zero recursion stack overhead.'
          ],
          tags: ['DP', 'DSA', 'Optimization', 'Algorithms']
        },
        {
          title: 'Database Transactions & ACID Properties in Distributed Systems',
          category: 'DBMS',
          topic: 'Transactions & Concurrency',
          difficulty: 'Intermediate',
          readTimeMinutes: 15,
          summary: 'Comprehensive analysis of Atomicity, Consistency, Isolation levels, Durability, and Write-Ahead Logging (WAL).',
          content: `### 🗄️ Database Transactions & ACID Guarantees

In transactional systems, a transaction is a logical unit of database processing that includes one or more database access operations.

#### 🏛️ ACID Properties:
- **Atomicity:** "All or nothing". Ensured using Write-Ahead Logging (WAL) and undo logs.
- **Consistency:** Transactions move the database from one valid state to another, satisfying all constraints.
- **Isolation:** Concurrent transactions execute without cross-contamination.
- **Durability:** Committed transactions persist even in the event of immediate power failure or crash.

#### 🔒 ANSI SQL Transaction Isolation Levels:
| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|:---|:---:|:---:|:---:|
| **Read Uncommitted** | ⚠️ Allowed | ⚠️ Allowed | ⚠️ Allowed |
| **Read Committed** | 🛡️ Prevented | ⚠️ Allowed | ⚠️ Allowed |
| **Repeatable Read** | 🛡️ Prevented | 🛡️ Prevented | ⚠️ Allowed |
| **Serializable** | 🛡️ Prevented | 🛡️ Prevented | 🛡️ Prevented |`,
          keyTakeaways: [
            'Write-Ahead Logging (WAL) guarantees Atomicity and Durability.',
            'Isolation levels represent a classic trade-off between consistency and concurrent throughput.',
            'PostgreSQL uses MVCC (Multi-Version Concurrency Control) for non-blocking reads.'
          ],
          tags: ['DBMS', 'SQL', 'ACID', 'Concurrency']
        },
        {
          title: 'Process Synchronization & Classical IPC Problems',
          category: 'Operating Systems',
          topic: 'Concurrency & Deadlocks',
          difficulty: 'Intermediate',
          readTimeMinutes: 14,
          summary: 'Critical section problem, Semaphores vs Mutexes, and deep dive into Producer-Consumer and Dining Philosophers problems.',
          content: `### 💻 The Critical Section Problem

A critical section is a piece of code that accesses shared resources (like variables, memory blocks, or hardware devices) that must not be concurrently accessed by more than one process or thread.

#### ⚙️ Mutex vs Semaphore:
- **Mutex (Mutual Exclusion Object):** A locking mechanism owned by the thread that locked it. Only the owner can unlock it.
- **Counting Semaphore:** A signaling mechanism using an integer counter (\`P()\` / wait and \`V()\` / signal). Any thread can signal.

#### 🍽️ The Dining Philosophers Problem:
Five philosophers sit around a circular table. To eat, a philosopher requires both the left and right forks.
If all philosophers pick up their left fork simultaneously:
- **Result:** Circular wait occurs -> **Deadlock!**
- **Solution:** Asymmetric rule: Philosophers with odd IDs pick up left fork first; philosophers with even IDs pick up right fork first.`,
          keyTakeaways: [
            'Mutual Exclusion, Progress, and Bounded Waiting are required for critical section solutions.',
            'Deadlocks require all 4 Coffman conditions to be present.',
            'Inverting fork acquisition order completely invalidates circular wait.'
          ],
          tags: ['Operating Systems', 'Concurrency', 'Threads', 'Deadlock']
        },
        {
          title: 'Computer Networks: The TCP/IP Protocol Stack & HTTP/3',
          category: 'Computer Networks',
          topic: 'Transport & Application Layers',
          difficulty: 'Intermediate',
          readTimeMinutes: 16,
          summary: 'TCP 3-way handshake, sliding window flow control, congestion collapse prevention, and why HTTP/3 migrated to UDP with QUIC.',
          content: `### 🌐 Transport Layer: TCP vs UDP & The Evolution to QUIC

The Transport Layer provides process-to-process communication across heterogeneous networks.

#### 🤝 TCP 3-Way Handshake:
1. **Client -> Server:** \`SYN\` (Seq = $x$)
2. **Server -> Client:** \`SYN-ACK\` (Seq = $y$, Ack = $x + 1$)
3. **Client -> Server:** \`ACK\` (Seq = $x + 1$, Ack = $y + 1$)

#### 🚀 Why HTTP/3 Ditched TCP for UDP (QUIC):
Under HTTP/2, all streams are multiplexed over a single TCP connection. If a single IP packet drops:
- **TCP Head-of-Line Blocking:** TCP halts delivery of *all* streams until the dropped packet is retransmitted!
- **QUIC Solution:** Built directly over UDP. Packet loss on Stream A does not stall Stream B at all. Handshake latency is reduced to 0-RTT for returning clients.`,
          keyTakeaways: [
            'TCP guarantees in-order, reliable delivery via ACKs and retransmissions.',
            'Flow control protects receiver buffers; Congestion control protects intermediate network links.',
            'QUIC eliminates Head-of-Line blocking and achieves near-instant connection establishment.'
          ],
          tags: ['Computer Networks', 'TCP', 'HTTP3', 'QUIC', 'Protocols']
        }
      ]);
      console.log('[Seed] Study materials populated.');
    }

    // 3. Seed Company-Specific OA Questions (6 companies × 3 OA sets)
    const companyQuestionCount = await Question.countDocuments({ company: { $in: ['Google', 'Amazon', 'Microsoft', 'Infosys', 'TCS', 'Deloitte'] } });
    if (companyQuestionCount === 0) {
      await Question.deleteMany({});
      await Question.insertMany(oaQuestionsData);
      console.log(`[Seed] ${oaQuestionsData.length} company-specific OA questions populated (6 companies × 3 OA sets).`);
    }

    console.log('[Seed] Database initialization complete.');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
  }
};

module.exports = seedDatabase;
