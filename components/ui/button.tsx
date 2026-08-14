"use client";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
}

export default function Button({ 
  label, 
  variant = 'primary', 
  onClick, 
  className, 
  style,
  children,
  type,
  isLoading,
  disabled 
}: ButtonProps) {
  // Base styles (Size, Font, Shadow)
  const baseStyles = "inline-flex items-center justify-center gap-2 px-[20px] cursor-pointer py-[10px] text-[20px] leading-[30px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 disabled:hover:shadow-none disabled:active:scale-100";

  // Variant specific styles
  const variants = {
    primary: "bg-[#16A34A] hover:bg-green-300/90 hover:text-black  rounded-full text-white ",
    secondary: "bg-[#F3F4F6] hover:bg-gray-200  rounded-full text-black"
  };

  return (
    <button 
      onClick={onClick}
      type={type || "submit"}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
      style={style}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children || label}
    </button>
  );
}

