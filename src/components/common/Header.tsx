import { useAuthStore } from "@/stores/useAuthStore";
import { Link, NavLink, useLocation } from "react-router-dom";
import fcseoul_logo from "@/assets/fcseoul_logo.png";
import { useEffect, useRef, useState } from "react";
import { UserModal } from "./UserModal";

export default function Header() {
  // 전역 store에서 user 가져오기 (콕 찝어서 가져와야 다른 상태가 바뀌었을 때 리렌더링 안 됨.)
  const { user } = useAuthStore();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 페이지에 따라 배경색 바꿀 때 필요한 코드
  const isSpecialPage =
    location.pathname === "/signup" || location.pathname === "/donation";

  const headerBg = isSpecialPage ? "bg-secondary" : "bg-background";
  const headerBorder = isSpecialPage ? "border-secondary" : "border-border";

  // 활성화 상태를 결정하는 함수 (Best Practice: 외부에서 판단 로직 주입)
  const getNavItemStyle = (isActive: boolean) =>
    `text-h4 transition-colors font-bold ${
      isActive
        ? "text-primary" // 내가 위치해 있는 nav라면
        : !isSpecialPage // 내가 위치해 있는 헤더가 아닌데~~~
          ? "text-textMain hover:text-primary" // signup이 아니라면
          : "text-background hover:text-primary" // signup이라면
    }`;

  return (
    <header
      className={`w-full border-b ${headerBorder} ${headerBg} sticky top-0 z-100`}
    >
      <nav className="flex flex-row items-center justify-between w-full h-15 px-10 mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <img src={fcseoul_logo} alt="fcseoul_logo" className="h-8 w-auto" />
          </Link>

          <ul className="flex items-center gap-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${getNavItemStyle(isActive)} italic text-primary text-xl`
                }
              >
                MY FC SEOUL
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/post"
                className={() =>
                  // /post 이거나 /post/new 일 때 활성화
                  getNavItemStyle(
                    location.pathname === "/post" ||
                      location.pathname === "/post/new",
                  )
                }
              >
                직관 기록하기
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/post/${user?.id}/all`}
                className={() =>
                  // /post/:id/all 이거나 /post/:id/detail 이 포함될 때 활성화
                  getNavItemStyle(
                    location.pathname.includes(`/post/${user?.id}/all`) ||
                      location.pathname.includes(`/post/${user?.id}/detail`),
                  )
                }
              >
                나의 직관 기록
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/donation"
                className={({ isActive }) => getNavItemStyle(isActive)}
              >
                Donation
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-5 text-body-md" ref={modalRef}>
          {user ? (
            <div className="flex items-center gap-2 text-textSub relative">
              <span className="text-body-sm">환영합니다,</span>
              <button
                className="text-button-md text-primary cursor-pointer"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                {user.nickname}
              </button>
              <button className="text-body-sm">님</button>
              {isModalOpen && (
                <UserModal user={user} setIsModalOpen={setIsModalOpen} />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 text-textSub">
              <Link
                to="/login"
                className="hover:text-textMain transition-colors"
              >
                Login
              </Link>
              <div className="w-px h-3 bg-border" />
              <Link
                to="/signup"
                className="text-button-md text-primary hover:text-hover transition-colors"
              >
                Join Us
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
