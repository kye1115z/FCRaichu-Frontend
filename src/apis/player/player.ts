import { api } from "../axiosInstance";

// 현역 선수 전체 조회
export const getAllActivePlayers = async () => {
  const res = await api.get(`/api/players/active`);
  return res.data;
};

// donation
export const postDonation = async (playerId: number, points: number) => {
  const res = await api.post(`/api/donation/${playerId}?point=${points}`);
  return res.data;
};
