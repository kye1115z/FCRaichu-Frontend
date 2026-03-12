import { getGames } from "@/apis/games/gameApi";
import { getMyRecords } from "@/apis/posts/postApi";
import type { Game } from "@/types/game";
import type { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";

export const MyRecords = () => {
  const [records, setRecords] = useState<Post[]>([]);

  useEffect(() => {
    // 두 가지 데이터 요청을 동시에 요청해야 함. (getMyRecords, getGames)
    // Promise.all 사용!
    const fetchData = async () => {
      try {
        const [recordsRes, gameRes] = await Promise.all([
          getMyRecords(),
          getGames(),
        ]);

        if (recordsRes.status === 200 && gameRes.status === 200) {
          const recordsData = recordsRes.data;
          const gamesData = gameRes.data;

          // Games를 Map으로 변환 (빠르게 색인하기 위해서)
          const gameMap = new Map(
            gamesData.map((game: Game) => [game.id, game]),
          );

          // Record와 Game 데이터를 합치기
          const mergedRecords = recordsData.map((record: Post) => ({
            ...record,
            game: gameMap.get(record.gameId) || {},
          }));

          setRecords(mergedRecords);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-8">나의 직관 기록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {records.map((record) => (
          <div
            key={record.postId}
            className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <p className="font-bold text-lg truncate">제목: {record.title}</p>
            <p className="text-gray-600 line-clamp-2">내용: {record.content}</p>

            {record.images?.[0] && (
              <img
                src={record.images[0]}
                alt="직관 기록 대표 이미지"
                className="w-full h-40 object-cover rounded-md"
              />
            )}

            <div className="mt-auto pt-2 text-sm text-gray-500">
              <p>날짜: {formatDate(record.createdAt)}</p>
              <p>상태: {record.status}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
