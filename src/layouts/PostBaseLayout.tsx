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
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function PostBaseLayout() {
  // 경로명을 체크하여 분기 처리
  const { pathname } = useLocation();
  const [selectedDate, setSeletedDate] = useState(Number);
  // 티켓 이미지를 자식으로부터 받아오기
  const [ticketImage, setTicketImage] = useState("");

  // TODO: 유저 정보에 포함되어 있는 season ticket 보고 navigate 바로 처리!

  // TODO: 경로명이 아니라 유저 정보에 포함되어 있는지 확인해서 타이틀 결정!
  // 경로명에 'season-pass' 포함되어 있는지 확인해서 타이틀 결정
  const isSeasonPass = pathname.includes("season-pass");
  const title = isSeasonPass ? "직관 기록하기" : "티켓 인증";

  return (
    <>
      {/* TODO: SectionTitle 컴포넌트 생성 - 일반 티켓("티켓 인증") or 시즌권("직관 기록하기") 분기 처리 */}
      <h1>{title}</h1>

      {/* DONE: 날짜 선택 컴포넌트 */}
      <DatePicker value={selectedDate} onChange={setSeletedDate} />

      {/* Outlet: "/general" 또는 "/season-pass"를 보여줄 거임  */}
      {/* context로 하위 단계 컴포넌트들에 데이터 전달 */}
      <Outlet
        context={{ selectedDate, isSeasonPass, ticketImage, setTicketImage }}
      />
    </>
  );
}
