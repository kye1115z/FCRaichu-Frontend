import { postSingUp } from "@/apis/auth/postSignUp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState({
    userId: "",
    password: "",
    nickname: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postSingUp(signUpData);

      if (res.status === 201) {
        alert("가입을 환영합니다! 로그인을 진행해 주세요.");
        navigate("/login");
      }
    } catch (error) {
      console.log("회원가입 실패: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="id"
        name="userId"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="password"
        name="password"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="nickname"
        name="nickname"
        onChange={handleChange}
      />
      <button type="submit">가입하기</button>
    </form>
  );
}
