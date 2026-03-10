import { useAuthStore } from "@/stores/useAuthStore";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  // 전역 store에서 user 가져오기 (콕 찝어서 가져와야 다른 상태가 바뀌었을 때 리렌더링 안 됨.)
  const { user } = useAuthStore();
  //   const navigation = useNavigate();

  return (
    // tailwind로 디자인
    <header>
      <nav>
        <Link to="/" className="logo">
          logo
        </Link>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {/* TODO: 시즌권이면 /post/season-pass로, 일반 티켓이면 /post/general/verify 로. */}
          <li>
            <NavLink to="/post/general/verify">Post</NavLink>
          </li>
          <li>
            <NavLink to="/donation">Donation</NavLink>
          </li>
        </ul>
        <div>
          {user ? (
            <span>
              환영합니다, <b>{user.nickname}님</b>
            </span>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Join Us</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
