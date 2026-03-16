import Typography from "@/styles/common/Typography";

interface Props {
  step: number;
  stepName: string[];
}

// 혹시 다음에도 사용할 수 있으니 컴포넌트에 props 받아서 사용하는 방식으로 만들기
//
export const StepTracker = ({ step, stepName }: Props) => {
  return (
    <div className="flex gap-4">
      {/* DONE: 현재 스텝(stepName[step-1]이랑 이름이 같으면 뒤에 active 원 하나 더 붙이기) */}
      {stepName.map((name, index) => {
        const isCompletedOrActive = index <= step - 1;
        const isActive = index === step - 1;
        const isLast = index === stepName.length - 1;

        return (
          <div key={name} className="flex items-center mb-6">
            <div className="flex flex-col items-center gap-2 relative">
              {/* 현재 스텝이거나 현재 스텝보다 이전이라면 primary로 색상 입히기 / 아니면 disabledGray */}
              {/* 원형 아이콘 영역 */}
              <div className="flex items-center justify-center w-8 h-8">
                {isActive && (
                  <div className="absolute w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
                )}
                {/* 얘가 메인 빨간 원 */}
                <div
                  className={`relative z-10 rounded-full w-4 h-4 ${
                    isCompletedOrActive ? "bg-primary" : "bg-disabledGray"
                  }`}
                />
              </div>
              <Typography
                variant="body-xs"
                color={
                  stepName.indexOf(name) <= step - 1
                    ? "text-primary"
                    : "text-disabledGray"
                }
              >
                {name}
              </Typography>
            </div>
            {/* 스텝 사이 연결하는 선 */}
            {!isLast && (
              <div
                className={`w-12 h-0.5 ml-2 ${
                  index < step - 1 ? "bg-primary" : "bg-disabledGray"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
