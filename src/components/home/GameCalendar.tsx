"use client";

import { useEffect, useRef, useState } from "react";
import { getGames } from "@/apis/games/gameApi";
import type { Game } from "@/types/game";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

import "./GameCalendar.css";

export const GameCalendar = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);

  // ------------ 날짜 넘길 때 필요한 상태와 Ref
  const calendarRef = useRef<FullCalendar>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // ------------ 경기 일정 데이터 받아오기
  useEffect(() => {
    const fetchGamesData = async () => {
      const res = await getGames();
      if (res.status === 200) {
        setGames(res.data);
      }
    };

    fetchGamesData();
  }, []);

  // 캘린더에 입력할 데이터로 변환
  const events = games.map((game) => {
    const formattedDate =
      game.date instanceof Date
        ? game.date.toISOString().split("T")[0]
        : String(game.date).split("T")[0];

    return {
      id: String(game.id),
      title: `${game.opponent}`,
      start: formattedDate,
      extendedProps: { ...game },
    };
  });

  // ------------ 달력 조작 함수 (이전, 다음)
  const updateHeaderDate = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const currentDate = calendarApi.getDate();
      setCurrentYear(currentDate.getFullYear());
      setCurrentMonth(currentDate.getMonth() + 1);
    }
  };

  // 컴포넌트 마운트 시 헤더 날짜 초기화
  useEffect(() => {
    setTimeout(updateHeaderDate, 0);
  }, []);

  // 이전으로
  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    updateHeaderDate();
  };

  // 다음으로
  const handleNext = () => {
    calendarRef.current?.getApi().next();
    updateHeaderDate();
  };

  return (
    <div
      className={`
    custom-calendar-wrapper
    w-full max-w-5xl mx-auto mt-10
    text-secondary
    `}
    >
      {/* 상단 타이틀 & 커스텀 헤더 */}
      <div className="mb-10 text-center">
        <h1
          className={`mb-24 text-6xl font-extrabold font-serif tracking-wider`}
        >
          FC SEOUL MATCHES
        </h1>
        {/* <h2 className="text-xl font-bold">{currentYear}년 {currentMonth}월 FC서울 경기 일정</h2> */}
      </div>

      {/* 달력 날짜 넘기기 & 오늘, 경기일 표시 */}
      <div className="flex justify-between items-end mb-4 px-2">
        <div className="flex items-center text-3xl font-bold gap-5">
          {/* TODO: 이전, 다음 버튼으로 바꾸기 */}
          <button
            onClick={handlePrev}
            className="hover:text-main transition-colors font-medium"
          >
            &lt;
          </button>
          <div className="flex items-center gap-2">
            <span>{currentYear}</span>
            <span className="text-[10px] align-top">▼</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{currentMonth}</span>
            <span className="text-[10px] align-top ml-5">▼</span>
          </div>
          <button
            onClick={handleNext}
            className="hover:text-main transition-colors font-medium"
          >
            &gt;
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-textSub font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 border-[1.5px] border-[#D91920] rounded-sm"></div>
            <span>오늘</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-subtleGray border border-textSub rounded-sm"></div>
            <span>경기일</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-line border border-textSub rounded-sm"></div>
            <span>직관한 경기</span>
          </div>
        </div>
      </div>
      <FullCalendar
        ref={calendarRef} // ref 연결
        initialView="dayGridMonth" // 처음에 보여줄 뷰 모드
        plugins={[dayGridPlugin, interactionPlugin]} // 사용할 플러그인
        events={events} // 변환한 데이터 넣어줌
        locale="ko"
        headerToolbar={false} // 헤더 커스텀을 위해 기본값은 없애기
        height="auto"
        fixedWeekCount={false} // 달력이 이번달만 나오게끔
        showNonCurrentDates={false}
        // 요일
        dayHeaderContent={(args) => {
          const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
          return days[args.date.getDay()];
        }}
        // 날짜
        dayCellContent={(args) => {
          return args.date.getDate();
        }}
        // DONE: 해당 날짜에 이벤트가 있는지 확인하고 배경색을 다르게 적용
        dayCellClassNames={(args) => {
          const offset = args.date.getTimezoneOffset() * 60000;
          const dateDefault = new Date(args.date.getTime() - offset);
          const dateStr = dateDefault.toISOString().split("T")[0];

          // 경기가 있는 날
          const matchEvent = events.find((e) => e.start === dateStr);
          if (matchEvent) {
            if (matchEvent.extendedProps.isAttended) {
              return "attended-day-bg"; // 직관한 날 클래스
            }
            return "match-day-bg"; // 경기일 클래스
          }
          const hasMatch = events.some((e) => e.start === dateStr);
          return hasMatch ? "match-day-bg" : "";
        }}
        eventContent={(arg) => {
          const gameData = arg.event.extendedProps;

          return (
            <div className="flex flex-col items-center justify-center mt-3 w-full cursor-pointer hover:scale-105 transition-transform">
              {/* TODO: gameData.opponent 에 맞춰서 맞는 로고 넣기 */}
              <img
                src={
                  `@/assets/images/logos/${gameData.opponent}` ||
                  "/default-logo.png"
                }
                alt={`${gameData.opponent} logo`}
                className="w-10 h-10 object-contain mb-1.5"
              />
              {/* 시간 */}
              <div className="text-[11px] font-bold text-[#1A1A1B]">
                {gameData.time || "19:00"}
              </div>
              {/* 경기장 */}
              <div className="text-[10px] text-gray-600 mt-0.5 whitespace-nowrap">
                {gameData.stadium || "상암 월드컵 경기장"}
              </div>
            </div>
          );
        }}
        eventClick={(info) => {
          console.log("경기 클릭:", info.event.extendedProps);
          // DONE: 클릭된 경기 id를 가지고 페이지 이동
          navigate("/post", { state: { gameId: info.event.id } });
        }}
      />
    </div>
  );
};
