import axios from "axios";

const currentYear = new Date().getFullYear();

// 직관왕
export const getAttendanceRanking = async () => {
  const res = await axios.get(`/api/ranking/attendance?year=${currentYear}`);
  return res.data;
};
// 직관왕
export const getWinRateRanking = async () => {
  const res = await axios.get(`/api/ranking/win-rate?year=${currentYear}`);
  return res.data;
};
