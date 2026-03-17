import { getGameById } from "@/apis/games/gameApi";
import { deleteMyRecord, getRecordById } from "@/apis/posts/postApi";
import ImageSlider from "@/components/postDetail/ImageSlider";
import MatchInfo from "@/components/postDetail/MatchInfo";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import { formatDate } from "@/utils/formatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

export default function PostDetail() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  const queryClient = useQueryClient();

  // 1. Post 데이터 가져오기
  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getRecordById(Number(postId)),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Post 데이터를 기반으로 Game 데이터 가져오기 (Dependent Query)
  const { data: gameData, isLoading: isGameLoading } = useQuery({
    queryKey: ["game", postData?.gameId],
    queryFn: () => getGameById(postData.gameId),
    enabled: !!postData?.gameId, // postData.gameId가 있을 때만 실행
    staleTime: 1000 * 60 * 60 * 2,
  });

  // 3. 삭제 Mutation
  const { mutate: deletePost } = useMutation({
    mutationFn: () => deleteMyRecord(Number(postId)),
    onSuccess: () => {
      alert("삭제되었습니다.");
      // 쿼리를 무효화하여 목록을 업데이트
      queryClient.invalidateQueries({ queryKey: ["myPosts", Number(userId)] }); // 내 포스트 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["ranking"] }); // 랭킹 전체 갱신
      navigate(-1);
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });

  // 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      deletePost();
    }
  };

  // 수정 핸들러
  const handleEdit = () => {
    navigate(`/post/edit/${postId}`, { state: { postData } });
  };

  if (isPostLoading || isGameLoading) {
    return <div>Loading...</div>;
  }

  return (
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
