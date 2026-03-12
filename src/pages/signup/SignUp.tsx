import { postSingUp } from "@/apis/auth/authApi.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Typography from "@/styles/common/Typography";

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center pt-40 w-full bg-secondary box-border overflow-hidden"
    >
      <div className="flex flex-col items-center mb-16">
        <Typography variant="h1" color="text-background" className="mb-4">
          회원 가입
        </Typography>
        <Typography variant="h4" color="text-disabledGray">
          FC라이츄 회원가입
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
          <Input
            label="닉네임"
            name="nickname"
            placeholder="닉네임"
            onChange={handleChange}
          />
        </div>

        <Button type="submit" width="fixed" className="mt-16">
          가입하기
        </Button>
      </div>
    </form>
  );
}
