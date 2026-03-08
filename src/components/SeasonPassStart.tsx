import { useNavigate } from "react-router-dom";

export default function SeasonPassStart() {
  const navigation = useNavigate();
  return (
    <div>
      <h1>시즌권 포스트 작성</h1>
      <button onClick={() => navigation("/post/season-pass/new")}>Next</button>
    </div>
  );
}
