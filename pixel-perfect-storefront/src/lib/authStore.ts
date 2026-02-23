const AUTH_KEY = "ecommerce_auth";

export interface AuthUser {
  name: string;
  email: string;
}

export function getUser(): AuthUser | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function loginUser(email: string, _password: string, name?: string): AuthUser {
  const user: AuthUser = { name: name || email.split("@")[0], email };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-updated"));
  return user;
}

export function registerUser(name: string, email: string, _password: string): AuthUser {
  return loginUser(email, _password, name);
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth-updated"));
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
