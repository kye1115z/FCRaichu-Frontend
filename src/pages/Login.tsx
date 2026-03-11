import { postLogin } from "@/apis/auth/authApi.ts";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const setAuth = useAuthStore((state) => state.setAuth); // 전역 상태 변경 함수!! (zustand)
  const navigate = useNavigate();

  // 로그인 시 필요한 데이터 정의
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });

  // 키값을 이벤트 객체로 가져와서 데이터 set 하기
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postLogin(loginData); // 미리 정의해둔 postLogin API 함수 사용
      if (res.status === 200) {
        setAuth(res.data); // 서버 응답 데이터를 zustand 스토어에 저장.
        alert("로그인 성공!");
        navigate("/");
      }
    } catch (e) {
      console.log("로그인 실패: ", e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center pt-60 w-full h-[calc(100vh-61px)] bg-secondary box-border"
    >
      <div className="flex flex-col items-center mb-16">
        <Typography variant="h1" color="text-background" className="mb-4">
          로그인
        </Typography>
        <Typography variant="h4" color="text-disabledGray">
          FC라이츄 회원 로그인
        </Typography>
      </div>
      <div className="flex flex-col items-start w-125">
        <div className="flex flex-col gap-8 w-full">
          <Input
            label="ID"
            name="userId"
            placeholder="아이디"
            onChange={handleChange}
          />
          <Input
            label="비밀번호"
            name="password"
            placeholder="비밀번호"
            type="password"
            onChange={handleChange}
          />
        </div>

        <Button type="submit" width="fixed" className="mt-16">
          로그인
        </Button>
      </div>
    </form>
  );
}
