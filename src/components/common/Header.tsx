import { useAuthStore } from "@/stores/useAuthStore";
import {
  Link,
  NavLink,
  useLocation,
  type NavLinkRenderProps,
} from "react-router-dom";
import fcseoul_logo from "@/assets/fcseoul_logo.png";
import { useEffect, useState } from "react";

export default function Header() {
  // 전역 store에서 user 가져오기 (콕 찝어서 가져와야 다른 상태가 바뀌었을 때 리렌더링 안 됨.)
  const { user } = useAuthStore();
  const [borderColor, setBorderColor] = useState("secondary");
  const [backColor, setBackColor] = useState("secondary");
  const location = useLocation();

  // DONE: 경로에 따라 헤더 색상 바꾸기
  useEffect(() => {
    if (location.pathname !== "/signup") {
      setBackColor("background");
      setBorderColor("border");
    } else {
      setBackColor("secondary");
      setBorderColor("secondary");
    }
  }, [location.pathname]);

  const navItemStyle = ({ isActive }: NavLinkRenderProps) =>
    `text-h4 transition-colors ${
      isActive
        ? "text-primary font-bold" // 내가 위치해 있는 nav라면
        : location.pathname !== "/signup" // 내가 위치해 있는 헤더가 아닌데~~~
          ? "text-textMain hover:text-primary" // signup이 아니라면
          : "text-background hover:text-primary" // signup이라면
    }`;

  return (
    <header
      className={`w-full border-b border-${borderColor} bg-${backColor} sticky top-0 z-50`}
    >
      <nav className="flex flex-row items-center justify-between w-full h-15 px-10 mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <img src={fcseoul_logo} alt="fcseoul_logo" className="h-8 w-auto" />
          </Link>

          <ul className="flex items-center gap-8">
            <li>
              <NavLink to="/" className={navItemStyle}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/post" className={navItemStyle}>
                Post
              </NavLink>
            </li>
            <li>
              <NavLink to="/donation" className={navItemStyle}>
                Donation
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-5 text-body-md">
          {user ? (
            <div className="flex items-center gap-2 text-textSub">
              <span className="text-body-sm">환영합니다,</span>
              <span className="text-button-md text-primary">
                {user.nickname}
              </span>
              <span className="text-body-sm">님</span>
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
