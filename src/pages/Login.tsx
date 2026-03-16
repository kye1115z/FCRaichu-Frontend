import { getLogin } from "@/apis/auth/authApi";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import LogoAnimation from "@/components/login/LogoAnimation";
import Typography from "@/styles/common/Typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
      await getLogin(loginData);
      alert("로그인 성공!");
      navigate("/");
    } catch (e) {
      console.error("로그인 실패: ", e);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center pt-29 pb-10 w-full h-screen
      bg-secondary box-border overflow-x-hidden"
    >
      <LogoAnimation />
      <div className="flex flex-col items-center mb-8">
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

        <Button type="submit" width="fixed" className="mt-8">
          로그인
        </Button>
      </div>
    </form>
  );
}
