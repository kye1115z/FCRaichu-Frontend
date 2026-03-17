import type { PostRequest } from "@/types/post";
import { api } from "../axiosInstance";

// 내 직관 기록 전체 조회
export const getMyAllPosts = async () => {
  const res = await api.get(`/api/posts`);
  return res.data;
};

// 직관 기록 작성
export const postMyRecord = async (data: PostRequest) => {
  const formData = new FormData();

  formData.append("gameId", String(data.gameId));
  formData.append("userId", String(data.userId));
  formData.append("title", data.title);
  formData.append("content", data.content);

  data.images.forEach((file) => {
    formData.append("images", file);
  });

  const res = await api.post(`/api/posts`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 특정 게시물 상세 조회
export const getRecordById = async (id: number) => {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
};

// 직관 기록 수정
export const putMyRecord = async (postId: number, data: any) => {
  const formData = new FormData();

  formData.append("gameId", String(data.gameId));
  formData.append("title", data.title);
  formData.append("content", data.content);

  data.existingImages.forEach((img: string) => {
    formData.append("existingImages", img);
  });

  data.images.forEach((file: File) => {
    formData.append("images", file);
  });

  const res = await api.put(`/api/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 직관 기록 삭제
export const deleteMyRecord = async (id: number) => {
  const res = await api.delete(`/api/posts/${id}`);
  return res.data;
};
