// 아이디어
// 제목과 연도를 상단에 고정 및 sticky 처리한다.
// 그 아래 이미지들은 세로 스크롤이 될 예정인데, 월별로 묶어서 보여줄 거임.
// 가장 상단에 있는 "월"에 맞춰서 "연도"를 바꿔줌. (상단에 2025년 3월의 데이터가 있으면 아래 이미지에는 3월만 보여주고 그 위에 상단에는 2025를 보여주는 식)
// 이미지 클릭하면 상세로 넘어갈 수 있도록

// 뷰포트 상단에 월별 첫 사진이 걸릴 때 연도 업데이트.

import { getMyAllRecords } from "@/apis/posts/postApi";
import Typography from "@/styles/common/Typography";
import type { Post } from "@/types/post";
import { useEffect, useRef, useState } from "react";
import AllPostsImages from "./AllPostsImages";

export const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString(),
  );
  const observer = useRef<IntersectionObserver | null>(null); // 스크롤 감지

  // 데이터 불러오는 useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getMyAllRecords();
        if (res.status === 200) {
          setPosts(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchPosts();
  }, []);

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
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  // 받아온 데이터를 연도-월 이런 식으로 그룹화
  const groupedPosts = posts.reduce(
    (acc, post) => {
      const date = new Date(post.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  const sortedKeys = Object.keys(groupedPosts).sort().reverse(); // 최신순으로 정렬하기

  return (
    <>
      <div className="relative w-full min-h-screen pb-40">
        <div
          className="sticky top-15 z-50 flex flex-col items-center py-20
         bg-background backdrop-blur-md"
        >
          <Typography
            variant="display"
            className="text-5xl! font-black italic tracking-tighter mb-4"
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

        <div className="flex flex-col gap-24 mt-30 pb-40">
          {sortedKeys.length > 0 ? (
            <AllPostsImages posts={posts} observer={observer.current} />
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
