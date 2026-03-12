import { useNavigate, useOutletContext } from "react-router-dom";

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
  return <button onClick={handleNextClick}>NEXT</button>;
};
