import { useEffect, useRef, useState } from "react";
import { getGames, getGuestGames } from "@/apis/games/gameApi";
import type { Game } from "@/types/game";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

import "./GameCalendar.css";
import Typography from "@/styles/common/Typography";

import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { useAuthStore } from "@/stores/useAuthStore";

export const GameCalendar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const loggedIn = isLoggedIn();

  const [games, setGames] = useState<Game[]>([]);

  // ------------ 날짜 넘길 때 필요한 상태와 Ref
  const calendarRef = useRef<FullCalendar>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // ------------ 경기 일정 데이터 받아오기
  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const fetchFn = loggedIn ? getGames : getGuestGames;
        const res = await fetchFn(currentYear, currentMonth);

        if (res.status === 200) {
          setGames(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchGamesData();
  }, [currentYear, currentMonth]);

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

  // 특정 연/월로 이동하는 함수
  const goToDate = (year: number, month: number) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(`${year}-${String(month).padStart(2, "0")}-01`);
      updateHeaderDate();
    }
  };

  // 연도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    goToDate(newYear, currentMonth);
  };

  // 월 변경 핸들러
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    goToDate(currentYear, newMonth);
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
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const currentDate = calendarApi.getDate();
    const actualYear = currentDate.getFullYear();

    // 현재 보고 있는 날짜가 올해 12월이면 그 이후로 못 가게 막음
    if (
      currentDate.getFullYear() >= actualYear &&
      currentDate.getMonth() >= 11
    ) {
      return;
    }

    calendarApi.next();
    updateHeaderDate();
  };

  // 2010년부터 올해까지만 연도 옵션으로 보여주기
  const startYear = 2010;
  const actualYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: actualYear - startYear + 1 },
    (_, i) => startYear + i,
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      className={`
    custom-calendar-wrapper
    w-full max-w-6xl mx-auto mt-16
    text-secondary
    `}
    >
      {/* 상단 타이틀 & 커스텀 헤더 */}
      <div className="relative text-center mb-24">
        <h1 className="text-8xl font-black text-secondary italic tracking-tighter opacity-5 absolute left-1/2 -top-12 -translate-x-1/2 select-none whitespace-nowrap">
          FC SEOUL MATCHES
        </h1>

        <h2 className="relative text-6xl font-black text-secondary leading-tight uppercase">
          경기 일정 <span className="text-primary italic">.</span>
        </h2>

        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-border"></div>
          <Typography
            variant="body-md"
            color="text-textSub"
            className="font-bold tracking-[0.2em] uppercase"
          >
            {currentYear} SEASON — {currentMonth}월
          </Typography>
          <div className="h-px w-12 bg-border"></div>
        </div>
      </div>

      {/* 달력 날짜 넘기기 & 오늘, 경기일 표시 */}
      <div className="flex justify-between items-end mt-16 mb-4 px-2">
        <div className="flex items-center text-3xl font-bold gap-5">
          {/* DONE: 이전, 다음 버튼으로 바꾸기 */}
          <button
            onClick={handlePrev}
            className="hover:text-main transition-colors font-medium cursor-pointer"
          >
            <MdOutlineArrowBackIos className="hover:text-primary transition-colors font-medium cursor-pointer" />
          </button>
          {/* DONE: 연도와 월을 select 할 수 있게 바꾸기 */}
          {/* 연도 */}
          <div className="relative flex items-center gap-2 group cursor-pointer">
            <select
              value={currentYear}
              onChange={handleYearChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
            <span>{currentYear}</span>
            <span className="text-[10px] align-top group-hover:text-primary transition-colors">
              ▼
            </span>
          </div>
          {/* 월 */}
          <div className="relative flex items-center gap-2 group cursor-pointer">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            <span>{currentMonth}</span>
            <span className="text-[10px] align-top group-hover:text-primary transition-colors">
              ▼
            </span>
          </div>
          <button onClick={handleNext}>
            <MdOutlineArrowForwardIos className="hover:text-primary transition-colors font-medium cursor-pointer" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-textSub font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 border-[1.5px] border-primary rounded-sm"></div>
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
          const isFuture = new Date(arg.event.startStr) > new Date();

          return (
            // DONE: 오늘 날짜 이후는 클릭 방지
            <div
              className={`flex flex-col items-center justify-center mt-3 w-full 
                transition-transform ${isFuture ? "cursor-default opacity-60" : "cursor-pointer hover:scale-105"}`}
            >
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
              <div className="text-[11px] font-bold text-textMain">
                {gameData.time || "19:00"}
              </div>
              {/* 경기장 */}
              <div className="text-[10px] text-textSub mt-1 whitespace-nowrap">
                {gameData.stadium || "상암 월드컵 경기장"}
              </div>
            </div>
          );
        }}
        eventClick={(info) => {
          // DONE: 오늘 날짜 이후는 클릭 방지
          const eventDate = new Date(info.event.startStr);
          const today = new Date();

          today.setHours(0, 0, 0, 0);
          eventDate.setHours(0, 0, 0, 0);

          if (eventDate > today) {
            alert("미래 경기는 아직 기록할 수 없습니다.");
            return;
          }

          console.log("경기 클릭:", info.event.extendedProps);
          // DONE: 클릭된 경기 id를 가지고 페이지 이동
          navigate("/post", { state: { gameId: info.event.id } });
        }}
      />
    </div>
  );
};
