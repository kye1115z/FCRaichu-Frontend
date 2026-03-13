import { api } from "../axiosInstance";

// 경기 일정 전체 조회
export const getGames = async () => {
  const res = await api.get(`/api/games`);
  return res;
};

// 특정 경기 일정 조회
export const getGameById = async (id: number) => {
  const res = await api.get(`/api/games/${id}`);
  return res;
};
