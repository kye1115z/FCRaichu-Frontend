import { getRankingList } from "@/apis/ranking/rankApi";
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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        FC SEOUL SUPPORTERS RANKING
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">직관왕</h2>
          <ul className="flex flex-col gap-2">
            {/* TODO: 내 데이터일 경우 강조해주기 */}
            {rankingData?.attendanceRank.map((user) => (
              <li
                key={user.rank}
                className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
              >
                <span className="w-12 font-semibold text-red-600">
                  {user.rank}위
                </span>
                <strong className="flex-1 text-center">{user.nickname}</strong>
                <p className="w-20 text-right text-sm text-gray-600">
                  {user.count}회 출석
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">승률왕</h2>
          <ul className="flex flex-col gap-2">
            {rankingData?.winRateRank.map((user) => (
              <li
                key={user.rank}
                className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
              >
                <span className="w-12 font-semibold text-red-600">
                  {user.rank}위
                </span>
                <strong className="flex-1 text-center">{user.nickname}</strong>
                <p className="w-20 text-right text-sm text-gray-600">
                  {user.count}%
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
