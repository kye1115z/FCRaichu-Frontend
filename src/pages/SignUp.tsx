import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSingUp } from "@/features/auth/api/authApi";
import Typography from "@/components/common/Typography";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

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
      console.error("회원가입 실패: ", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center pt-24 md:pt-40 px-6 w-full min-h-screen bg-secondary box-border overflow-x-hidden"
    >
      <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
        <Typography
          variant="h1"
          color="text-background"
          className="mb-4 text-3xl md:text-4xl"
        >
          회원 가입
        </Typography>
        <Typography variant="h4" color="text-disabledGray">
          My FC Seoul 회원가입
        </Typography>
      </div>

      <div className="flex flex-col items-start w-full max-w-100 md:max-w-125">
        <div className="flex flex-col gap-6 md:gap-8 w-full">
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
          <Input
            label="닉네임"
            name="nickname"
            placeholder="닉네임"
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          width="fixed"
          className="mt-12 md:mt-16 w-full md:w-auto self-center md:self-start"
        >
          가입하기
        </Button>
      </div>
    </form>
  );
}
