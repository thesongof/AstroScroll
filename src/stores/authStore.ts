import { create } from 'zustand';

export type UserRole = 'user' | 'admin';

interface User {
  username: string;
  role: UserRole;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const hardcodedUsers: Record<string, { password: string; role: UserRole }> = {
  admin: { password: 'admin123', role: 'admin' },
  user: { password: 'user123', role: 'user' },
  researcher: { password: 'research123', role: 'user' },
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (username: string, password: string) => {
    const userData = hardcodedUsers[username];
    if (userData && userData.password === password) {
      set({
        isAuthenticated: true,
        user: {
          username,
          role: userData.role,
        },
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));