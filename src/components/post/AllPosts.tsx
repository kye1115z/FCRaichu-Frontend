// 아이디어
// 제목과 연도를 상단에 고정 및 sticky 처리한다.
// 그 아래 이미지들은 세로 스크롤이 될 예정인데, 월별로 묶어서 보여줄 거임.
// 가장 상단에 있는 "월"에 맞춰서 "연도"를 바꿔줌. (상단에 2025년 3월의 데이터가 있으면 아래 이미지에는 3월만 보여주고 그 위에 상단에는 2025를 보여주는 식)
// 이미지 클릭하면 상세로 넘어갈 수 있도록

// 뷰포트 상단에 월별 첫 사진이 걸릴 때 연도 업데이트.

import { getMyAllPosts } from "@/apis/posts/postApi";
import Typography from "@/styles/common/Typography";
import type { Post } from "@/types/post";
import { useEffect, useMemo, useRef, useState } from "react";
import AllPostsImages from "./AllPostsImages";
import ReactECharts from "echarts-for-react";
import { calcStats } from "@/utils/caclStats";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const AllPosts = () => {
  const { userId } = useParams<{ userId: string }>();
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString(),
  );
  const observer = useRef<IntersectionObserver | null>(null); // 스크롤 감지

  const { data, isLoading } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getMyAllPosts(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });

  const { posts = [], win = 0, draw = 0, lose = 0, count = 0 } = data || {};
  const rate = useMemo(() => calcStats(win, draw, lose), [win, draw, lose]);

  // DONE: 스크롤 할 때 같은 줄에 여러 연도가 함께 있으면 25, 26 아주 정신을 못 차리는 에러 발생.
  // 섹션을 감지하는 로직
  const visibleElements = useRef(new Map<Element, string>()); // 하나의 줄에 있는 연도 담기

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        let hasChanges = false;

        entries.forEach((entry) => {
          const year = entry.target.getAttribute("data-year");
          if (!year) return;

          if (entry.isIntersecting) {
            // 화면에 들어오면 원래는 바로 currentYear을 바꿨는데 일단 바구니에 담는 걸로 변경
            visibleElements.current.set(entry.target, year);
            hasChanges = true;
          } else {
            // 화면에서 나가면 바구니에서 빼자
            if (visibleElements.current.has(entry.target)) {
              visibleElements.current.delete(entry.target);
              hasChanges = true;
            }
          }
        });

        // 변화가 생겼고, 바구니에 연도가 하나라도 담겨 있을 때만 업데이트 해줌
        if (hasChanges && visibleElements.current.size > 0) {
          // 바구니에 담긴 연도들을 숫자로 변환한다
          const activeYears = Array.from(visibleElements.current.values()).map(
            Number,
          );

          // 그중 가장 큰 값을 뽑아서 상태 업데이트
          const highestYear = Math.max(...activeYears).toString();
          setCurrentYear(highestYear);
        }
      },
      {
        rootMargin: "20% 0px -70% 0px",
        threshold: 0,
      },
    );
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  // 받아온 데이터를 연도-월 이런 식으로 그룹화
  const groupedPosts = useMemo(() => {
    if (!posts.length) return {};

    return (posts as Post[]).reduce(
      (acc, post) => {
        // gameDate 날짜 가져오기
        const dateStr = post.gameDate;

        if (!dateStr) return acc;

        // 파싱
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return acc; // 유효하지 않은 날짜 패스

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const key = `${year}-${month}`;

        if (!acc[key]) acc[key] = [];
        acc[key].push(post);

        return acc;
      },
      {} as Record<string, Post[]>,
    );
  }, [posts]);

  const sortedKeys = Object.keys(groupedPosts).sort().reverse(); // 최신순으로 정렬하기

  // 도넛 차트 옵션
  const chartOption = {
    color: ["#0046FF", "#D1D5DB", "#D91920"],
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}번 ({d}%)",
    },
    series: [
      {
        name: "직관 통계",
        type: "pie",
        radius: ["60%", "85%"], // 도넛 두께
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: false },
        },
        data: [
          { value: win, name: "승리" },
          { value: draw, name: "무승부" },
          { value: lose, name: "패배" },
        ],
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <>
      <div className="relative w-full min-h-screen pb-40">
        <div className="sticky top-15 z-50 w-full flex justify-between items-center px-24 py-6 bg-background backdrop-blur-md shadow-sm">
          <div className="flex flex-col items-start py-20 mr-60">
            <Typography
              variant="display"
              className="text-5xl! font-black tracking-tighter mb-4"
            >
              나의 직관 기록 <span className="text-primary"> .</span>
            </Typography>
            <Typography
              variant="display"
              className="text-5xl! font-black italic tracking-tighter mb-4"
            >
              {currentYear}
            </Typography>
          </div>

          {/* 오른쪽에 승률이랑 직관 기록 작게 보여주기 */}
          <div className="flex items-center gap-8 p-6 rounded-2xl shadow-sm">
            <div className="relative w-32 h-32">
              <ReactECharts
                option={chartOption}
                style={{ height: "100%", width: "100%" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-secondary">
                  {count}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  경기
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Typography
                variant="body-sm"
                className="font-bold! text-gray-400 mb-1"
              >
                전체 승률{" "}
                <span className="text-primary ml-1">{rate.winRate}%</span>
              </Typography>
              <div className="flex gap-4">
                <StatBadge
                  label="승"
                  value={rate.winRate.toString()}
                  color="bg-[#0046FF]"
                />
                <StatBadge
                  label="무"
                  value={rate.drawRate.toString()}
                  color="bg-gray-300"
                />
                <StatBadge
                  label="패"
                  value={rate.loseRate.toString()}
                  color="bg-[#D91920]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-24 mt-30 pb-40">
          {sortedKeys.length > 0 ? (
            <AllPostsImages
              groupedPosts={groupedPosts}
              sortedKeys={sortedKeys}
              observer={observer.current}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-textSub font-bold">
              기록된 직관 일지가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatBadge = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-bold text-gray-500">{label}</span>
    </div>
    <span className="text-lg font-black">{value}</span>
  </div>
);
