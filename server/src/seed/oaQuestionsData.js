/**
 * Real-world Company Online Assessment (OA) Question Bank
 * 6 Companies × 3 OA Sets = 18 Distinct Assessments
 * All coding questions have clean starter boilerplate (NO pre-written solutions)
 * and deterministic JSON test cases for real automated grading.
 */

const makeCodingStarter = (fnName, paramsJs, paramsPy, paramsCpp) => ({
  javascript: `/**\n * Write your solution below.\n * Do not change the function name or signature.\n */\nfunction ${fnName}(${paramsJs}) {\n  // TODO: Implement your solution here\n  \n}\n`,
  python: `# Write your solution below.\n# Do not change the function name or signature.\ndef ${fnName}(${paramsPy}):\n    # TODO: Implement your solution here\n    pass\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n// Implement your solution below\nauto ${fnName}(${paramsCpp}) {\n    // TODO: Implement your solution here\n}\n`
});

module.exports = [
  // ==========================================
  // GOOGLE — OA 1, OA 2, OA 3
  // ==========================================
  {
    company: 'Google', oaSet: 1, title: 'Two Sum (Google Warmup)', category: 'DSA', topic: 'Hash Map & Arrays', difficulty: 'Easy', type: 'coding',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
    functionName: 'twoSum',
    starterCode: makeCodingStarter('twoSum', 'nums, target', 'nums, target', 'vector<int>& nums, int target'),
    sampleTestCases: [
      { input: '{"nums":[2,7,11,15],"target":9}', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: '{"nums":[3,2,4],"target":6}', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[3,3],"target":6}', output: '[0,1]' }
    ],
    correctAnswer: 'O(N) Hash Map', explanation: 'Use a hash map to store seen values and their indices.'
  },
  {
    company: 'Google', oaSet: 1, title: 'Graph Shortest Path with BFS', category: 'Core CS subjects', topic: 'Graphs', difficulty: 'Medium', type: 'mcq',
    description: 'In an unweighted directed graph with V vertices and E edges, what is the worst-case time complexity of finding the shortest path from a source vertex using Breadth-First Search (BFS) with an adjacency list?',
    options: [
      { label: 'A', text: 'O(V + E)' },
      { label: 'B', text: 'O(V * E)' },
      { label: 'C', text: 'O(V^2)' },
      { label: 'D', text: 'O(E log V)' }
    ],
    correctAnswer: 'A', explanation: 'BFS visits each vertex once and traverses each edge once in an adjacency list, giving O(V + E).'
  },
  {
    company: 'Google', oaSet: 1, title: 'Maximum Subarray Sum (Kadane)', category: 'DSA', topic: 'Dynamic Programming', difficulty: 'Medium', type: 'coding',
    description: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    functionName: 'maxSubArray',
    starterCode: makeCodingStarter('maxSubArray', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[-2,1,-3,4,-1,2,1,-5,4]}', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6.' },
      { input: '{"nums":[1]}', output: '1', explanation: 'Single element array.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[5,4,-1,7,8]}', output: '23' }
    ],
    correctAnswer: 'Kadane Algorithm O(N)', explanation: 'Maintain current running sum and reset to current element if running sum becomes negative.'
  },
  {
    company: 'Google', oaSet: 2, title: 'Valid Parentheses', category: 'DSA', topic: 'Stacks', difficulty: 'Easy', type: 'coding',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Return `true` or `false`.',
    functionName: 'isValid',
    starterCode: makeCodingStarter('isValid', 's', 's', 'string s'),
    sampleTestCases: [
      { input: '{"s":"()[]{}"}', output: 'true', explanation: 'All brackets match in order.' },
      { input: '{"s":"(]"}', output: 'false', explanation: 'Mismatched bracket types.' }
    ],
    hiddenTestCases: [
      { input: '{"s":"({[]})"}', output: 'true' }
    ],
    correctAnswer: 'Stack O(N)', explanation: 'Push opening brackets onto a stack and verify closing brackets match the stack top.'
  },
  {
    company: 'Google', oaSet: 2, title: 'Amortized Dynamic Array Resize', category: 'Core CS subjects', topic: 'Data Structures', difficulty: 'Medium', type: 'mcq',
    description: 'If a dynamic array doubles its capacity whenever it is full, what is the amortized time complexity of inserting N elements sequentially?',
    options: [
      { label: 'A', text: 'O(N)' },
      { label: 'B', text: 'O(1) per insertion' },
      { label: 'C', text: 'O(log N) per insertion' },
      { label: 'D', text: 'O(N log N)' }
    ],
    correctAnswer: 'B', explanation: 'By the aggregate/accounting method, total copy work over N insertions is < 2N, so amortized cost per insertion is O(1).'
  },
  {
    company: 'Google', oaSet: 3, title: 'Climbing Stairs (DP)', category: 'DSA', topic: 'Dynamic Programming', difficulty: 'Easy', type: 'coding',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    functionName: 'climbStairs',
    starterCode: makeCodingStarter('climbStairs', 'n', 'n', 'int n'),
    sampleTestCases: [
      { input: '{"n":2}', output: '2', explanation: '1+1 or 2' },
      { input: '{"n":3}', output: '3', explanation: '1+1+1, 1+2, or 2+1' }
    ],
    hiddenTestCases: [
      { input: '{"n":5}', output: '8' }
    ],
    correctAnswer: 'Fibonacci DP O(N)', explanation: 'ways(n) = ways(n-1) + ways(n-2).'
  },
  {
    company: 'Google', oaSet: 3, title: 'Consistent Hashing Ring', category: 'Technical MCQs', topic: 'System Design', difficulty: 'Hard', type: 'mcq',
    description: 'In Consistent Hashing with K keys and N servers, when one server is added or removed, approximately how many keys need to be remapped?',
    options: [
      { label: 'A', text: 'K / N' },
      { label: 'B', text: 'K / 2' },
      { label: 'C', text: 'All K keys' },
      { label: 'D', text: 'N * log K' }
    ],
    correctAnswer: 'A', explanation: 'Consistent hashing minimizes key movement to O(K / N) on average when a node joins or leaves.'
  },

  // ==========================================
  // AMAZON — OA 1, OA 2, OA 3
  // ==========================================
  {
    company: 'Amazon', oaSet: 1, title: 'Best Time to Buy and Sell Stock', category: 'DSA', topic: 'Greedy & Arrays', difficulty: 'Easy', type: 'coding',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Maximize your profit by choosing a single day to buy and a future day to sell. Return the maximum profit (or `0` if no profit is possible).',
    functionName: 'maxProfit',
    starterCode: makeCodingStarter('maxProfit', 'prices', 'prices', 'vector<int>& prices'),
    sampleTestCases: [
      { input: '{"prices":[7,1,5,3,6,4]}', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 5.' },
      { input: '{"prices":[7,6,4,3,1]}', output: '0', explanation: 'Prices only decrease, so profit is 0.' }
    ],
    hiddenTestCases: [
      { input: '{"prices":[2,4,1]}', output: '2' }
    ],
    correctAnswer: 'Single pass min-price tracking O(N)', explanation: 'Track minimum price seen so far and compute max(price - minPrice).'
  },
  {
    company: 'Amazon', oaSet: 1, title: 'Amazon Leadership & S3 Consistency', category: 'Technical MCQs', topic: 'Cloud & Architecture', difficulty: 'Medium', type: 'mcq',
    description: 'In distributed databases, what does the CAP theorem state a distributed data store can simultaneously guarantee at most during a network partition?',
    options: [
      { label: 'A', text: 'Consistency and Availability together' },
      { label: 'B', text: 'Either Consistency or Availability, never both' },
      { label: 'C', text: 'Partition Tolerance only without storage' },
      { label: 'D', text: 'All three: C, A, and P simultaneously' }
    ],
    correctAnswer: 'B', explanation: 'When a network partition (P) occurs, a distributed system must choose between Consistency (C) and Availability (A).'
  },
  {
    company: 'Amazon', oaSet: 2, title: 'Contains Duplicate (Shipment IDs)', category: 'DSA', topic: 'Hashing', difficulty: 'Easy', type: 'coding',
    description: 'Given an integer array `nums` representing Amazon shipment IDs, return `true` if any value appears at least twice in the array, and `false` if every element is distinct.',
    functionName: 'containsDuplicate',
    starterCode: makeCodingStarter('containsDuplicate', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[1,2,3,1]}', output: 'true', explanation: '1 appears twice.' },
      { input: '{"nums":[1,2,3,4]}', output: 'false', explanation: 'All elements are unique.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[1,1,1,3,3,4,3,2,4,2]}', output: 'true' }
    ],
    correctAnswer: 'Set O(N)', explanation: 'Insert elements into a Set; if size < array length or element already exists, return true.'
  },
  {
    company: 'Amazon', oaSet: 2, title: 'Deadlock Avoidance Algorithm', category: 'Core CS subjects', topic: 'Operating Systems', difficulty: 'Medium', type: 'mcq',
    description: 'Which algorithm is employed in Operating Systems for Deadlock Avoidance by checking for safe states before allocating resources?',
    options: [
      { label: 'A', text: 'Peterson’s Algorithm' },
      { label: 'B', text: 'Banker’s Algorithm' },
      { label: 'C', text: 'Round Robin' },
      { label: 'D', text: 'SJF Scheduling' }
    ],
    correctAnswer: 'B', explanation: 'Dijkstra’s Banker’s Algorithm verifies whether granting a resource request leaves the system in a safe sequence.'
  },
  {
    company: 'Amazon', oaSet: 3, title: 'Product of Array Except Self', category: 'DSA', topic: 'Prefix & Suffix', difficulty: 'Medium', type: 'coding',
    description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`, without using division.',
    functionName: 'productExceptSelf',
    starterCode: makeCodingStarter('productExceptSelf', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[1,2,3,4]}', output: '[24,12,8,6]', explanation: 'Prefix * suffix products.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[-1,1,0,-3,3]}', output: '[0,0,9,0,0]' }
    ],
    correctAnswer: 'Prefix/Suffix O(N)', explanation: 'Compute left prefix products and multiply by right suffix products in two passes.'
  },
  {
    company: 'Amazon', oaSet: 3, title: 'LRU Cache Eviction Complexity', category: 'DSA', topic: 'Design', difficulty: 'Medium', type: 'mcq',
    description: 'To achieve O(1) time complexity for both `get(key)` and `put(key, value)` in an LRU Cache, which combination of data structures is optimal?',
    options: [
      { label: 'A', text: 'Binary Search Tree + Queue' },
      { label: 'B', text: 'Hash Map + Doubly Linked List' },
      { label: 'C', text: 'Min Heap + Stack' },
      { label: 'D', text: 'Trie + Array' }
    ],
    correctAnswer: 'B', explanation: 'Hash Map provides O(1) lookup, and Doubly Linked List provides O(1) node promotion and tail eviction.'
  },

  // ==========================================
  // MICROSOFT — OA 1, OA 2, OA 3
  // ==========================================
  {
    company: 'Microsoft', oaSet: 1, title: 'Valid Anagram', category: 'DSA', topic: 'Strings & Frequency', difficulty: 'Easy', type: 'coding',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
    functionName: 'isAnagram',
    starterCode: makeCodingStarter('isAnagram', 's, t', 's, t', 'string s, string t'),
    sampleTestCases: [
      { input: '{"s":"anagram","t":"nagaram"}', output: 'true', explanation: 'Same character frequencies.' },
      { input: '{"s":"rat","t":"car"}', output: 'false', explanation: 'Different characters.' }
    ],
    hiddenTestCases: [
      { input: '{"s":"listen","t":"silent"}', output: 'true' }
    ],
    correctAnswer: 'Frequency Array O(N)', explanation: 'Count character frequencies of s and decrement for t.'
  },
  {
    company: 'Microsoft', oaSet: 1, title: 'Virtual Memory & Page Faults', category: 'Core CS subjects', topic: 'Operating Systems', difficulty: 'Medium', type: 'mcq',
    description: 'Which page replacement anomaly occurs when increasing the number of page frames results in an increase in the number of page faults under FIFO?',
    options: [
      { label: 'A', text: 'Thrashing' },
      { label: 'B', text: 'Belady’s Anomaly' },
      { label: 'C', text: 'Internal Fragmentation' },
      { label: 'D', text: 'Starvation' }
    ],
    correctAnswer: 'B', explanation: 'FIFO suffers from Belady’s Anomaly, whereas stack-based algorithms like LRU do not.'
  },
  {
    company: 'Microsoft', oaSet: 2, title: 'Missing Number in Range', category: 'DSA', topic: 'Bit Manipulation / Math', difficulty: 'Easy', type: 'coding',
    description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
    functionName: 'missingNumber',
    starterCode: makeCodingStarter('missingNumber', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[3,0,1]}', output: '2', explanation: 'n = 3, range [0,3], missing 2.' },
      { input: '{"nums":[0,1]}', output: '2', explanation: 'n = 2, missing 2.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[9,6,4,2,3,5,7,0,1]}', output: '8' }
    ],
    correctAnswer: 'Gauss Sum / XOR O(N)', explanation: 'Expected sum n*(n+1)/2 minus actual sum gives the missing number in O(N) time and O(1) space.'
  },
  {
    company: 'Microsoft', oaSet: 2, title: 'DBMS 2NF Criteria', category: 'Core CS subjects', topic: 'DBMS', difficulty: 'Medium', type: 'mcq',
    description: 'Which condition must be strictly satisfied for a relational table to be in Second Normal Form (2NF)?',
    options: [
      { label: 'A', text: 'In 1NF with no partial functional dependencies on any candidate key' },
      { label: 'B', text: 'In 1NF with no transitive dependencies' },
      { label: 'C', text: 'Every determinant is a superkey' },
      { label: 'D', text: 'No foreign keys exist' }
    ],
    correctAnswer: 'A', explanation: '2NF eliminates partial dependencies where a non-prime attribute depends on part of a composite candidate key.'
  },
  {
    company: 'Microsoft', oaSet: 3, title: 'Binary Search', category: 'DSA', topic: 'Searching', difficulty: 'Easy', type: 'coding',
    description: 'Given an array of integers `nums` sorted in ascending order, and an integer `target`, return `target` index if found, otherwise `-1`. Must run in O(log n) time.',
    functionName: 'search',
    starterCode: makeCodingStarter('search', 'nums, target', 'nums, target', 'vector<int>& nums, int target'),
    sampleTestCases: [
      { input: '{"nums":[-1,0,3,5,9,12],"target":9}', output: '4', explanation: '9 exists at index 4.' },
      { input: '{"nums":[-1,0,3,5,9,12],"target":2}', output: '-1', explanation: '2 does not exist.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[5],"target":5}', output: '0' }
    ],
    correctAnswer: 'Binary Search O(log N)', explanation: 'Halve the search interval on each comparison.'
  },
  {
    company: 'Microsoft', oaSet: 3, title: 'HTTP vs HTTPS TLS Handshake', category: 'Core CS subjects', topic: 'Computer Networks', difficulty: 'Medium', type: 'mcq',
    description: 'During a TLS handshake, why does HTTPS use asymmetric encryption initially and then switch to symmetric encryption for data transfer?',
    options: [
      { label: 'A', text: 'Asymmetric encryption is faster than symmetric' },
      { label: 'B', text: 'Symmetric encryption is much faster for bulk data; asymmetric safely exchanges the session key' },
      { label: 'C', text: 'Browsers cannot run symmetric ciphers' },
      { label: 'D', text: 'TLS does not use symmetric keys' }
    ],
    correctAnswer: 'B', explanation: 'Asymmetric cryptography solves key exchange securely, while symmetric cryptography (AES/ChaCha20) encrypts traffic efficiently.'
  },

  // ==========================================
  // INFOSYS — OA 1, OA 2, OA 3 (InfyTQ / SP Style)
  // ==========================================
  {
    company: 'Infosys', oaSet: 1, title: 'Palindrome Number Check', category: 'Programming', topic: 'Math & Logic', difficulty: 'Easy', type: 'coding',
    description: 'Given an integer `x`, return `true` if `x` is a palindrome integer, and `false` otherwise.',
    functionName: 'isPalindrome',
    starterCode: makeCodingStarter('isPalindrome', 'x', 'x', 'int x'),
    sampleTestCases: [
      { input: '{"x":121}', output: 'true', explanation: '121 reads the same forward and backward.' },
      { input: '{"x":-121}', output: 'false', explanation: 'Negative numbers are not palindromes.' }
    ],
    hiddenTestCases: [
      { input: '{"x":10}', output: 'false' }
    ],
    correctAnswer: 'Reverse half or string check', explanation: 'Negative numbers return false; reverse digits and compare.'
  },
  {
    company: 'Infosys', oaSet: 1, title: 'Work & Time Quantitative Aptitude', category: 'Aptitude', topic: 'Work and Time', difficulty: 'Medium', type: 'mcq',
    description: 'Pipe A can fill a tank in 6 hours, while Pipe B can empty it in 8 hours. If both pipes are opened together, in how many hours will the tank be full?',
    options: [
      { label: 'A', text: '14 hours' },
      { label: 'B', text: '24 hours' },
      { label: 'C', text: '18 hours' },
      { label: 'D', text: '12 hours' }
    ],
    correctAnswer: 'B', explanation: 'Net rate = 1/6 - 1/8 = 1/24 per hour, so 24 hours.'
  },
  {
    company: 'Infosys', oaSet: 2, title: 'Move Zeroes to End', category: 'DSA', topic: 'Two Pointers', difficulty: 'Easy', type: 'coding',
    description: 'Given an integer array `nums`, return a new array (or modified array) with all `0`s moved to the end while maintaining the relative order of the non-zero elements.',
    functionName: 'moveZeroes',
    starterCode: makeCodingStarter('moveZeroes', 'nums', 'nums', 'vector<int> nums'),
    sampleTestCases: [
      { input: '{"nums":[0,1,0,3,12]}', output: '[1,3,12,0,0]', explanation: 'Non-zero order preserved.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[0]}', output: '[0]' }
    ],
    correctAnswer: 'Two Pointers O(N)', explanation: 'Keep a write pointer for non-zero elements and fill remaining slots with 0.'
  },
  {
    company: 'Infosys', oaSet: 2, title: 'SQL Aggregate & HAVING Clause', category: 'Core CS subjects', topic: 'DBMS', difficulty: 'Easy', type: 'mcq',
    description: 'In SQL, which clause is used to filter groups created by a `GROUP BY` clause based on an aggregate condition like `COUNT(*) > 5`?',
    options: [
      { label: 'A', text: 'WHERE' },
      { label: 'B', text: 'HAVING' },
      { label: 'C', text: 'ORDER BY' },
      { label: 'D', text: 'DISTINCT' }
    ],
    correctAnswer: 'B', explanation: 'WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY.'
  },
  {
    company: 'Infosys', oaSet: 3, title: 'Single Number (Unique Element)', category: 'DSA', topic: 'Bit Manipulation', difficulty: 'Easy', type: 'coding',
    description: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.',
    functionName: 'singleNumber',
    starterCode: makeCodingStarter('singleNumber', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[4,1,2,1,2]}', output: '4', explanation: '4 appears only once.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[2,2,1]}', output: '1' }
    ],
    correctAnswer: 'XOR O(N)', explanation: 'a ^ a = 0 and a ^ 0 = a, so XORing all elements leaves the unique number.'
  },
  {
    company: 'Infosys', oaSet: 3, title: 'Logical Reasoning: Number Series', category: 'Logical reasoning', topic: 'Series', difficulty: 'Easy', type: 'mcq',
    description: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: [
      { label: 'A', text: '40' },
      { label: 'B', text: '42' },
      { label: 'C', text: '44' },
      { label: 'D', text: '38' }
    ],
    correctAnswer: 'B', explanation: 'Differences are +4, +6, +8, +10, so next is 30 + 12 = 42.'
  },

  // ==========================================
  // TCS — OA 1, OA 2, OA 3 (TCS NQT / Digital)
  // ==========================================
  {
    company: 'TCS', oaSet: 1, title: 'Reverse Words / String', category: 'Programming', topic: 'Strings', difficulty: 'Easy', type: 'coding',
    description: 'Given a string `s`, return the string reversed character by character.',
    functionName: 'reverseString',
    starterCode: makeCodingStarter('reverseString', 's', 's', 'string s'),
    sampleTestCases: [
      { input: '{"s":"hello"}', output: '"olleh"', explanation: 'Reversed string.' },
      { input: '{"s":"PrepAI"}', output: '"IAperP"', explanation: 'Case preserved.' }
    ],
    hiddenTestCases: [
      { input: '{"s":"tcs"}', output: '"sct"' }
    ],
    correctAnswer: 'Two pointers / reverse O(N)', explanation: 'Swap characters from both ends moving inward.'
  },
  {
    company: 'TCS', oaSet: 1, title: 'Profit & Loss Aptitude', category: 'Aptitude', topic: 'Percentages', difficulty: 'Easy', type: 'mcq',
    description: 'A shopkeeper sells an article for ₹540 at a profit of 20%. What was the cost price of the article?',
    options: [
      { label: 'A', text: '₹432' },
      { label: 'B', text: '₹450' },
      { label: 'C', text: '₹480' },
      { label: 'D', text: '₹460' }
    ],
    correctAnswer: 'B', explanation: 'CP = 540 / 1.20 = ₹450.'
  },
  {
    company: 'TCS', oaSet: 2, title: 'Fibonacci Number', category: 'Programming', topic: 'Recursion & DP', difficulty: 'Easy', type: 'coding',
    description: 'Given `n`, calculate `F(n)` where `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n - 1) + F(n - 2)` for `n > 1`.',
    functionName: 'fib',
    starterCode: makeCodingStarter('fib', 'n', 'n', 'int n'),
    sampleTestCases: [
      { input: '{"n":4}', output: '3', explanation: '0, 1, 1, 2, 3' },
      { input: '{"n":6}', output: '8', explanation: 'F(6) = 8' }
    ],
    hiddenTestCases: [
      { input: '{"n":10}', output: '55' }
    ],
    correctAnswer: 'Iterative O(N)', explanation: 'Use two variables to compute iteratively in O(1) space.'
  },
  {
    company: 'TCS', oaSet: 2, title: 'Speed, Distance & Time', category: 'Aptitude', topic: 'Trains', difficulty: 'Medium', type: 'mcq',
    description: 'A train 150 meters long passes a pole in 15 seconds. What is the speed of the train in km/hr?',
    options: [
      { label: 'A', text: '36 km/hr' },
      { label: 'B', text: '40 km/hr' },
      { label: 'C', text: '32 km/hr' },
      { label: 'D', text: '45 km/hr' }
    ],
    correctAnswer: 'A', explanation: 'Speed = 150/15 = 10 m/s = 10 * (18/5) = 36 km/hr.'
  },
  {
    company: 'TCS', oaSet: 3, title: 'Majority Element', category: 'DSA', topic: 'Arrays', difficulty: 'Easy', type: 'coding',
    description: 'Given an array `nums` of size `n`, return the majority element (the element that appears more than `floor(n / 2)` times).',
    functionName: 'majorityElement',
    starterCode: makeCodingStarter('majorityElement', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[3,2,3]}', output: '3', explanation: '3 appears 2 times out of 3.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[2,2,1,1,1,2,2]}', output: '2' }
    ],
    correctAnswer: 'Boyer-Moore Voting O(N)', explanation: 'Maintain a candidate and counter; increment on match, decrement otherwise.'
  },
  {
    company: 'TCS', oaSet: 3, title: 'OOP Polymorphism', category: 'Technical MCQs', topic: 'OOP', difficulty: 'Easy', type: 'mcq',
    description: 'Which concept in Object-Oriented Programming allows a subclass to provide a specific implementation of a method already defined in its parent class?',
    options: [
      { label: 'A', text: 'Method Overloading' },
      { label: 'B', text: 'Method Overriding' },
      { label: 'C', text: 'Encapsulation' },
      { label: 'D', text: 'Static Binding' }
    ],
    correctAnswer: 'B', explanation: 'Method Overriding enables runtime polymorphism when a child class redefines a parent method.'
  },

  // ==========================================
  // DELOITTE — OA 1, OA 2, OA 3 (NLA Style)
  // ==========================================
  {
    company: 'Deloitte', oaSet: 1, title: 'Find Maximum Element in Array', category: 'Programming', topic: 'Arrays', difficulty: 'Easy', type: 'coding',
    description: 'Given an integer array `nums`, return the maximum value present in the array.',
    functionName: 'findMax',
    starterCode: makeCodingStarter('findMax', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[4,9,2,17,6]}', output: '17', explanation: '17 is the largest element.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[-5,-2,-10]}', output: '-2' }
    ],
    correctAnswer: 'Linear Scan O(N)', explanation: 'Track running maximum starting from nums[0].'
  },
  {
    company: 'Deloitte', oaSet: 1, title: 'SQL Joins Behavior', category: 'Core CS subjects', topic: 'DBMS', difficulty: 'Easy', type: 'mcq',
    description: 'Which SQL JOIN returns all rows from the left table and the matched rows from the right table, filling NULL when there is no match?',
    options: [
      { label: 'A', text: 'INNER JOIN' },
      { label: 'B', text: 'LEFT OUTER JOIN' },
      { label: 'C', text: 'CROSS JOIN' },
      { label: 'D', text: 'RIGHT JOIN' }
    ],
    correctAnswer: 'B', explanation: 'LEFT OUTER JOIN preserves all rows from the left table.'
  },
  {
    company: 'Deloitte', oaSet: 2, title: 'Count Vowels in String', category: 'Programming', topic: 'Strings', difficulty: 'Easy', type: 'coding',
    description: 'Given a string `s`, return the total count of vowels (`a, e, i, o, u`, case-insensitive) in `s`.',
    functionName: 'countVowels',
    starterCode: makeCodingStarter('countVowels', 's', 's', 'string s'),
    sampleTestCases: [
      { input: '{"s":"Deloitte"}', output: '4', explanation: 'e, o, i, e -> 4 vowels.' }
    ],
    hiddenTestCases: [
      { input: '{"s":"Rhythm"}', output: '0' }
    ],
    correctAnswer: 'Linear Scan O(N)', explanation: 'Iterate through characters and check against vowel set.'
  },
  {
    company: 'Deloitte', oaSet: 2, title: 'Logical Deduction: Syllogism', category: 'Logical reasoning', topic: 'Syllogisms', difficulty: 'Medium', type: 'mcq',
    description: 'Statements: All analysts are graduates. Some graduates are coders. Conclusion I: Some analysts are coders. Conclusion II: All graduates are analysts. Which follows?',
    options: [
      { label: 'A', text: 'Only Conclusion I follows' },
      { label: 'B', text: 'Only Conclusion II follows' },
      { label: 'C', text: 'Both I and II follow' },
      { label: 'D', text: 'Neither I nor II follows' }
    ],
    correctAnswer: 'D', explanation: 'Neither conclusion is guaranteed by the Venn diagram.'
  },
  {
    company: 'Deloitte', oaSet: 3, title: 'Remove Duplicates from Sorted Array Length', category: 'DSA', topic: 'Two Pointers', difficulty: 'Easy', type: 'coding',
    description: 'Given an integer array `nums` sorted in non-decreasing order, return the count of unique elements.',
    functionName: 'countUnique',
    starterCode: makeCodingStarter('countUnique', 'nums', 'nums', 'vector<int>& nums'),
    sampleTestCases: [
      { input: '{"nums":[1,1,2,2,3]}', output: '3', explanation: 'Unique elements: 1, 2, 3.' }
    ],
    hiddenTestCases: [
      { input: '{"nums":[0,0,1,1,1,2,2,3,3,4]}', output: '5' }
    ],
    correctAnswer: 'Two Pointers / Set O(N)', explanation: 'Count transitions where nums[i] !== nums[i-1].'
  },
  {
    company: 'Deloitte', oaSet: 3, title: 'REST API Idempotency', category: 'Technical MCQs', topic: 'Web Development', difficulty: 'Medium', type: 'mcq',
    description: 'Which HTTP method is NOT idempotent by specification?',
    options: [
      { label: 'A', text: 'GET' },
      { label: 'B', text: 'PUT' },
      { label: 'C', text: 'DELETE' },
      { label: 'D', text: 'POST' }
    ],
    correctAnswer: 'D', explanation: 'POST creates a new resource on each call and is not idempotent.'
  }
];
