const API_BASE = '/api';

async function safeParseJson(response) {
  const text = await response.text();
  if (!text || !text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return { error: text || `Server error (${response.status})` };
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('careerverify_token') || '';
  const savedUser = localStorage.getItem('careerverify_user');
  let role = 'candidate';
  let email = '';
  let id = '';
  if (savedUser) {
    try {
      const u = JSON.parse(savedUser);
      role = u.role || 'candidate';
      email = u.email || '';
      id = u.id || u._id || '';
    } catch (e) {}
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-user-role': role,
    'x-user-email': email,
    'x-user-id': id,
  };
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Login failed (Status ${response.status}).`);
  }
  return data;
}

export async function signupUser(name, email, password, role = 'candidate') {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Signup failed (Status ${response.status}).`);
  }
  return data;
}

export async function predictJob(jobText, jobTitle) {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ job_text: jobText, jobTitle }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to analyze job posting (Status ${response.status}).`);
  }
  return data;
}

export async function scrapeJobUrl(url) {
  const response = await fetch(`${API_BASE}/scrape-job`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ url }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to scrape job URL (Status ${response.status}).`);
  }
  return data;
}

export async function verifyCompany(companyName, website, email) {
  const response = await fetch(`${API_BASE}/verify-company`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ companyName, website, email }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to verify company (Status ${response.status}).`);
  }
  return data;
}

export async function getBlacklist() {
  const response = await fetch(`${API_BASE}/blacklist`, {
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch scam blacklist (Status ${response.status}).`);
  }
  return data;
}

export async function reportScam(reportData) {
  const response = await fetch(`${API_BASE}/report-scam`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reportData),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to submit scam report (Status ${response.status}).`);
  }
  return data;
}

export async function upvoteScam(id) {
  const response = await fetch(`${API_BASE}/blacklist/${id}/upvote`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to upvote scam report (Status ${response.status}).`);
  }
  return data;
}

export async function analyzePhishing(messageText) {
  const response = await fetch(`${API_BASE}/analyze-phishing`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ messageText }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to analyze phishing message (Status ${response.status}).`);
  }
  return data;
}

export async function getHistory(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/history?${query}`, {
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch history logs (Status ${response.status}).`);
  }
  return data;
}

export async function deleteHistoryItem(id) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to delete history record (Status ${response.status}).`);
  }
  return data;
}

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE}/stats`, {
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch dashboard telemetry (Status ${response.status}).`);
  }
  return data;
}

// ==========================================
// ADMIN CONTROL CENTER API SERVICES
// ==========================================

export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/admin/users?${query}`, {
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch users (Status ${response.status}).`);
  }
  return data;
}

export async function createAdminUser(userData) {
  const response = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to create user (Status ${response.status}).`);
  }
  return data;
}

export async function updateUserRole(userId, role) {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to update user role (Status ${response.status}).`);
  }
  return data;
}

export async function deleteUserByAdmin(userId) {
  const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to delete user account (Status ${response.status}).`);
  }
  return data;
}

export async function getAdminAnalytics() {
  const response = await fetch(`${API_BASE}/admin/analytics`, {
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch admin telemetry (Status ${response.status}).`);
  }
  return data;
}

export async function deleteScamReportByAdmin(reportId) {
  const response = await fetch(`${API_BASE}/admin/scam-reports/${reportId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to delete scam report (Status ${response.status}).`);
  }
  return data;
}

export async function purgeHistoryByAdmin() {
  const response = await fetch(`${API_BASE}/admin/system/purge-history`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to purge history logs (Status ${response.status}).`);
  }
  return data;
}

export async function getAdminAuditLogs() {
  const response = await fetch(`${API_BASE}/admin/audit-logs`, {
    headers: getAuthHeaders(),
  });
  const data = await safeParseJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch audit logs (Status ${response.status}).`);
  }
  return data;
}
