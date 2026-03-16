import { MONTH_NAMES } from "@/data/date";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import type { Post } from "@/types/post";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  posts: Post[];
  observer: IntersectionObserver | null;
}

export default function AllPostsImages({ posts, observer }: Props) {
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

    // 부드러움 감속을 위한 보간 함수
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
      // 속도를 서서히 0으로 줄여줄 거임
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
      {posts.map((post, index) => {
        const date = new Date(post.createdAt);
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear().toString();

        // 이전 포스트와 비교해서 '월'이 바뀌었는지 확인한다. (첫 번째 포스트도)
        const isFirstMonth =
          index === 0 ||
          new Date(posts[index - 1].createdAt).getMonth() !== currentMonth;

        return (
          <div
            key={post.postId}
            className={`relative flex flex-col will-change-transform`}
            ref={isFirstMonth ? (el) => setRef(el, currentYear) : null}
            style={{
              transform: "perspective(1000px) rotateX(var(--tilt, 0deg))",
              transformOrigin: "center center",
            }}
          >
            {/* 월별 첫 번째 콘텐츠이면 그 위에다가 MONTH 이름 달아주자 */}
            {/* DONE: 라벨 있는 사진과 없는 사진의 레이아웃이 다르다.. */}
            {isFirstMonth && (
              <div className="absolute -top-10 left-0 w-full">
                <Typography
                  variant="label"
                  color="text-secondary"
                  className="tracking-widest"
                >
                  {MONTH_NAMES[currentMonth]}
                </Typography>
              </div>
            )}

            {/* 개별 사진 카드 */}
            <div
              onClick={() =>
                navigate(`/post/${user?.id}/detail/${post.postId}`)
              }
              className="relative group cursor-pointer overflow-hidden bg-line shadow-sm"
              style={{ marginTop: isFirstMonth ? "0" : "0" }}
            >
              <img
                src={post.images?.[0]}
                alt={post.title}
                className="w-52 h-auto object-cover transition-transform duration-700 group-hover:scale-110"
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
      })}
    </div>
  );
}
