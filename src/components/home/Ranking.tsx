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
          attendanceRank: attendanceRes,
          winRateRank: winRateRes,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchRankingList();
  }, []);

  // 공통 랭킹 아이템 컴포넌트
  const RankingItem = ({
    item,
    type,
  }: {
    item: RankingUser;
    type: "attendance" | "winRate";
  }) => {
    const isMe = item.nickname === myNickname;
    const isAttendance = type === "attendance";

    // 타입별 포인트 컬러 설정
    const activeBg = isAttendance
      ? "bg-primary shadow-[0_20px_40px_rgba(217,25,32,0.2)]"
      : "bg-secondary shadow-[0_20px_40px_rgba(26,26,27,0.3)]";
    const rankColor = isAttendance ? "text-primary" : "text-secondary/30";

    return (
      <div
        className={`group relative flex items-center p-1 rounded-xl transition-all duration-300 ${
          isMe
            ? `${activeBg} scale-[1.03] z-10`
            : "bg-white border border-line hover:border-secondary shadow-sm hover:shadow-xl"
        }`}
      >
        <span
          className={`absolute right-8 text-5xl font-black italic opacity-[0.04] group-hover:opacity-10 transition-opacity ${isMe ? "text-white" : "text-secondary"}`}
        >
          {item.rank}
        </span>

        <div
          className={`flex items-center w-full py-3 px-5 rounded-lg ${isMe ? (isAttendance ? "bg-primary" : "bg-secondary") : "bg-white"}`}
        >
          <span
            className={`w-12 text-2xl font-black italic ${isMe ? "text-white" : rankColor}`}
          >
            {item.rank}
          </span>

          <div className="flex-1">
            <p
              className={`text-lg font-bold ${isMe ? "text-white" : "text-secondary"}`}
            >
              {item.nickname}
              {isMe && (
                <span
                  className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-black italic ${isAttendance ? "bg-white text-primary" : "bg-primary text-white"}`}
                >
                  YOU
                </span>
              )}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-2xl font-black ${isMe ? "text-white" : "text-primary"}`}
            >
              {item.count || item.winRate}
            </span>
            <span
              className={`text-xs ml-1 font-bold ${isMe ? "text-white/80" : "text-textSub"}`}
            >
              {isAttendance ? "회" : "%"}
            </span>
          </div>
        </div>
      </div>
    );
  };

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
      {/* 헤더 섹션 */}
      <div className="relative text-center mb-24">
        <h1 className="text-8xl font-black text-secondary italic tracking-tighter opacity-5 absolute left-1/2 -top-12 -translate-x-1/2 select-none whitespace-nowrap uppercase">
          TOP FIELD
        </h1>
        <h2 className="relative text-6xl font-black text-secondary leading-tight">
          명예의 전당 <span className="text-primary">.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 직관왕 섹션 (Attendance) */}
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
                <RankingItem
                  key={`attendance-${item.rank}-${item.nickname}`}
                  item={item}
                  type="attendance"
                />
              ))
            ) : (
              <EmptyRanking title="직관왕" />
            )}
          </div>
        </section>

        {/* 승률왕 섹션 (Win Rate) */}
        <section>
          <div className="flex items-center gap-4 mb-8 border-l-8 border-secondary pl-4">
            <Typography variant="h1" color="text-textMain" className="italic">
              WIN RATE
            </Typography>
            <span className="bg-primary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">
              KING
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {rankingData.winRateRank.length > 0 ? (
              rankingData.winRateRank.map((item) => (
                <RankingItem
                  key={`win-${item.rank}-${item.nickname}`}
                  item={item}
                  type="winRate"
                />
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
