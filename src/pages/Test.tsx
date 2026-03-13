import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type LoginForm = {
  username: string;
  password: string;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
};

function Test() {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveTokenData = (tokenData: TokenResponse) => {
    localStorage.setItem("access_token", tokenData.access_token);
    localStorage.setItem("refresh_token", tokenData.refresh_token);
    localStorage.setItem("token_type", tokenData.token_type);
    localStorage.setItem("expires_in", String(tokenData.expires_in));
    localStorage.setItem(
      "refresh_expires_in",
      String(tokenData.refresh_expires_in),
    );
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams();
      // params.append("client_id", "my-auth-form");
      params.append("client_id", "react");
      params.append("username", form.username);
      params.append("password", form.password);
      params.append("grant_type", "password");

      const response = await fetch(
        "https://raichu.inwoohub.com/auth/realms/fcraichu/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || "로그인에 실패했습니다.");
      }

      const tokenData = data as TokenResponse;

      saveTokenData(tokenData);

      setMessage("로그인 성공! access_token / refresh_token 저장 완료");

      console.log("access_token:", tokenData.access_token);
      console.log("refresh_token:", tokenData.refresh_token);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      setMessage("저장된 refresh_token이 없습니다.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams();
      params.append("client_id", "react");
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);

      alert(params);

      const response = await fetch(
        "https://raichu.inwoohub.com/auth/realms/fcraichu/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error_description || "토큰 재발급에 실패했습니다.",
        );
      }

      const tokenData = data as TokenResponse;

      saveTokenData(tokenData);

      setMessage("refresh_token으로 새 토큰 발급 완료");

      console.log("새 access_token:", tokenData.access_token);
      console.log("새 refresh_token:", tokenData.refresh_token);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckToken = () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    console.log("저장된 access_token:", accessToken);
    console.log("저장된 refresh_token:", refreshToken);

    if (accessToken || refreshToken) {
      setMessage("콘솔에 저장된 토큰을 출력했습니다.");
    } else {
      setMessage("저장된 토큰이 없습니다.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("refresh_expires_in");

    setMessage("로그아웃 완료! localStorage 토큰 삭제됨.");
  };

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Keycloak 로그인</h1>

        <label htmlFor="username">아이디</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="아이디 입력"
        />

        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호 입력"
        />

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <button type="button" onClick={handleRefreshToken} disabled={loading}>
          {loading ? "처리 중..." : "리프레시 토큰으로 재발급"}
        </button>

        <button type="button" onClick={handleCheckToken}>
          저장된 토큰 확인
        </button>

        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Test;
