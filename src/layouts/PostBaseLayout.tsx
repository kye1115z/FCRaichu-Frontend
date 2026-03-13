// 아래 주석 무시.. 고민했던 흔적이 아까워서 남겨두지만... 인증을 없애며 무용지물이 되어버린..

// 글쓰기 페이지 흐름 정리 (일반 티켓인지 시즌권인지에 따라 달라지므로 제대로 정의하자.)
// 1. 일반 티켓인 경우
// 1-1. 첫 화면: 타이틀 - "티켓 인증" / 날짜 선택 / 인증 사진 등록 / Next
// 1-2. 다음 화면: 타이틀 - "직관 기록하기" / 선택된 날짜 그대로 / 직관 기록 textarea / Send
// 2. 시즌권 티켓인 경우 (인증 불필요)
// 2-1. 첫 화면: 타이틀 - "직관 기록하기" / 날짜 선택 / / Next
// 2-2. 다음 화면: 타이틀 - "직관 기록하기" / 선택된 날짜 그대로 / 직관 기록 textarea / Send

// PostLayout에서 타이틀 분기, 날짜 선택까지 공통으로 사용
// 1-1 은 post/general/verify
// 1-2 는 post/general/new
// 2-1 은 post/season-pass
// 2-2 는 post/season-pass/new
// 2-1과 2-2는 같은 컴포넌트 사용할 것.

import { StepTracker } from "@/components/post/StepTracker";
import DatePicker from "@/components/verify/DatePicker";
import Typography from "@/styles/common/Typography";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function PostWriteBaseLayout() {
  // ⭐️ 이전 페이지에서 gameId를 넘겨준 경우 state 받아와서 분기 처리
  const location = useLocation();
  const { gameId } = location.state || {};

  // DONE: 티켓, 시즌 관련 전부 삭제

  const [selectedGameId, setSelectedGameId] = useState<number>(
    Number(gameId) || 0,
  ); // 초기값으로 state에서 넘겨받은 gameId 설정

  // TODO: gameId가 로딩중이거나 체크 중일 때 빈 화면 방지

  return (
    <div
      className={`
      flex flex-col items-center w-full mx-auto pt-16
    `}
    >
      <Typography variant="h1" className="mb-10">
        직관 기록하기
      </Typography>

      {/* 단계를 보여주는 UI */}
      <StepTracker />

      {/* DONE: 날짜 선택 컴포넌트 */}
      <DatePicker value={selectedGameId} onChange={setSelectedGameId} />

      {/* context로 하위 단계 컴포넌트들에 데이터 전달 */}
      <Outlet context={{ selectedGameId }} />
    </div>
  );
}
