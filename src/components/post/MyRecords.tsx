import { getGames } from "@/apis/games/getGames";
import { getMyRecords } from "@/apis/posts/getMyPosts";
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
    <div>
      {records.map((record) => (
        <div key={record.postId}>
          <p>제목: {record.title}</p>
          <p>내용: {record.content}</p>
          <img src={record.images?.[0]} alt="직관 기록 대표 이미지" />
          <p>날짜: {formatDate(record.createdAt)}</p>
          <p>상태: {record.status}</p>
        </div>
      ))}
    </div>
  );
};
