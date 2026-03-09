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

import DatePicker from "@/components/DatePicker";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function PostBaseLayout() {
  // ⭐️ 이전 페이지에서 gameId를 넘겨준 경우 state 받아와서 분기 처리
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId } = location.state || {};

  // TODO: 유저 정보에 포함되어 있는 season ticket 보고 navigate 바로 처리!
  // 시즌 티켓이 null이거나 올해 연도가 아니면 "일반 유저"
  // 시즌 티켓에 올해 연도 값이 있으면 "시즌권 유저"
  const user = useAuthStore().user;
  const currentYear = new Date().getFullYear(); // 올해 연도
  const isSeasonPass =
    user?.seasonTicket !== null && Number(user?.seasonTicket) === currentYear;

  const [selectedGameId, setSelectedGameId] = useState<number>(
    Number(gameId) || 0,
  ); // 초기값으로 state에서 넘겨받은 gameId 설정
  const [ticketImage, setTicketImage] = useState(""); // 티켓 이미지를 자식으로부터 받아오기

  useEffect(() => {
    // 단순 post로 들어온 경우 하위 경로로 밀어넣기
    const path = location.pathname;
    if (path === "/post" || path === "/post/") {
      if (isSeasonPass) {
        navigate("/post/season-pass", { state: { gameId }, replace: true });
      } else {
        navigate("/post/general/verify", { state: { gameId }, replace: true });
      }
      return;
    }

    // (1) 시즌권 유저인데 general 경로로 들어왔거나, (2) 일반 유저가 season-pass 경로로 들어온 경우 방어 로직
    const isGeneralPath = location.pathname.includes("/general");
    const isSeasonPath = location.pathname.includes("/season-pass");

    if (isSeasonPass && isGeneralPath) {
      // (1)
      navigate("/post/season-pass", { state: { gameId }, replace: true });
    } else if (!isSeasonPass && isSeasonPath) {
      // (2)
      navigate("/post/general/verify", { state: { gameId }, replace: true });
    }
  }, [gameId, isSeasonPass, location.pathname, navigate]);

  // DONE: 경로명이 아니라 유저 정보에 포함되어 있는지 확인해서 타이틀 결정!
  // TODO: Text를 공통 컴포넌트로.
  const title = isSeasonPass ? "직관 기록하기" : "티켓 인증";

  // TODO: gameId가 로딩중이거나 체크 중일 때 빈 화면 방지

  return (
    <>
      {/* TODO: SectionTitle 컴포넌트 생성 - 일반 티켓("티켓 인증") or 시즌권("직관 기록하기") 분기 처리 */}
      <h1>{title}</h1>

      {/* DONE: 날짜 선택 컴포넌트 */}
      <DatePicker value={selectedGameId} onChange={setSelectedGameId} />

      {/* Outlet: "/general" 또는 "/season-pass"를 보여줄 거임  */}
      {/* context로 하위 단계 컴포넌트들에 데이터 전달 */}
      <Outlet
        context={{ selectedGameId, isSeasonPass, ticketImage, setTicketImage }}
      />
    </>
  );
}
