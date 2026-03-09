// 인증 요청이 들어온 게시글에서 티켓을 admin에게 띄움
// 관리자는 해당 티켓을 보고 `verificationId`를 넘겨주며 승인/거절
import { TicketRequestCard } from "@/components/verify/TicketRequestCard";
import { useTicketVerification } from "@/hooks/useTicketVerification";
import type { TicketType } from "@/types/post";
import { useState } from "react";

const REQUEST_TYPES: TicketType[] = ["일반 티켓", "시즌권"];

export default function VerifyTicketAdmin() {
  const [selectedType, setSelectedType] = useState<TicketType>("일반 티켓");

  // 비즈니스 로직을 훅으로 위임(데이터 패칭, 승인/거절 처리)
  const { requests, isLoading, handleVerify } =
    useTicketVerification(selectedType);

  return (
    <div>
      <h1>티켓 인증 관리</h1>
      <p>티켓 이미지를 확인하고 승인 여부를 결정하세요.</p>

      {/* TODO: 일반 유저와 시즌권 두 개로 나눠서 클릭한 값에 해당하는 리스트만 보여줄 것. */}
      {REQUEST_TYPES.map((type) => (
        <button key={type} onClick={() => setSelectedType(type)}>
          {type}
        </button>
      ))}

      {/* 리스트: 로딩 로직 */}
      <div>
        {isLoading ? (
          <p>목록을 불러오는 중...</p>
        ) : requests.length > 0 ? (
          requests.map((req) => (
            <TicketRequestCard
              key={req.verificationId}
              request={req}
              onVerify={handleVerify}
            />
          ))
        ) : (
          <p>목록이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
