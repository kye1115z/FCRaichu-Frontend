import {
  getAttendanceRanking,
  getWinRateRanking,
} from "@/apis/ranking/rankApi";
import Typography from "@/styles/common/Typography";
import type { RankingUser } from "@/types/ranking";
import { useEffect, useState } from "react";

export const Ranking = () => {
  const [rankingData, setRankingData] = useState<{
    attendanceRank: RankingUser[];
    winRateRank: RankingUser[];
  }>({
    attendanceRank: [],
    winRateRank: [],
  });

  useEffect(() => {
    const fetchRankingList = async () => {
      try {
        const [attendanceRes, winRateRes] = await Promise.all([
          getAttendanceRanking(),
          getWinRateRanking(),
        ]);

        if (attendanceRes.status == 200 && winRateRes.status == 200) {
          console.log(attendanceRes, winRateRes);
          setRankingData({
            attendanceRank: attendanceRes.data,
            winRateRank: winRateRes.data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchRankingList();
  }, []);

  // 랭킹에 아무도 없을 때
  const EmptyRanking = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 border-2 border-dashed border-border rounded-3xl">
      <div className="text-6xl mb-6 grayscale opacity-50">🏆</div>
      <Typography variant="h3" color="text-gray-400" className="mb-2">
        {title}의 주인공을 기다리고 있습니다...
      </Typography>
    </div>
  );

  return (
    <div className="max-w-6xl mt-60 mx-auto p-6 pb-50 font-sans">
      <div className="relative text-center mb-24">
        <h1 className="text-8xl font-black text-secondary italic tracking-tighter opacity-5 absolute left-1/2 -top-12 -translate-x-1/2 select-none whitespace-nowrap uppercase">
          TOP FIELD
        </h1>
        <h2 className="relative text-6xl font-black text-secondary leading-tight">
          명예의 전당 <span className="text-primary">.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 직관왕 섹션 */}
        <section>
          <div className="flex items-center gap-4 mb-8 border-l-8 border-primary pl-4">
            <Typography variant="h1" color="text-textMain" className="italic">
              ATTENDANCE
            </Typography>
            <span className="bg-secondary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">
              KING
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {rankingData.attendanceRank.length > 0 ? (
              rankingData.attendanceRank.map((item) => (
                // ... 기존 랭킹 아이템 카드 코드
                <div key={`attendance-${item.rank}`} className="...">
                  ...
                </div>
              ))
            ) : (
              <EmptyRanking title="직관왕" />
            )}
          </div>
        </section>

        {/* --- 승률왕 섹션 --- */}
        <section>
          <div className="flex items-center gap-4 mb-8 border-l-8 border-secondary pl-4">
            <Typography variant="h1" color="text-textMain" className="italic">
              WINNER RATE
            </Typography>
            <span className="bg-primary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">
              RANK
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {rankingData.winRateRank.length > 0 ? (
              rankingData.winRateRank.map((item) => (
                <div key={`win-${item.rank}`} className="...">
                  ...
                </div>
              ))
            ) : (
              <EmptyRanking title="승률왕" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
