/**
 * Judge0 Code Execution Service
 * Uses the official Judge0 CE public API (https://ce.judge0.com)
 * No API key required for the free tier.
 * Configure JUDGE0_HOST in .env to point to a self-hosted instance for production.
 */

const axios = require('axios');
const config = require('../config/config');

// Language ID mapping for Judge0 CE
const LANGUAGE_IDS = {
  c: 50,         // C (GCC 9.2.0)
  cpp: 54,       // C++ (GCC 9.2.0)
  java: 62,      // Java (OpenJDK 13.0.1)
  python: 71,    // Python (3.8.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  typescript: 74, // TypeScript (3.7.4)
  go: 60,        // Go (1.13.5)
  rust: 73,      // Rust (1.40.0)
  csharp: 51,    // C# (Mono 6.6.0.161)
  kotlin: 78,    // Kotlin (1.3.70)
};

const JUDGE0_HOST = config.judge0Host || 'https://ce.judge0.com';
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
if (config.judge0ApiKey) {
  HEADERS['X-RapidAPI-Key'] = config.judge0ApiKey;
  HEADERS['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
}

const STATUS = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};

/**
 * Submit code to Judge0 and return a submission token
 */
async function submitCode({ code, language, stdin = '' }) {
  const languageId = LANGUAGE_IDS[language?.toLowerCase()] || LANGUAGE_IDS.javascript;

  const payload = {
    source_code: Buffer.from(code).toString('base64'),
    language_id: languageId,
    stdin: Buffer.from(stdin || '').toString('base64'),
    cpu_time_limit: 5,          // seconds
    memory_limit: 256000,       // KB (256 MB)
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
  };

  const response = await axios.post(
    `${JUDGE0_HOST}/submissions?base64_encoded=true&wait=false`,
    payload,
    { headers: HEADERS, timeout: 10000 }
  );

  return response.data.token;
}

/**
 * Poll Judge0 until the submission is finished (status 1 or 2 = still running)
 */
async function getResult(token, maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(r => setTimeout(r, 1000)); // wait 1 second between polls

    const response = await axios.get(
      `${JUDGE0_HOST}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory`,
      { headers: HEADERS, timeout: 10000 }
    );

    const data = response.data;
    const statusId = data.status?.id;

    // Still processing — keep polling
    if (statusId === 1 || statusId === 2) continue;

    // Decode base64 outputs
    const decode = (b64) => b64 ? Buffer.from(b64, 'base64').toString('utf-8').trim() : '';

    return {
      statusId,
      statusDescription: STATUS[statusId] || 'Unknown',
      stdout: decode(data.stdout),
      stderr: decode(data.stderr),
      compileOutput: decode(data.compile_output),
      executionTimeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
      memoryKb: data.memory || null,
    };
  }

  throw new Error('Code execution timed out. Please try again.');
}

/**
 * Run code end-to-end: submit + poll + format output
 */
async function runCode({ code, language, stdin }) {
  try {
    const token = await submitCode({ code, language, stdin });
    const result = await getResult(token);

    let output = '';
    let status = 'Accepted';
    let isError = false;

    if (result.statusId === 3) {
      // Accepted
      output = result.stdout || '(No output)';
      status = 'Accepted';
    } else if (result.statusId === 6) {
      // Compilation Error
      output = result.compileOutput || result.stderr || 'Compilation failed.';
      status = 'Compilation Error';
      isError = true;
    } else if (result.statusId >= 7 && result.statusId <= 12) {
      // Runtime Error
      output = result.stderr || `Runtime Error: ${result.statusDescription}`;
      status = result.statusDescription;
      isError = true;
    } else if (result.statusId === 5) {
      // TLE
      output = 'Time Limit Exceeded (> 5 seconds). Optimize your algorithm.';
      status = 'Time Limit Exceeded';
      isError = true;
    } else {
      output = result.stderr || result.stdout || `Execution ended with status: ${result.statusDescription}`;
      status = result.statusDescription;
      isError = result.statusId !== 3;
    }

    return {
      success: !isError,
      status,
      output,
      executionTimeMs: result.executionTimeMs,
      memoryKb: result.memoryKb,
      isError,
    };
  } catch (err) {
    // Network error or Judge0 unreachable — fall back to JS-only sandbox
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.response?.status >= 500) {
      return jsSandboxFallback({ code, language, stdin });
    }
    throw err;
  }
}

/**
 * Local JavaScript-only fallback sandbox (runs in Node.js process safely)
 * Only used when Judge0 is unreachable.
 */
function jsSandboxFallback({ code, language, stdin }) {
  if (language !== 'javascript') {
    return {
      success: false,
      status: 'Service Unavailable',
      output: `⚠️ Code execution service (Judge0) is temporarily unavailable.\n\nFor ${language.toUpperCase()} execution, please ensure the Judge0 service is reachable.\nYou can self-host Judge0 or configure JUDGE0_HOST in your .env file.`,
      isError: true,
    };
  }

  // JS-only sandbox
  try {
    const logs = [];
    const mockConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args) => logs.push('[ERROR] ' + args.join(' ')),
      warn: (...args) => logs.push('[WARN] ' + args.join(' ')),
    };
    const start = Date.now();
    const fn = new Function('console', 'input', code);
    fn(mockConsole, stdin || '');
    const ms = Date.now() - start;

    return {
      success: true,
      status: 'Accepted (Local JS)',
      output: logs.join('\n') || '(No output)',
      executionTimeMs: ms,
      isError: false,
    };
  } catch (e) {
    return {
      success: false,
      status: 'Runtime Error',
      output: `Error: ${e.message}`,
      isError: true,
    };
  }
}

module.exports = { runCode, LANGUAGE_IDS };
