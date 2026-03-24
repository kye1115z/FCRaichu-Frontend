import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

import type { Post } from "../../types/post";
import { MONTH_NAMES } from "@/data/date";
import Typography from "@/components/common/Typography";
import defaultImage from "@/assets/myseoul_logo.png";

interface Props {
  groupedPosts: Record<string, Post[]>;
  sortedKeys: string[];
  observer: IntersectionObserver | null;
}

export default function AllPostsImages({
  groupedPosts,
  sortedKeys,
  observer,
}: Props) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // 스크롤 할 때 이미지가 위 아래로 눕는 효과 넣기 위해 전체 컨테이너를 잡아야 함
  const containerRef = useRef<HTMLDivElement>(null);

  // 연도 감지하는 Ref 등록 함수
  const setRef = (el: HTMLDivElement | null, year: string) => {
    if (el && observer) {
      el.setAttribute("data-year", year);
      observer.observe(el);
    }
  };

  // 스크롤 할 때 기울기 효과 적용
  useEffect(() => {
    let currentScroll = window.scrollY;
    let velocity = 0;
    let renderTilt = 0;
    let animationFrameId: number;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const handleScroll = () => {
      const newScroll = window.scrollY;
      velocity = newScroll - currentScroll;
      currentScroll = newScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const render = () => {
      velocity = lerp(velocity, 0, 0.15);
      renderTilt = lerp(renderTilt, velocity, 0.4);

      if (containerRef.current) {
        const clampedTilt = Math.max(-15, Math.min(30, renderTilt * -0.3));
        containerRef.current.style.setProperty("--tilt", `${clampedTilt}deg`);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-x-4 gap-y-56 items-start px-10 pb-40"
    >
      {/* 정렬된 연도-월 키를 먼저 순회 */}
      {sortedKeys.map((key) => {
        const [year, month] = key.split("-");
        const monthIndex = parseInt(month) - 1;
        const currentMonthPosts = groupedPosts[key];

        return currentMonthPosts.map((post, index) => {
          // 해당 월의 "첫 번째 포스트"인 경우에만 레이블과 Observer 감지용 Ref를 부여
          const isFirstMonth = index === 0;
          const isDefault = post.thumbnail === null;

          return (
            <div
              key={post.postId}
              className={`relative flex flex-col will-change-transform`}
              ref={isFirstMonth ? (el) => setRef(el, year) : null}
              style={{
                transform: "perspective(1000px) rotateX(var(--tilt, 0deg))",
                transformOrigin: "center center",
              }}
            >
              {/* 월별 첫 번째 콘텐츠이면 그 위에다가 MONTH 이름 달아주자 */}
              {isFirstMonth && (
                <div className="absolute -top-10 left-0 w-full">
                  <Typography
                    variant="label"
                    color="text-secondary"
                    className="tracking-widest"
                  >
                    {MONTH_NAMES[monthIndex]}
                  </Typography>
                </div>
              )}

              {/* 개별 사진 카드 */}
              <div
                onClick={() =>
                  navigate(`/post/${user?.id}/detail/${post.postId}`)
                }
                className={`relative group cursor-pointer overflow-hidden shadow-sm transition-colors ${
                  isDefault ? "py-16 grayscale opacity-50 shadow-lg" : ""
                }`}
                style={{ marginTop: isFirstMonth ? "0" : "0" }}
              >
                <img
                  src={
                    post.thumbnail === null
                      ? defaultImage
                      : `${import.meta.env.VITE_IMAGE_BASE_URL}${post.thumbnail}`
                  }
                  alt={post.title}
                  className={`w-52 h-auto transition-transform duration-700 group-hover:scale-110`}
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                  <span className="text-white text-[10px] font-bold underline underline-white px-3 py-1 tracking-tighter">
                    VIEW DETAIL
                  </span>
                  <p className="text-white text-[10px] mt-2 font-medium opacity-80 truncate w-full text-center">
                    {post.title}
                  </p>
                </div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
