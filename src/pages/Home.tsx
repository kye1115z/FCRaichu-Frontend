import { GameCalendar } from "@/components/home/GameCalendar";
import { Ranking } from "@/components/home/Ranking";
import { MyRecords } from "@/components/home/MyPosts";

export default function Home() {
  return (
    <main>
      {/* 캘린더 */}
      <GameCalendar />
      {/* 직관 기록 */}
      <MyRecords />
      {/* 직관왕 / 승률왕 */}
      <Ranking />
    </main>
  );
}
