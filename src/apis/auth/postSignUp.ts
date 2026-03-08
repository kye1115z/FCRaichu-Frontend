import type { SignUpRequest } from "@/types/auth";
import { api } from "../axiosInstance";

// 회원가입 로직
export const postSingUp = async (data: SignUpRequest) => {
  const res = await api.post(`/api/users`, data);
  return res; // 성공 시 201 Created 응답 반환
};
