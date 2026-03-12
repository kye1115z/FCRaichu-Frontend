import { useState, useEffect } from "react";

type TicketType = "일반 티켓" | "시즌권";
const REQUEST_TYPES: TicketType[] = ["일반 티켓", "시즌권"];

export interface TicketRequest {
  verificationId: number;
  nickname: string;
  gameInfo: string;
  ticketType: TicketType;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

const MOCK_REQUESTS: TicketRequest[] = [
  {
    verificationId: 1,
    nickname: "수호신123",
    gameInfo: "FC서울 vs 수원삼성 (N석)",
    ticketType: "일반 티켓",
    status: "PENDING",
    submittedAt: "2026-03-11",
  },
  {
    verificationId: 2,
    nickname: "서울의봄",
    gameInfo: "FC서울 vs 전북현대 (E석)",
    ticketType: "일반 티켓",
    status: "PENDING",
    submittedAt: "2026-03-11",
  },
  {
    verificationId: 3,
    nickname: "상암동호랑이",
    gameInfo: "2026 시즌권 (W석)",
    ticketType: "시즌권",
    status: "PENDING",
    submittedAt: "2026-03-10",
  },
  {
    verificationId: 4,
    nickname: "기성용팬",
    gameInfo: "2026 시즌권 (N석)",
    ticketType: "시즌권",
    status: "PENDING",
    submittedAt: "2026-03-10",
  },
];

function TicketRequestCard({
  request,
  onVerify,
}: {
  request: TicketRequest;
  onVerify: (id: number, isApproved: boolean) => void;
}) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      {/* 가짜 썸네일 영역 */}
      <div className="w-full h-40 bg-gray-50 border border-dashed border-gray-300 rounded mb-4 flex items-center justify-center text-gray-400 text-sm">
        티켓 이미지 프리뷰
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-1 mb-4 flex-1">
        <span className="text-xs font-semibold text-gray-500">
          {request.submittedAt}
        </span>
        <strong className="text-lg text-gray-800">{request.nickname}</strong>
        <p className="text-gray-600 text-sm">{request.gameInfo}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onVerify(request.verificationId, false)}
          className="flex-1 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors"
        >
          거절
        </button>
        <button
          onClick={() => onVerify(request.verificationId, true)}
          className="flex-1 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
        >
          승인
        </button>
      </div>
    </div>
  );
}

export default function VerifyTicketAdminTest() {
  const [selectedType, setSelectedType] = useState<TicketType>("일반 티켓");
  const [requests, setRequests] = useState<TicketRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 선택된 탭이 바뀔 때마다 필터링 및 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true);

    // API 통신을 흉내내는 0.5초 타이머
    const timer = setTimeout(() => {
      const filtered = MOCK_REQUESTS.filter(
        (req) => req.ticketType === selectedType,
      );
      setRequests(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedType]);

  // 승인/거절 시 처리 로직
  const handleVerify = (id: number, isApproved: boolean) => {
    // 1. UI에서 즉각적으로 해당 아이템 제거 (낙관적 업데이트)
    setRequests((prev) => prev.filter((req) => req.verificationId !== id));

    // 2. 실제 서버 API 호출 영역 (테스트용 콘솔)
    console.log(`티켓 ID ${id} 처리완료: ${isApproved ? "승인됨" : "거절됨"}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">티켓 인증 관리</h1>
        <p className="text-gray-500">
          티켓 이미지를 확인하고 승인 여부를 결정하세요.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
        {REQUEST_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedType === type
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 리스트 & 상태 렌더링 */}
      <div className="min-h-100">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-gray-500">
            목록을 불러오는 중...
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <TicketRequestCard
                key={req.verificationId}
                request={req}
                onVerify={handleVerify}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            처리할 {selectedType} 요청이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
