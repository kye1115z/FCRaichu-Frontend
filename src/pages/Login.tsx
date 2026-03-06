import { fetchAllProfile } from "@/apis/getUser";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    const res = fetchAllProfile();
    console.log(res);
  });
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}
