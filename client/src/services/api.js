const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('prepai_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && !window.location.pathname.includes('/login')) {
      // Optional: Clear token if invalid session
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const api = {
  // Auth
  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  register: (userData) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),

  forgotPassword: (email) =>
    fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    }).then(handleResponse),

  resetPassword: (data) =>
    fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Profile
  getProfile: () =>
    fetch(`${API_BASE}/profile`, {
      headers: getHeaders()
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    }).then(handleResponse),

  // AI & Chat
  getAIStatus: () =>
    fetch(`${API_BASE}/ai/status`).then(handleResponse),

  sendChatMessage: (data) =>
    fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  generateAiNotes: (data) =>
    fetch(`${API_BASE}/ai/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  generateAiRoadmap: (data) =>
    fetch(`${API_BASE}/ai/roadmap`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Conversations
  getConversations: () =>
    fetch(`${API_BASE}/conversations`, {
      headers: getHeaders()
    }).then(handleResponse),

  getConversationById: (id) =>
    fetch(`${API_BASE}/conversations/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  createConversation: (data) =>
    fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteConversation: (id) =>
    fetch(`${API_BASE}/conversations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Mock Interviews
  startInterview: (config) =>
    fetch(`${API_BASE}/interviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(config)
    }).then(handleResponse),

  getInterviews: () =>
    fetch(`${API_BASE}/interviews`, {
      headers: getHeaders()
    }).then(handleResponse),

  getInterviewById: (id) =>
    fetch(`${API_BASE}/interviews/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  submitInterview: (id, answers) =>
    fetch(`${API_BASE}/interviews/${id}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers })
    }).then(handleResponse),

  // Assessments
  getAssessments: () =>
    fetch(`${API_BASE}/assessments`, {
      headers: getHeaders()
    }).then(handleResponse),

  getAssessmentQuestions: (params = {}) => {
    const query = typeof params === 'string'
      ? `category=${encodeURIComponent(params)}`
      : new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/assessments/questions?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  runTestCases: (data) =>
    fetch(`${API_BASE}/assessments/run-tests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  submitAssessment: (data) =>
    fetch(`${API_BASE}/assessments/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  runCode: (codeData) =>
    fetch(`${API_BASE}/assessments/run-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(codeData)
    }).then(handleResponse),

  // Study Materials
  getStudyMaterials: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/study?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  getStudyMaterialById: (id) =>
    fetch(`${API_BASE}/study/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  toggleBookmark: (id) =>
    fetch(`${API_BASE}/study/${id}/bookmark`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  toggleComplete: (id) =>
    fetch(`${API_BASE}/study/${id}/complete`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  // Notes
  getNotes: () =>
    fetch(`${API_BASE}/notes`, {
      headers: getHeaders()
    }).then(handleResponse),

  saveNote: (data) =>
    fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  getNoteById: (id) =>
    fetch(`${API_BASE}/notes/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  updateNote: (id, data) =>
    fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteNote: (id) =>
    fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Roadmaps
  getRoadmaps: () =>
    fetch(`${API_BASE}/roadmaps`, {
      headers: getHeaders()
    }).then(handleResponse),

  createRoadmap: (data) =>
    fetch(`${API_BASE}/roadmaps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  toggleRoadmapTask: (roadmapId, taskId) =>
    fetch(`${API_BASE}/roadmaps/${roadmapId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  // Analytics
  getAnalyticsOverview: () =>
    fetch(`${API_BASE}/analytics/overview`, {
      headers: getHeaders()
    }).then(handleResponse)
};
