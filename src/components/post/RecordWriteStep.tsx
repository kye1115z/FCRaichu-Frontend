import { postMyRecord } from "@/apis/posts/postApi";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PostRequest } from "@/types/post";
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

// 부모로부터 context로 받아온 데이터 활용하기
interface PostContext {
  selectedGameId: number;
}

// DONE: 날짜 데이터를 어떻게 받아올지 -> useOutletContext 사용
export default function RecordWriteStep() {
  const { user } = useAuthStore();
  const navigation = useNavigate();
  // 경기 데이터
  const { selectedGameId } = useOutletContext<PostContext>();

  // 직관 기록 post 시 보낼 데이터 정의
  const [formData, setFormData] = useState<PostRequest>({
    gameId: selectedGameId, // context로 받아온 경기 데이터
    userId: Number(user?.id),
    title: "",
    content: "",
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

    // TODO: 이미지를 string으로 처리할 때 임시 코드. 나중에 file로 바꾸기
    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        setFormData((prev) => ({
          ...prev,
          // 기존 배열에 새로운 Base64 문자열 추가
          images: [...prev.images, base64String],
        }));
      };

      reader.readAsDataURL(file); // 파일을 읽기 시작
    });

    // setFormData((prev) => ({
    //   ...prev,
    //   images: [...prev.images, ...selectedFiles], // 기존 이미지 배열에 새로 선택한 이미지 이어 붙임.
    // }));

    e.target.value = "";
  };

  // DONE: 제출 로직 작성하기
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await postMyRecord(formData);
      if (res.status === 201) {
        alert("직관 기록이 완료되었습니다.");
        navigation(`/post/${res.data.userId}/all`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4"
    >
      <input
        type="text"
        placeholder="제목을 입력하세요"
        onChange={handleTitleChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
      />

      <textarea
        placeholder="직관 후기를 작성해주세요"
        onChange={handleTextAreaChange}
        className="w-full min-h-50 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 resize-y"
      ></textarea>

      {/* TODO: 다중 이미지 프리뷰 영역 */}
      <div className="w-full min-h-25 p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-400 text-sm flex items-center justify-center">
        이미지 프리뷰가 표시될 공간
      </div>

      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        multiple
        name="ticket_image"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-gray-200 file:text-gray-700
          hover:file:bg-gray-300 cursor-pointer"
      />

      <button
        type="submit"
        className="w-full py-3 mt-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        Send
      </button>
    </form>
  );
}
