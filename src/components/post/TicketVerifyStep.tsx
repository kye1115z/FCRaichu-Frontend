import { useNavigate, useOutletContext } from "react-router-dom";
import TicketVerifyUI from "./TicketVerifyUI";

interface PostContext {
  setTicketImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function TicketVerifyStep() {
  const navigation = useNavigate();
  // DONE: Outlet으로 받은 데이터를 TicketVerifyUI에 Props로 넣어준다.
  const { setTicketImage } = useOutletContext<PostContext>();
  // TODO: 이미지 서버로 전송하는 로직 추가
  const handleNextClick = () => {
    navigation("/post/general/new");
  };

  return (
    <TicketVerifyUI
      onImageChange={(file) => setTicketImage(file)}
      onNext={handleNextClick}
    />
  );
}
