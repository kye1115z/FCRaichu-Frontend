import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  width?: "fixed" | "full"; // 버튼 120px로 고정할지 부모에 맞출지.
}
export default function Button({
  children,
  width = "fixed",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        flex items-center justify-center
        ${width === "fixed" ? "w-30" : "w-full"}
        h-12 px-6 py-4
        bg-primary text-white rounded-lg
        text-button-md
        
        hover:bg-hover active:bg-active disabled:bg-disabled
        transition-all duration-200 cursor-pointer disabled:cursor-not-allowed
        ${className}
    `}
      {...props}
    >
      {children}
    </button>
  );
}
