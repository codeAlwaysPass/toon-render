import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

/**
 * Button 变体定义 (风格中立)
 * 
 * 提供基础的变体选项,实际视觉风格由用户通过 AI 提示词控制
 * 
 * 
 * @example 用户说"创建一个科技感的按钮"
 * AI 会生成: button,{label:"提交",variant:"primary",style:"tech"}
 * 
 * @example 用户说"创建一个可爱的按钮"  
 * AI 会生成: button,{label:"提交",variant:"primary",style:"cute"}
 */
export const buttonVariants = cva(
  // 基础样式 (所有按钮通用)
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // 语义化变体 (不预设具体风格)
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // 大小变体
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * Button 组件属性
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * 按钮文本
   */
  label?: string;
  
  /**
   * 自定义样式类名
   * 用于 AI 注入动态风格
   */
  styleClass?: string;
}

/**
 * Button 组件 (风格中立)
 * 
 * 
 * @example AI 生成的 TOON 数据
 * ```toon
 * components[3]{type,props}:
 *   button,{label:"科技感按钮",variant:"primary",styleClass:"tech-button"}
 *   button,{label:"可爱按钮",variant:"secondary",styleClass:"cute-button"}
 *   button,{label:"普通按钮",variant:"outline"}
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, label, styleClass, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), styleClass, className)}
        {...props}
      >
        {label || children}
      </button>
    );
  }
);

Button.displayName = "Button";
