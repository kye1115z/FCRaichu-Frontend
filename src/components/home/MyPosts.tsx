import { getAllGames } from "@/apis/games/gameApi";
import { getMyAllRecords } from "@/apis/posts/postApi";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import type { Game } from "@/types/game";
import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyRecords = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [records, setRecords] = useState<Post[]>([]);

  useEffect(() => {
    // 두 가지 데이터 요청을 동시에 요청해야 함. (getMyRecords, getGames)
    // Promise.all 사용!
    const fetchData = async () => {
      try {
        const [recordsRes, gameRes] = await Promise.all([
          getMyAllRecords(),
          getAllGames(),
        ]);

        if (recordsRes.status === 200 && gameRes.status === 200) {
          const recordsData = recordsRes.data;
          const gamesData = gameRes.data;

          // Games를 Map으로 변환 (빠르게 색인하기 위해서)
          const gameMap = new Map(
            gamesData.map((game: Game) => [Number(game.id), game]),
          );
          // Record와 Game 데이터를 합치기 (날짜 최신순으로)
          const mergedRecords = recordsData
            .map((record: Post) => ({
              ...record,
              game: gameMap.get(Number(record.gameId)) || {},
            }))
            .sort(
              (
                a: { createdAt: string | number | Date },
                b: { createdAt: string | number | Date },
              ) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );

          setRecords(mergedRecords.slice(0, 2));
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const handlePostById = (postId: number) => {
    navigate(`/post/${user?.id}/detail/${postId}`);
  };

  const handleAllPosts = () => {
    navigate(`/post/${user?.id}/all`);
  };

  return (
    <div className="flex flex-col mt-60 mx-auto gap-16 max-w-6xl">
      {/* 헤더 */}
      <div className="relative text-center mb-10">
        <h1 className="text-8xl font-black text-secondary italic tracking-tighter opacity-5 absolute left-1/2 -top-12 -translate-x-1/2 select-none whitespace-nowrap uppercase">
          My Football Diary
        </h1>
        <h2 className="relative text-6xl font-black text-secondary leading-tight">
          나의 직관 일지 <span className="text-primary">.</span>
        </h2>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-8">
        {records.map((record) => (
          <button
            key={record.postId}
            onClick={() => handlePostById(record.postId)}
            className={`
              flex flex-row justify-between gap-8 p-8 min-h-75
              border border-border rounded-2xl shadow-md bg-white overflow-hidden cursor-pointer
              transition-all duration-300 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 group
            `}
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
                <span className="text-border">•</span>
                <span>{record.game?.stadium || "경기장 정보 없음"}</span>
              </Typography>
            </div>

            {record.images?.[0] && (
              <div className="w-72 h-72 overflow-hidden rounded-xl">
                <img
                  src={record.images[0]}
                  alt="직관 기록 이미지"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/*  */}
      <div className="text-center mt-8">
        <button
          onClick={handleAllPosts}
          className="text-gray-400 border-b border-gray-400 pb-1 text-lg hover:text-primary hover:border-primary transition-all cursor-pointer font-medium"
        >
          전체 글 보러 가기
        </button>
      </div>
    </div>
  );
};
