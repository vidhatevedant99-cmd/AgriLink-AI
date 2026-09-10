// Centralized API configuration and client abstraction
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

let isDemoMode = false;

// Check if user explicitly chose demo mode or default to live if available
export const getIsDemoMode = (): boolean => {
  const saved = localStorage.getItem("agrilink_demo_mode");
  if (saved !== null) {
    return saved === "true";
  }
  return isDemoMode;
};

export const setIsDemoMode = (enabled: boolean): void => {
  isDemoMode = enabled;
  localStorage.setItem("agrilink_demo_mode", enabled ? "true" : "false");
  window.dispatchEvent(new Event("agrilink_mode_change"));
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for graceful demo fallback

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[AgriLink API] Request to ${endpoint} failed, checking demo mode fallback. Error:`, error);
    throw error;
  }
}
