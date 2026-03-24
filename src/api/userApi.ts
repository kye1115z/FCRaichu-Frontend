import { api } from "./axiosInstance";

// 경기 일정 전체 조회
export const getAllUsers = async () => {
  const res = await api.get(`/api/admin/users`);
  return res;
};
