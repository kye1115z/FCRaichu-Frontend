import type { PostVerification, VerificationStatus } from "@/types/post";

// 리스트: 아코디언 형식으로 (닉네임, 승인/거절 버튼 -> 티켓 이미지)
interface Props {
  request: PostVerification;
  onVerify: (
    verificationId: number,
    status: VerificationStatus,
  ) => Promise<void>;
}
export const TicketRequestCard = ({ request, onVerify }: Props) => {
  return (
    <>
      <div>
        <div>{request.nickname[0]}</div>
        <div>
          <h3>{request.nickname}</h3>
        </div>
        <div>
          <button
            onClick={() =>
              onVerify(request.verificationId, { status: "ACCEPTED" })
            }
          >
            승인
          </button>
          <button
            onClick={() =>
              onVerify(request.verificationId, { status: "REJECTED" })
            }
          >
            거절
          </button>
        </div>
      </div>

      {/* 확장 아코디언 영역 */}
      <div>
        <img
          src={request.ticketImage}
          alt={`${request.nickname}의 티켓 이미지`}
        />
      </div>
    </>
  );
};
