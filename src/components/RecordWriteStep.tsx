import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

interface FormData {
  gameId: number;
  title: string;
  content: string;
  ticketImage: string;
  images: File[];
}

// 부모로부터 context로 받아온 데이터 활용하기
interface PostContext {
  selectedGameId: number;
  ticketImage: string;
}

// TODO: 날짜 데이터를 어떻게 받아올지?
export default function RecordWriteStep() {
  const navigation = useNavigate();
  // 경기 데이터
  const { selectedGameId, ticketImage } = useOutletContext<PostContext>();

  // 직관 기록 post 시 보낼 데이터 정의
  const [formData, setFormData] = useState<FormData>({
    gameId: selectedGameId, // context로 받아온 경기 데이터
    title: "",
    content: "",
    ticketImage: ticketImage, // context로 받아온 티켓 이미지 데이터
    images: [],
  });

  // textarea = content 입력 받기
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      content: e.target.value,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  // DONE: 이미지 여러 개
  // image = images를 file 배열로 입력 받기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // FileList를 배열로 변환
    const selectedFiles = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles], // 기존 이미지 배열에 새로 선택한 이미지 이어 붙임.
    }));

    e.target.value = "";
  };

  // TODO: 제출 로직 작성하기
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    navigation("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="제목" onChange={handleTitleChange} />
      <textarea onChange={handleTextAreaChange}></textarea>
      {/* TODO: 이미지 프리뷰 */}
      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        multiple // 이미지 여러 개 받을 수 있게끔
        name="ticket_image"
        onChange={handleImageChange}
      />
      <button type="submit">Send</button>
    </form>
  );
}
