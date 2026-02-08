import React from "react";
import { cn } from "../../utils";

/**
 * Input 组件属性
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 输入框标签 (可选)
   */
  label?: string;
  
  /**
   * 错误提示 (可选)
   */
  error?: string;
  
  /**
   * 自定义样式类名
   * 用于 AI 注入动态风格
   */
  styleClass?: string;
}

/**
 * Input 组件 (风格中立)
 * 
 * @example AI 生成的 TOON 数据
 * ```toon
 * components[3]{type,props}:
 *   input,{label:"用户名",placeholder:"请输入用户名",type:"text"}
 *   input,{label:"密码",placeholder:"请输入密码",type:"password",styleClass:"secure-input"}
 *   input,{placeholder:"搜索...",type:"text",styleClass:"search-input"}
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, styleClass, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            // 基础样式
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // 错误状态
            error && "border-destructive focus-visible:ring-destructive",
            // 自定义样式
            styleClass,
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
