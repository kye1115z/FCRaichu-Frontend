import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { getAttendanceRanking, getWinRateRanking } from "../api/rankApi";
import type { RankingUser } from "@/features/ranking/types/ranking";
import Typography from "@/components/common/Typography";

export const Ranking = () => {
  const { user } = useAuthStore();
  const myNickname = user?.nickname;

  const { data: attendanceRank = [] } = useQuery<RankingUser[]>({
    queryKey: ["ranking", "attendance"],
    queryFn: getAttendanceRanking,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

  const { data: winRateRank = [] } = useQuery<RankingUser[]>({
    queryKey: ["ranking", "winRate"],
    queryFn: getWinRateRanking,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

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

    const pointColor = isAttendance ? "border-primary" : "border-secondary";
    const rankTextColor = isAttendance ? "text-primary" : "text-secondary/40";

    return (
      <div
        className={`group relative flex items-center p-1 rounded-xl transition-all duration-300 ${
          isMe
            ? `bg-white border-2 ${pointColor} shadow-lg z-10 scale-[1.01]`
            : "bg-white border border-line hover:border-gray-400 shadow-sm"
        }`}
      >
        <div className="flex items-center w-full py-3 px-5 rounded-lg bg-white">
          {/* 순위 번호 */}
          <span className={`w-12 text-2xl font-black italic ${rankTextColor}`}>
            {item.rank}
          </span>

          {/* 닉네임 영역 */}
          <div className="flex-1">
            <p className="text-lg font-bold text-secondary flex items-center">
              {item.nickname}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-2xl font-black ${isAttendance ? "text-primary" : "text-secondary"}`}
            >
              {item.count || item.winRate}
            </span>
            <span className="text-xs ml-1 font-bold text-textSub">
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
          2026 명예의 전당 <span className="text-primary">.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 직관왕 섹션 (Attendance) */}
        <section>
          <div className="flex items-center gap-4 mb-8 border-l-8 border-primary pl-4">
            <Typography variant="h1" color="text-textMain" className="italic">
              직관왕
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            {attendanceRank.length > 0 ? (
              attendanceRank.map((item) => (
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
              승리 요정
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            {winRateRank.length > 0 ? (
              winRateRank.map((item) => (
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
