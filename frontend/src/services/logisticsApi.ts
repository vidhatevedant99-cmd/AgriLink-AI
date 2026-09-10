import { LogisticsInfo } from "../types";
import { apiFetch, getIsDemoMode } from "./api";
import { MOCK_LOGISTICS_INFO } from "../data/mockData";

export const logisticsApi = {
  async getLogisticsForMatch(matchId: string): Promise<LogisticsInfo> {
    if (!getIsDemoMode()) {
      try {
        const data = await apiFetch<LogisticsInfo>(`/api/logistics/${matchId}`);
        if (data && data.distance_km) {
          return data;
        }
      } catch (e) {}
    }
    return {
      ...MOCK_LOGISTICS_INFO,
      match_id: matchId
    };
  }
};
