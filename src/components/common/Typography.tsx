import type { ReactNode, ElementType } from "react";

type Variant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "body-xs"
  | "button-lg"
  | "button-md"
  | "label"
  | "input";

interface TypographyProps {
  variant?: Variant;
  children: ReactNode;
  as?: ElementType; // 상황에 따라 태그 바꾸려고
  className?: string; // 스타일 적용하려고
  color?: string; // 기본 색상 외 커스텀 필요할 때
}

const variantClasses: Record<Variant, string> = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  "body-lg": "text-body-lg",
  "body-md": "text-body-md",
  "body-sm": "text-body-sm",
  "body-xs": "text-body-xs",
  "button-lg": "text-button-lg",
  "button-md": "text-button-md",
  label: "text-label",
  input: "text-input",
};

export default function Typography({
  variant = "body-md", // 기본 폰트
  children,
  as,
  className = "",
  color = "text-textMain", // 기본 색상
}: TypographyProps) {
  const Component: ElementType = (as ||
    (variant.startsWith("h")
      ? variant
      : variant === "display"
        ? "h1"
        : "p")) as ElementType;

  return (
    <Component className={`${variantClasses[variant]} ${color} ${className}`}>
      {children}
    </Component>
  );
}
