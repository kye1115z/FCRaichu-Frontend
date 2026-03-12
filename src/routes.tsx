import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/signup/SignUp";
import PostBaseLayout from "./layouts/PostBaseLayout";
import RecordWriteStep from "./components/post/RecordWriteStep";
import Donation from "./pages/Donation";
import { GamePicker } from "./components/post/GamePickerStep";
import LandingLayout from "./layouts/LandingLayout";
import IntroAnimation from "./components/landing/IntroAnimation";

// React Router 팀에서 권장하는 Data APIs & 객체 스타일 방식을 사용해 보았다.
export const router = createBrowserRouter([
  {
    path: "/landing",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <IntroAnimation />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "verify-tickets",
        element: <VerifyTicketAdminTest />,
      },
    ],
  },
  {
    path: "/",
    element: <RootLayout />, // 공통 레이아웃 적용
    children: [
      {
        index: true, // 메인 페이지 ("/")
        element: <Home />,
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "donation", element: <Donation /> },
      {
        path: "post",
        element: <PostBaseLayout />,
        children: [
          { index: true, element: <GamePicker /> },
          { path: "new", element: <RecordWriteStep /> },
        ],
      },

      //   나중에 데이터 페칭이 필요한 컴포넌트는 아래의 방식으로 불러오기
      //   {
      //     path: "example/:id",
      //     element: <Example />,
      //     loader: exampleLoader,
      //   }
    ],
  },
]);
