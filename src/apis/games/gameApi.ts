import { api } from "../axiosInstance";

// 경기 일정 전체 조회
export const getGames = async () => {
  // const res = await api.get(`/api/games?year=2026&month=3`);
  const res = await api.get(`/api/games?year=2026&month=3`);
  return res;
};

// 특정 경기 일정 조회
export const getGameById = async (id: number) => {
  const res = await api.get(`/api/games/${id}`);
  return res;
};
