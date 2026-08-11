"use client";
// import { Button as ButtonPrimitive } from "@base-ui/react/button"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const buttonVariants = cva(
//   "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/80",
//         outline:
//           "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
//         ghost:
//           "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
//         destructive:
//           "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default:
//           "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
//         xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
//         sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
//         lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
//         icon: "size-8",
//         "icon-xs":
//           "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
//         "icon-sm":
//           "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
//         "icon-lg": "size-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// function Button({
//   className,
//   variant = "default",
//   size = "default",
//   ...props
// }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
//   return (
//     <ButtonPrimitive
//       data-slot="button"
//       className={cn(buttonVariants({ variant, size, className }))}
//       {...props}
//     />
//   )
// }

// export { Button, buttonVariants }






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
    primary: "bg-[#16A34A] hover:bg-green-300/90 hover:text-black md:rounded-lg rounded-full text-white ",
    secondary: "bg-[#F3F4F6] hover:bg-gray-200 md:rounded-lg rounded-full text-black"
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

