import { postMyRecord } from "@/apis/posts/postApi";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PostRequest } from "@/types/post";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { TbPhotoPlus } from "react-icons/tb";
import { PiSmileyFill } from "react-icons/pi";
import { LuFilePen } from "react-icons/lu";
import { HiPlus } from "react-icons/hi";
import { IoCloseCircle } from "react-icons/io5";
import Typography from "@/styles/common/Typography";

// 부모로부터 context로 받아온 데이터 활용하기
interface PostContext {
  selectedGameId: number;
}

// DONE: 날짜 데이터를 어떻게 받아올지 -> useOutletContext 사용
export default function RecordWriteStep() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  // 경기 데이터
  const { selectedGameId } = useOutletContext<PostContext>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 직관 기록 post 시 보낼 데이터 정의
  const [formData, setFormData] = useState<Omit<PostRequest, "images">>({
    gameId: selectedGameId,
    userId: Number(user?.id),
    title: "",
    content: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };

  // textarea = content 입력 받기
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  // DONE: 이미지 여러 개
  // image = images를 file 배열로 입력 받기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // FileList를 배열로 변환
    const selectedFiles = Array.from(files);
    // 4개만 업로드 허용하도록
    const availableSlots = 4 - imageFiles.length;

    if (availableSlots <= 0) {
      alert("이미지는 최대 4장까지 업로드 할 수 있습니다.");
      return;
    }

    const filesToUpload = selectedFiles.slice(0, availableSlots);
    const newPreviews = filesToUpload.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...filesToUpload]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // 동일 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // 메모리 해제
      return prev.filter((_, i) => i !== index);
    });
  };

  // DONE: 제출 로직 작성하기
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await postMyRecord({
        ...formData,
        images: imageFiles,
      } as PostRequest);
      if (res.status === 201) {
        alert("직관 기록이 완료되었습니다.");
        navigate(`/post/${res.data.userId}/all`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 메모리 누수 방지: 컴포넌트 언마운트 시 ObjectURL 해제
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto pt-2 flex flex-col gap-10"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* 왼쪽 섹션: 텍스트 입력 */}
        <div className="flex-1 flex flex-col gap-8">
          {/* 제목 입력 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-textMain">
              <LuFilePen className="text-xl" />
              <Typography
                variant="body-lg"
                color="text-textMain"
                className="font-bold!"
              >
                제목
              </Typography>
            </div>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              onChange={handleTitleChange}
              className="w-full p-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-disabled transition-all text-lg"
            />
          </div>

          {/* 후기 입력 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-textMain">
              <PiSmileyFill className="text-xl" />
              <Typography
                variant="body-lg"
                color="text-textMain"
                className="font-bold!"
              >
                직관 후기
              </Typography>
            </div>
            <textarea
              placeholder="오늘 경기는 어땠나요? 상세한 후기를 남겨주세요."
              onChange={handleTextAreaChange}
              className="w-full min-h-72 p-5 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-disabled transition-all text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white font-bold text-xl rounded-xl hover:bg-hover transition-all shadow-lg active:scale-[0.98] cursor-pointer"
          >
            저장하기
          </button>

          <button
            onClick={() => navigate(-1)}
            className="shrink-0 flex items-center mt-8 gap-2 
          text-disabledGray hover:text-secondary transition-colors font-bold text-lg cursor-pointer"
          >
            <span className="text-xl">←</span> 이전으로
          </button>
        </div>

        {/* 오른쪽 섹션: 사진 등록 */}
        <div className="w-full lg:w-112.5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-textMain">
            <TbPhotoPlus className="text-xl" />
            <Typography
              variant="body-lg"
              color="text-textMain"
              className="font-bold!"
            >
              직관 사진 등록{" "}
              <span className="text-sm text-gray-400">
                ({imageFiles.length}/4)
              </span>
            </Typography>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50/50 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square w-full bg-gray-200 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center"
                >
                  {previews[i] ? (
                    <>
                      <img
                        src={previews[i]}
                        className="w-full h-full object-cover"
                        alt={`preview-${i}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 text-white drop-shadow-md hover:text-red-500 transition-colors"
                      >
                        <IoCloseCircle size={24} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 gap-1">
                      <Typography variant="body-sm">이미지 없음</Typography>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 사진 추가 버튼 */}
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
            />
            <button
              type="button"
              disabled={imageFiles.length >= 4}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-white border border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-hover transition-all group cursor-pointer"
            >
              <HiPlus className="text-2xl transition-transform" />
              {imageFiles.length >= 4 && (
                <span className="text-sm">최대 갯수 도달</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
