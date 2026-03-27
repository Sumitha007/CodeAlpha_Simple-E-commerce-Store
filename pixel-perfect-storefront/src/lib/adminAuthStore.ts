const ADMIN_AUTH_KEY = "ecommerce_admin_auth";
const ADMIN_TOKEN_KEY = "ecommerce_admin_token";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function getAdminUser(): AdminUser | null {
  try {
    const data = localStorage.getItem(ADMIN_AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export async function adminLogin(email: string, password: string) {
  const response = await fetch('http://localhost:5000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('Admin API is not available. Restart backend server on port 5000 with latest code.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(data.admin));
  localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  window.dispatchEvent(new Event("admin-auth-updated"));

  return data.admin;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new Event("admin-auth-updated"));
}

export function isAdminLoggedIn(): boolean {
  return getAdminUser() !== null && getAdminToken() !== null;
}
