import TicketVerifyUI from "@/components/post/TicketVerifyUI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifySeasonPass() {
  const navigate = useNavigate();
  const [seasonTicketImage, setSeasonTicketImage] = useState("");

  // TODO: season ticket 서버에 전송하는 로직 처리
  const handleNextClick = () => {
    console.log(seasonTicketImage);
    navigate("/");
  };

  return (
    <div>
      <TicketVerifyUI
        onImageChange={setSeasonTicketImage}
        onNext={handleNextClick}
      />
    </div>
  );
}
