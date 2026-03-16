import { getAllGames } from "@/apis/games/gameApi";
import Typography from "@/styles/common/Typography";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { LuCalendarDays } from "react-icons/lu";

interface Game {
  id: number;
  date: string;
  opponent: string;
  stadium: string;
}

interface Props {
  value: number;
  onChange: (id: number) => void;
}
// DONE: Date Picker 컴포넌트 만들기
export default function DatePicker({ value, onChange }: Props) {
  // 초기값은 빈 배열
  const [games, setGames] = useState<Game[]>([]);

  // 경기 전체 일정 조회
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await getAllGames();
        if (res.status === 200) {
          setGames(res.data);

          // 초기값이 없을 때 첫 번째 경기를 기본값으로 설정.
          if (res.data.length > 0 && !value) {
            onChange(res.data[0].id);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchGames();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seletedId = Number(e.target.value);
    const selectedGame = games.find((game) => game.id === seletedId);

    if (selectedGame) {
      onChange(selectedGame.id);
    }
  };

  // 현재 선택된 게임
  const selectedGame = games.find((game) => game.id === value);

  return (
    <>
      <div className="w-full max-w-5xl mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LuCalendarDays className="text-primary text-xl" />
          <Typography variant="h3" color="text-subText" className="font-bold!">
            경기 일정
          </Typography>
        </div>

        <div className="relative group">
          <div
            className="px-4 py-4 w-full bg-light border-2 border-disabled 
          rounded-xl transition-all group-hover:border-primary"
          >
            <p className="text-lg font-medium text-gray-800">
              {selectedGame ? (
                <>
                  {formatDate(selectedGame.date)}{" "}
                  <span className="mx-2">/</span> {selectedGame.opponent}{" "}
                  <span className="mx-2">/</span> {selectedGame.stadium}
                </>
              ) : (
                "경기를 선택해주세요"
              )}
            </p>
          </div>

          {/* 투명한 select는 덮어주기 */}
          <select
            value={value}
            onChange={handleSelectChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {formatDate(game.date)} / {game.opponent} / {game.stadium}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
