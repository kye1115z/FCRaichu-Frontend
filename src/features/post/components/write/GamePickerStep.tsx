import { useNavigate, useOutletContext } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

interface ContextType {
  selectedGameId: number;
}

// 경기 아이디만 선택하는 컴포넌트 (첫 번째 단계)
export const GamePicker = () => {
  const navigate = useNavigate();

  const { selectedGameId } = useOutletContext<ContextType>();

  const handleNextClick = () => {
    if (selectedGameId) {
      navigate("/post/new", {
        state: { gameId: selectedGameId },
      });
    }
  };
  return (
    <div className="flex justify-end w-full max-w-5xl mt-8">
      <button
        onClick={handleNextClick}
        disabled={!selectedGameId}
        className={`
          flex items-center justify-center gap-2 
          px-8 py-2.5 rounded-xl font-bold text-lg text-white
          transition-all duration-200
          ${
            selectedGameId
              ? "bg-primary hover:bg-hover active:scale-95 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }
        `}
      >
        <HiOutlineArrowRight className="text-xl" />
        NEXT
      </button>
    </div>
  );
};
