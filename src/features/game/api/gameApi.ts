import { api } from "@api/axiosInstance";

// 경기 일정 연/월 조회
export const getGames = async (year: number, month: number) => {
  const res = await api.get(`/api/games?year=${year}&month=${month}`);
  return res.data;
};

// 특정 경기 일정 조회
export const getGameById = async (id: number) => {
  const res = await api.get(`/api/games/${id}`);
  return res.data;
};

// GUEST의 경기 연/월 조회
export const getGuestGames = async (year: number, month: number) => {
  const res = await api.get(`/api/games/guest?year=${year}&month=${month}`);
  return res.data;
};

// 경기 일정 전체 조회
export const getAllGames = async () => {
  const res = await api.get(`/api/games/all`);
  return res.data;
};
