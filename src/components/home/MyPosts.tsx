import { getAllGames } from "@/apis/games/gameApi";
import { getMyAllPosts } from "@/apis/posts/postApi";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import type { Game } from "@/types/game";
import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const MyRecords = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: recordsData } = useQuery<{ posts: Post[] }>({
    queryKey: ["myPosts", user?.id],
    queryFn: getMyAllPosts,
    enabled: !!user,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const { data: gamesData } = useQuery<Game[]>({
    queryKey: ["allGames"],
    queryFn: getAllGames,
    enabled: !!user,
    staleTime: 1000 * 60 * 60 * 2,
  });

  const records = useMemo(() => {
    if (!recordsData || !gamesData) return [];

    const gamesMap = new Map(gamesData.map((game) => [Number(game.id), game]));

    const mergedRecords = recordsData.posts
      .map((record: Post) => ({
        ...record,
        game: gamesMap.get(Number(record.gameId)),
      }))
      .sort(
        (
          a: { createdAt: string | number | Date },
          b: { createdAt: string | number | Date },
        ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    return mergedRecords.slice(0, 2);
  }, [recordsData, gamesData]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleAllPosts = () => {
    navigate(`/post/${user?.id}/all`);
  };

  return (
    <div className="flex flex-col mt-60 mx-auto gap-16 max-w-6xl">
      {/* 헤더 부분 동일 */}
      <div className="relative text-center mb-10">
        <h1 className="text-8xl font-black text-secondary italic tracking-tighter opacity-5 absolute left-1/2 -top-12 -translate-x-1/2 select-none whitespace-nowrap uppercase">
          My Football Diary
        </h1>
        <h2 className="relative text-6xl font-black text-secondary leading-tight">
          나의 직관 일지 <span className="text-primary">.</span>
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {user ? (
          // 로그인 되었을 때
          records.length > 0 ? (
            records.map((record) => (
              <button
                key={record.postId}
                onClick={() =>
                  navigate(`/post/${user.id}/detail/${record.postId}`)
                }
                className="flex flex-row justify-between gap-8 p-8 min-h-75 border border-border rounded-2xl shadow-md bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 group"
              >
                <div className="flex flex-col items-start flex-1 gap-4 text-left">
                  <Typography
                    variant="h3"
                    color="text-textMain"
                    className="group-hover:text-primary transition-colors duration-300"
                  >
                    {record.title}
                  </Typography>
                  <Typography
                    variant="body-md"
                    color="text-textMain"
                    className="leading-relaxed line-clamp-5 opacity-80"
                  >
                    {record.content}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    color="text-gray-400"
                    className="mt-auto flex items-end gap-2 font-medium"
                  >
                    <span className="text-secondary/60">
                      {formatDate(record.createdAt)}
                    </span>
                    <span className="text-border">|</span>
                    <span>{record.game?.opponent || "상대팀 정보 없음"}</span>
                  </Typography>
                </div>
                {record.thumbnail && (
                  <div className="w-72 h-72 overflow-hidden rounded-xl">
                    <img
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}${record.thumbnail}`}
                      alt="직관 이미지"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
              </button>
            ))
          ) : (
            // 로그인 했으나 작성한 글이 없을 때
            <div className="text-center py-18 border-2 border-dashed border-border rounded-2xl">
              <Typography variant="h3" color="text-textSub">
                아직 작성된 일지가 없습니다.
              </Typography>
              <button
                onClick={() => navigate("/post")}
                className="mt-10 text-disabledGray font-bold hover:text-primary cursor-pointer"
              >
                첫 일지 작성하러 가기 →
              </button>
            </div>
          )
        ) : (
          // 2. 비로그인 상태: 로그인 유도 플레이스홀더 카드
          <button
            onClick={handleLoginRedirect}
            className="flex flex-row items-center justify-center gap-8 p-8 min-h-75 border-2 border-dashed border-border rounded-2xl bg-gray-50/50 cursor-pointer transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <Typography variant="h3" color="text-textMain">
                로그인하고 나만의 직관 일지를 작성해보세요!
              </Typography>
              <Typography variant="body-md" color="text-gray-400">
                그날의 열기와 감동을 기록하고 포인트도 획득하세요.
              </Typography>
              <span className="mt-4 px-6 py-2 underline text-textSub hover:text-textMain transition-colors">
                로그인하러 가기
              </span>
            </div>
          </button>
        )}
      </div>

      {/* 전체 글 보러 가기 하단 버튼 (로그인 시에만 노출) */}
      {user && (
        <div className="text-center mt-8">
          <button
            onClick={handleAllPosts}
            className="text-gray-400 border-b border-gray-400 pb-1 text-lg hover:text-primary hover:border-primary transition-all cursor-pointer font-medium"
          >
            전체 글 보러 가기
          </button>
        </div>
      )}
    </div>
  );
};
