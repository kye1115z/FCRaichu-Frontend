import { api } from "../axiosInstance";

// 직관 기록 전체 조회
export const getMyAllRecords = async () => {
  const res = await api.get(`/api/posts`);
  return res;
};
