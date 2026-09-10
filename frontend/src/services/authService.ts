import { User } from "../types";
import { MOCK_USERS } from "../data/mockData";

const AUTH_STORAGE_KEY = "agrilink_auth_user";

export const authService = {
  getCurrentUser(): User {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as User;
      } catch (e) {}
    }
    // Default to Rajesh Patil (Farmer)
    return MOCK_USERS[0];
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("agrilink_auth_change"));
  },

  loginAsRole(role: "farmer" | "buyer"): User {
    const user = role === "farmer" ? MOCK_USERS[0] : MOCK_USERS[2];
    this.setCurrentUser(user);
    return user;
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("agrilink_auth_change"));
  },

  getAvailableDemoUsers(): User[] {
    return MOCK_USERS;
  }
};
