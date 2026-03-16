import {
  getAttendanceRanking,
  getWinRateRanking,
} from "@/apis/ranking/rankApi";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import type { RankingUser } from "@/types/ranking";
import { useEffect, useState } from "react";

export const Ranking = () => {
  const { user } = useAuthStore();
  const myNickname = user?.nickname;
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
        setRankingData({
          attendanceRank: attendanceRes.data,
          winRateRank: winRateRes.data,
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchRankingList();
  }, []);

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
            {rankingData?.attendanceRank.map((item) => (
              <div
                key={`attendance-${item.rank}`}
                className={`group relative flex items-center p-1 rounded-xl transition-all duration-300 ${
                  item.nickname === myNickname
                    ? "bg-primary shadow-[0_20px_40px_rgba(217,25,32,0.2)] -translate-right-2 scale-[1.03]"
                    : "bg-white border border-line hover:border-secondary shadow-sm hover:shadow-xl"
                }`}
              >
                {/* 배경 숫자 강조 */}
                <span
                  className={`absolute right-8 text-5xl font-black italic opacity-[0.04] group-hover:opacity-10 transition-opacity ${item.nickname === myNickname ? "text-white" : "text-secondary"}`}
                >
                  {item.rank}
                </span>

                <div
                  className={`flex items-center w-full py-3 px-5 rounded-lg ${item.nickname === myNickname ? "bg-primary" : "bg-white"}`}
                >
                  <span
                    className={`w-12 text-2xl font-black italic ${item.nickname === myNickname ? "text-white" : "text-primary"}`}
                  >
                    {item.rank}
                  </span>

                  <div className="flex-1">
                    <p
                      className={`text-lg font-bold ${item.nickname === myNickname ? "text-white" : "text-secondary"}`}
                    >
                      {item.nickname}
                      {item.nickname === myNickname && (
                        <span className="ml-2 text-[10px] bg-white text-primary px-1.5 py-0.5 rounded font-black italic">
                          YOU
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-2xl font-black ${item.nickname === myNickname ? "text-white" : "text-secondary"}`}
                    >
                      {item.count}
                    </span>
                    <span
                      className={`text-xs ml-1 font-bold ${item.nickname === myNickname ? "text-white/80" : "text-textSub"}`}
                    >
                      회
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            {rankingData?.winRateRank.map((item) => (
              <div
                key={`win-${item.rank}`}
                className={`group relative flex items-center p-1 rounded-xl transition-all duration-300 ${
                  item.nickname === myNickname
                    ? "bg-secondary shadow-[0_20px_40px_rgba(26,26,27,0.3)] scale-[1.03]"
                    : "bg-white border border-line hover:border-primary shadow-sm hover:shadow-xl"
                }`}
              >
                <span
                  className={`absolute right-8 text-5xl font-black italic opacity-[0.04] transition-opacity ${item.nickname === myNickname ? "text-white" : "text-secondary"}`}
                >
                  {item.rank}
                </span>

                <div
                  className={`flex items-center w-full py-3 px-5 rounded-lg ${item.nickname === myNickname ? "bg-secondary" : "bg-white"}`}
                >
                  <span
                    className={`w-12 text-2xl font-black italic ${item.nickname === myNickname ? "text-white" : "text-secondary/30"}`}
                  >
                    {item.rank}
                  </span>

                  <div className="flex-1">
                    <p
                      className={`text-lg font-bold ${item.nickname === myNickname ? "text-white" : "text-secondary"}`}
                    >
                      {item.nickname}
                      {item.nickname === myNickname && (
                        <span className="ml-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-black italic">
                          YOU
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-2xl font-black ${item.nickname === myNickname ? "text-white" : "text-primary"}`}
                    >
                      {item.count}
                    </span>
                    <span
                      className={`text-xs ml-1 font-bold ${item.nickname === myNickname ? "text-white/80" : "text-textSub"}`}
                    >
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
