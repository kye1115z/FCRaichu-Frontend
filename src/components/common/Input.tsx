import Typography from "@/styles/common/Typography";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      {label && (
        <Typography variant="h4" color="text-subtleGray" className="">
          {label}
        </Typography>
      )}
      <input
        className={`
          w-full h-12 px-4 bg-transparent rounded-lg text-input text-background
          placeholder:text-textSub outline-none transition-all duration-200

          border border-textSub

          hover:border-[1.5px] hover:border-line

          focus:border-[1.5px] focus:border-primary

          ${error ? "border-primary!" : ""}
          ${className}
          `}
        {...props}
      />
      {error && <span className="">{error}</span>}
    </div>
  );
}
