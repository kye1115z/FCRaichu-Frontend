import { api } from "../axiosInstance";

// 경기 일정 전체 조회
export const getGames = async (year: number, month: number) => {
  const res = await api.get(`/api/games?year=${year}&month=${month}`);
  return res;
};

// 특정 경기 일정 조회
export const getGameById = async (id: number) => {
  const res = await api.get(`/api/games/${id}`);
  return res;
};

// GUEST의 경기 전체 일정 조회
export const getGuestGames = async (year: number, month: number) => {
  const res = await api.get(`/api/games/guest?year=${year}&month=${month}`);
  return res;
};
