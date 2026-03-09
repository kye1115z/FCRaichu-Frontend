import { api } from "../axiosInstance";

// 인증을 요청한 게시글을 admin에서 조회
export const getTicketRequests = async () => {
  const res = await api.get(`/api/admin/verifications/posts`);
  return res;
};

// 티켓 인증 APPROVED
export const postApproveTicket = async (verificationId: number) => {
  const res = await api.post(
    `/api/admin/verifications/posts/${verificationId}/approve`,
    verificationId,
  );
  return res;
};

// 티켓 인증 REJECTED
export const postRejectTicket = async (verificationId: number) => {
  const res = await api.post(
    `/api/admin/verifications/posts/${verificationId}/reject`,
    verificationId,
  );
  return res;
};
