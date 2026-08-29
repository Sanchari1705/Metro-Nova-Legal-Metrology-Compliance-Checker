export type UserRole = 'inspector' | 'admin' | 'consumer' | 'manufacturer';

export type AuthUser = {
  role: UserRole;
  displayName: string;
  identifier: string;
};

type Credential = {
  role: UserRole;
  name: string;
  identifiers: string[];
  password: string;
};

export type SignInResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: 'invalid' | 'mismatch' };

const credentials: Credential[] = [
  { role: 'inspector', name: 'Enforcement Inspector', identifiers: ['inspector@test.com', '9876500001'], password: 'inspector123' },
  { role: 'admin', name: 'State Admin', identifiers: ['admin@test.com', '9876500002'], password: 'admin123' },
  { role: 'consumer', name: 'Consumer / Complainant', identifiers: ['consumer@test.com', '9876500003'], password: 'consumer123' },
  { role: 'manufacturer', name: 'Manufacturer / Producer', identifiers: ['manufacturer@test.com', '9876500004'], password: 'manufacturer123' },
];

const storageKey = 'metro-nova-auth';

function getStorage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export const authService = {
  signIn(identifier: string, password: string, selectedRole: UserRole, remember: boolean): SignInResult {
    const normalized = identifier.trim().toLowerCase();
    const match = credentials.find((item) => item.identifiers.includes(normalized));
    if (!match || match.password !== password) return { ok: false, error: 'invalid' };
    if (match.role !== selectedRole) return { ok: false, error: 'mismatch' };
    const user = { role: match.role, displayName: match.name, identifier: normalized };
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    getStorage(remember).setItem(storageKey, JSON.stringify(user));
    return { ok: true, user };
  },
  getUser(): AuthUser | null {
    const value = localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey);
    if (!value) return null;
    try { return JSON.parse(value) as AuthUser; } catch { return null; }
  },
  signOut() {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  },
};