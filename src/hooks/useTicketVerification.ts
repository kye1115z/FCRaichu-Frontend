import { useEffect, useState } from "react";
import type {
  PostVerification,
  TicketType,
  VerificationStatus,
} from "@/types/post";
import { getTicketRequests } from "@/apis/verify/verifyApi";
import { postApproveTicket, postRejectTicket } from "@/apis/verify/verifyApi";

// 티켓 인증 관련 비즈니스 로직
// 데이터 페칭(requests), 승인/거절 처리(handleVerify)

// 일반 티켓, 시즌권 중 어떤 걸 선택했는지 props로 받아옴
export const useTicketVerification = (selectedType: TicketType) => {
  const [requests, setRequests] = useState<PostVerification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 인증 요청 들어온 데이터 조회
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      if (selectedType === "일반 티켓") {
        const res = await getTicketRequests();
        if (res.status === 200) {
          setRequests(res.data.data);
        }
      } else {
        // TODO: 시즌권 티켓 API 구현 예정
        setRequests([]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedType]);

  // 승인/거절 로직 처리
  const handleVerify = async (
    verificationId: number,
    status: VerificationStatus,
  ) => {
    const isApprove = status.status === "ACCEPTED";
    const apiCall = isApprove ? postApproveTicket : postRejectTicket;
    const actionText = isApprove ? "승인" : "거절";

    try {
      const res = await apiCall(verificationId);
      if (res.status === 200) {
        alert(`${verificationId}번 요청이 ${actionText}되었습니다.`);

        // 서버 부르기 전에 상태에서 바로 제거
        setRequests((prev) =>
          prev.filter((req) => req.verificationId !== verificationId),
        );
        // 서버 업데이트
        fetchRequests();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { requests, isLoading, handleVerify };
};
