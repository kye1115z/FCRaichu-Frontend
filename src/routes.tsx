import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./QueryClient";

import { playersLoader } from "./features/donation/api/player";

import RootLayout from "./layouts/RootLayout";
import PostWriteBaseLayout from "./layouts/PostBaseLayout";
import MyPostLayout from "./layouts/MyPostLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Donation from "./pages/Donation";
import PostDetail from "./pages/PostDetail";

import RecordWriteStep from "./features/post/components/write/RecordWriteStep";
import { GamePicker } from "./features/post/components/write/GamePickerStep";
import { AllPosts } from "./features/post/components/list/AllPosts";

// React Router 팀에서 권장하는 Data APIs & 객체 스타일 방식을 사용해 보았다.
export const router = createBrowserRouter([
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
      {
        path: "donation",
        element: <Donation />,
        // 함수를 실행해서 queryClient를 주입한 뒤, loader로 등록.
        loader: playersLoader(queryClient),
      },
      {
        path: "post",
        element: <PostWriteBaseLayout />,
        children: [
          { index: true, element: <GamePicker /> },
          { path: "new", element: <RecordWriteStep /> },
          { path: "edit/:postId", element: <RecordWriteStep /> },
        ],
      },
      {
        path: "post/:userId",
        element: <MyPostLayout />,
        children: [
          { path: "all", element: <AllPosts /> },
          { path: "detail/:postId", element: <PostDetail /> },
        ],
      },
    ],
  },
]);
