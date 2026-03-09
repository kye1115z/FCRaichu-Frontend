import { getRankingList } from "@/apis/ranking/getRankings";
import type { RankingUser } from "@/types/ranking";
import { useEffect, useState } from "react";

export const Ranking = () => {
  // 직관왕, 승률왕 한 번에 담기
  const [rankingData, setRankingData] = useState<{
    attendanceRank: RankingUser[];
    winRateRank: RankingUser[];
  } | null>(null);

  // 랭킹 리스트 불러오기
  useEffect(() => {
    const fetchRankingList = async () => {
      try {
        const res = await getRankingList();
        if (res.status === 200) {
          setRankingData(res.data);
          console.log(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchRankingList();
  }, []);

  return (
    <div>
      <h1>FC SEOUL SUPPORTERS RANKING</h1>
      <h2>직관왕</h2>
      <div>
        <ul>
          {/* TODO: 내 데이터일 경우 강조해주기 */}
          {rankingData?.attendanceRank.map((user) => (
            <li key={user.rank}>
              <span>{user.rank}위</span>
              <strong>{user.nickname}</strong>
              <p>{user.count}회 출석</p>
            </li>
          ))}
        </ul>
      </div>
      <h2>승률왕</h2>
      <div>
        <ul>
          {rankingData?.winRateRank.map((user) => (
            <li key={user.rank}>
              <span>{user.rank}위</span>
              <strong>{user.nickname}</strong>
              <p>{user.count}회 출석</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
