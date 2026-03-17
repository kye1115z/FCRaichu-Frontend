import { postMyRecord, putMyRecord } from "@/apis/posts/postApi";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PostRequest } from "@/types/post";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query"; // 캐시 무효화를 위해 추가
import { TbPhotoPlus } from "react-icons/tb";
import { PiSmileyFill } from "react-icons/pi";
import { LuFilePen } from "react-icons/lu";
import { HiPlus } from "react-icons/hi";
import { IoCloseCircle } from "react-icons/io5";
import Typography from "@/styles/common/Typography";
import { heicTo, isHeic } from "heic-to"; // npm install heic-to 해주기

// 부모로부터 context로 받아온 데이터 활용하기
interface PostContext {
  selectedGameId: number;
  initialData: EditPostInitialData;
  isEditMode: boolean;
}

interface EditPostInitialData {
  title: string;
  content: string;
  images: string[]; // 기존 이미지 경로들
}

// DONE: 날짜 데이터를 어떻게 받아올지 -> useOutletContext 사용
export default function RecordWriteStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 캐시 관리용 클라이언트
  const { user } = useAuthStore();
  const { postId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<string[]>([]);

  // 부모 outlet으로부터 데이터 수신함.
  const context = useOutletContext<PostContext>() || {};
  const { selectedGameId, initialData, isEditMode } = context;

  // 직관 기록 post 시 보낼 데이터 정의 (근데 이제 수정 모드를 반영함)
  const [formData, setFormData] = useState({
    title: isEditMode && initialData ? initialData.title : "",
    content: isEditMode && initialData ? initialData.content : "",
  });

  const trimmedTitle = formData.title.trim();
  const trimmedContent = formData.content.trim();

  const isSubmitDisabled = !trimmedTitle || !trimmedContent || !selectedGameId;

  const isHeicFile = async (file: File) => {
    const name = file.name.toLowerCase();

    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      name.endsWith(".heic") ||
      name.endsWith(".heif")
    ) {
      return true;
    }

    try {
      return await isHeic(file);
    } catch {
      return false;
    }
  };

  const convertHeicToJpegFile = async (file: File): Promise<File> => {
    const outputBlob = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.9,
    });

    if (!outputBlob) {
      throw new Error("HEIC 변환 결과가 없습니다.");
    }

    const jpegBlob = Array.isArray(outputBlob) ? outputBlob[0] : outputBlob;
    const originalName = file.name.replace(/\.(heic|heif|png|jpg|jpeg)$/i, "");

    return new File([jpegBlob], `${originalName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  // 이미지 상태 관리 (서버에 저장된 기존 이미지 URL) -> 수정 모드일 때
  const [existingImages, setExistingImages] = useState<string[]>(
    isEditMode && initialData ? initialData.images || [] : [],
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // 부모로부터 Initial 데이터 도착하면 상태 업데이트
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
      });
      setExistingImages(initialData.images || []);
    }
  }, [initialData, isEditMode]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };

  // textarea = content 입력 받기
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  // DONE: 이미지 여러 개
  // image = images를 file 배열로 입력 받기
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);

    const totalCount = existingImages.length + imageFiles.length;
    const availableSlots = 4 - totalCount;

    if (availableSlots <= 0) {
      alert("이미지는 최대 4장까지 업로드 할 수 있습니다.");
      e.target.value = "";
      return;
    }

    const filesToProcess = selectedFiles.slice(0, availableSlots);

    const processedFiles: File[] = [];

    for (const file of filesToProcess) {
      try {
        if (await isHeicFile(file)) {
          const converted = await convertHeicToJpegFile(file);
          processedFiles.push(converted);
        } else {
          processedFiles.push(file);
        }
      } catch (error) {
        console.error(`${file.name} 변환 실패`, error);
        alert(`${file.name} 파일은 변환에 실패했습니다.`);
      }
    }

    const newPreviews = processedFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...processedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  // 기존 이미지 삭제 (상태에서만 제거)
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // DONE: 제출 로직 작성하기
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle) return alert("제목을 입력해주세요.");
    if (!trimmedContent) return alert("후기를 입력해주세요.");
    if (!selectedGameId) return alert("경기를 선택해주세요.");

    try {
      if (isEditMode) {
        await putMyRecord(Number(postId), {
          ...formData,
          title: trimmedTitle,
          content: trimmedContent,
          gameId: selectedGameId,
          existingImages: existingImages,
          images: imageFiles,
        });
      } else {
        await postMyRecord({
          ...formData,
          title: trimmedTitle,
          content: trimmedContent,
          gameId: selectedGameId,
          userId: Number(user?.id),
          images: imageFiles,
        } as PostRequest);
      }

      // 캐시 날리고 최신 데이터 불러오기
      await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      await queryClient.invalidateQueries({ queryKey: ["allPosts", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["post", postId] });

      alert(
        isEditMode ? "수정이 완료되었습니다." : "직관 기록이 완료되었습니다.",
      );
      navigate(`/post/${user?.id}/all`);
    } catch (e) {
      console.error(e);
    }
  };

  // 메모리 누수 방지: 컴포넌트 언마운트 시 ObjectURL 해제
  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
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
              value={formData.title}
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
              value={formData.content}
              onChange={handleTextAreaChange}
              className="w-full min-h-72 p-5 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-disabled transition-all text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-4 font-bold text-xl rounded-xl transition-all shadow-lg active:scale-[0.98]
    ${
      isSubmitDisabled
        ? "bg-gray-300 text-white cursor-not-allowed"
        : "bg-primary text-white hover:bg-hover cursor-pointer"
    }`}
          >
            {isEditMode ? "수정 완료" : "저장하기"}
          </button>

          <button
            type="button"
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
              직관 사진{" "}
              <span className="text-sm text-gray-400">
                ({existingImages.length + imageFiles.length}/4)
              </span>
            </Typography>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50/50 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              {existingImages.map((img, i) => (
                <div
                  key={`ex-${i}`}
                  className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden border"
                >
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${img}`}
                    className="w-full h-full object-cover"
                    alt="existing"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 text-red-500 bg-white rounded-full shadow-md"
                  >
                    <IoCloseCircle size={24} />
                  </button>
                </div>
              ))}
              {previews.map((url, i) => (
                <div
                  key={`new-${i}`}
                  className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden border-2 border-primary"
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 text-red-500 bg-white rounded-full shadow-md"
                  >
                    <IoCloseCircle size={24} />
                  </button>
                </div>
              ))}
              {Array.from({
                length: 4 - (existingImages.length + imageFiles.length),
              }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-xs"
                >
                  IMAGE
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
              accept="image/*,.heic,.heif"
            />
            <button
              type="button"
              disabled={existingImages.length + imageFiles.length >= 4}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-white border border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-hover transition-all group cursor-pointer"
            >
              <HiPlus className="text-2xl transition-transform" />
              {existingImages.length + imageFiles.length >= 4 && (
                <span className="text-sm">최대 갯수 도달</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
