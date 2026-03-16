import { api } from "../axiosInstance";

// 현역 선수 전체 조회
export const getAllActivePlayers = async () => {
  const res = await api.get(`/api/players/active`);
  return res;
};
