import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/signup/SignUp";
import RecordWriteStep from "./components/post/RecordWriteStep";
import Donation from "./pages/Donation";
import { GamePicker } from "./components/post/GamePickerStep";
import PostWriteBaseLayout from "./layouts/PostBaseLayout";
import { AllPosts } from "./components/post/AllPosts";
import MyPostLayout from "./layouts/MyPostLayout";
import PostDetail from "./pages/PostDetail";

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
      { path: "donation", element: <Donation /> },
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

      //   나중에 데이터 페칭이 필요한 컴포넌s트는 아래의 방식으로 불러오기
      //   {
      //     path: "example/:id",
      //     element: <Example />,
      //     loader: exampleLoader,
      //   }
    ],
  },
]);
