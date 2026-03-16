// 출석체크 모달
// 데이터에 들어오는 checkPoint의 값이 0이면 이미 출석체크 한 것. 아니라면 출석체크 안 함
// 이미 Zustand에서 checkPoint의 값을 저장하고 있으니까 다른 값 넘겨줄 필요 없이 직접 불러오도록 하자.
// checkPoint의 값에 따라서 홈 컴포넌트에서 모달 노출 여부를 결정하도록 하자.
// 여기서는 디자인만!!

import Typography from "@/styles/common/Typography";
import Button from "./Button";

interface AttendanceModalProps {
  point: number;
  onClose: () => void;
}

export const AttendanceCheckModal = ({
  point,
  onClose,
}: AttendanceModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-80 flex flex-col items-center shadow-xl animate-in fade-in zoom-in duration-300">
        {/* TODO: 이미지 예쁜 걸로 넣어볼까 불 말고 */}
        <div className="w-16 h-16 bg-line rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🔥</span>
        </div>

        <Typography variant="h3" color="text-primary" className="mb-2">
          출석 완료!
        </Typography>

        <Typography
          variant="body-md"
          color="text-gray-500"
          className="text-center mb-6"
        >
          오늘 <span className="font-bold text-secondary">{point}P</span>를
          획득했습니다.
        </Typography>

        <Button onClick={onClose} width="full" className="py-3">
          확인
        </Button>
      </div>
    </div>
  );
};
