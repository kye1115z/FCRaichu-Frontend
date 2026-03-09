import { getGames } from "@/apis/games/getGames";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  date: string;
  awayTeam: string;
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
        const res = await getGames();
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

  return (
    <>
      <select value={value} onChange={handleSelectChange}>
        {games.map((game) => {
          return (
            <option key={game.id} value={game.id}>
              {formatDate(game.date)} - FC서울 vs {game.awayTeam} (
              {game.stadium})
            </option>
          );
        })}
      </select>
    </>
  );
}
