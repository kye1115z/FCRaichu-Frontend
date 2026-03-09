"use client";

import { useEffect, useState } from "react";
import { getGames } from "@/apis/games/getGames";
import type { Game } from "@/types/game";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

export const GameCalendar = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);

  // 경기 일정 데이터 받아오기
  useEffect(() => {
    const fetchGamesData = async () => {
      const res = await getGames();
      if (res.status === 200) {
        setGames(res.data);
      }
    };

    fetchGamesData();
  }, []);

  const events = games.map((game) => ({
    id: String(game.id),
    title: `${game.opponent}`,
    start: game.date,
    backgroundColor: "#FEEBEB",
    extendedProps: { ...game },
  }));

  return (
    <div>
      <FullCalendar
        initialView="dayGridMonth" // 처음에 보여줄 뷰 모드
        plugins={[dayGridPlugin, interactionPlugin]} // 사용할 플러그인
        events={events} // 변환한 데이터 넣어줌
        locale="ko"
        eventClick={(info) => {
          console.log("경기 클릭:", info.event.extendedProps);
          // DONE: 클릭된 경기 id를 가지고 페이지 이동
          navigate("/post", { state: { gameId: info.event.id } });
        }}
      />
    </div>
  );
};
