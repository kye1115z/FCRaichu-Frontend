import { api } from "../axiosInstance";

const currentYear = new Date().getFullYear();

// 직관왕
export const getAttendanceRanking = async () => {
  const res = await api.get(`/api/rankings/attendance?year=${currentYear}`);
  return res.data;
};
// 직관왕
export const getWinRateRanking = async () => {
  const res = await api.get(`/api/rankings/win-rate?year=${currentYear}`);
  return res.data;
};
