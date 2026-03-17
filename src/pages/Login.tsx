import { getLogin } from "@/apis/auth/authApi";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import LogoAnimation from "@/components/login/LogoAnimation";
import Typography from "@/styles/common/Typography";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="bg-secondary box-border overflow-x-hidden min-h-screen flex flex-col items-center justify-center pt-29 pb-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full h-full"
      >
        <LogoAnimation />
        <div className="flex flex-col items-center mb-8">
          <Typography variant="h1" color="text-background" className="mb-4">
            로그인
          </Typography>
          <Typography variant="h4" color="text-disabledGray">
            My Fc Seoul 회원 로그인
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

          <div className="flex justify-between items-end w-full mt-4">
            <Button type="submit" width="fixed" className="mt-8 mr-8">
              로그인
            </Button>
            <Link
              to="/signup"
              className="flex gap-2 hover:opacity-80 transition-opacity"
            >
              <Typography
                variant="body-md"
                color="text-textSub"
                className="hover:underline hover:text-background transition-colors "
              >
                회원가입
              </Typography>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
