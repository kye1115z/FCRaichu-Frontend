// src/pages/DetailPostPage.tsx
import { getGameById } from "@/apis/games/gameApi";
import { deleteMyRecord, getRecordById } from "@/apis/posts/postApi";
import ImageSlider from "@/components/postDetail/ImageSlider";
import MatchInfo from "@/components/postDetail/MatchInfo";
import Typography from "@/styles/common/Typography";
import type { Game } from "@/types/game";
import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // react-router-dom 사용 시

import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useAuthStore } from "@/stores/useAuthStore";
import { getUserInfo } from "@/apis/auth/authApi";

export default function PostDetail() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { userId, postId } = useParams();

  const [postData, setPostData] = useState<Post>();
  const [gameData, setGameData] = useState<Game>();

  // post detail 불러오고 그 안에 있는 gameId 데이터로 game 정보까지 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const postRes = await getRecordById(Number(postId));
        if (postRes.status === 200) {
          const gameRes = await getGameById(postRes.data.gameId);
          if (gameRes.status === 200) {
            setGameData(gameRes.data);
            setPostData(postRes.data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchPostDetail();
  }, [userId]);

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;

    try {
      const res = await deleteMyRecord(Number(postId));
      if (res.status === 204) {
        alert("삭제되었습니다.");
        navigate(-1);

        const userRes = await getUserInfo();
        if (userRes.status === 200) {
          updateUser({
            ...user,
            points: userRes.data.points,
          });
        }
      }
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  // 수정
  const handleEdit = () => {
    navigate(`/post/edit/${postId}`, { state: { postData } });
  };

  return (
    // 헤더만큼 빼고 높이 설정을 해야 전체 스크롤이 안 생긴다. 왼쪽만 스크롤 있고 사진 영역은 스크롤 없도록.
    // (이때까지는 왼쪽 영역은 모두 다 스크롤 됨. 근데 나는 본문만 스크롤 되게끔 하려고 한다.)
    <div className="flex w-full h-[calc(100vh-64px)] bg-card overflow-hidden">
      <div className="w-1/2 h-full flex flex-col px-16 py-10 overflow-hidden">
        {/* 상단 경기 정보는 스크롤 없이 "고정"!! */}
        {gameData && (
          <div className="shrink-0 mb-10">
            <MatchInfo
              date={formatDate(gameData.date)}
              opponent={gameData.opponent}
              stadium={gameData.stadium}
            />
          </div>
        )}

        {/* 본문 내용만 스크롤!! */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-5">
            {postData && (
              <>
                <Typography variant="display" color="text-secondary">
                  {postData?.title}
                </Typography>

                <Typography
                  variant="body-lg"
                  color="text-secondary"
                  className="whitespace-pre-wrap leading-relaxed"
                >
                  {postData?.content}
                </Typography>
              </>
            )}
          </div>
        </div>

        {/* 이전으로 버튼도 고정!! */}
        <div className="shrink-0 flex items-center justify-between mt-8 border-t border-border pt-6">
          {/* 왼쪽: 이전으로 */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-disabledGray hover:text-secondary transition-colors font-bold text-lg cursor-pointer"
          >
            <span className="text-xl">←</span> 이전으로
          </button>

          {user?.id === Number(userId) && (
            <div className="flex items-center gap-6">
              <button
                onClick={handleEdit}
                className="text-disabledGray hover:text-primary transition-colors font-bold text-lg cursor-pointer"
              >
                <FiEdit className="font-bold" />
              </button>
              <button
                onClick={handleDelete}
                className="text-disabledGray hover:text-primary transition-colors font-bold text-lg cursor-pointer"
              >
                <MdOutlineDeleteForever className="text-2xl" />
              </button>
            </div>
          )}
        </div>
      </div>
      {postData && (
        <div className="w-1/2 h-full overflow-hidden">
          <ImageSlider images={postData.images} />
        </div>
      )}
    </div>
  );
}
