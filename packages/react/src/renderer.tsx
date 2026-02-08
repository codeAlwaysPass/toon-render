import React from "react";
import type { ToonUI, Component } from "@toon-render/core";
import { Button, Input } from "@toon-render/ui";

/**
 * 组件映射表
 * 
 * 将 TOON 中的组件类型映射到实际的 React 组件
 * 
 * 扩展方式:
 * - 添加新组件时,在这里注册
 * - 保持类型名称与 catalog 定义一致
 */
const COMPONENT_MAP = {
  button: Button,
  input: Input,
} as const;

/**
 * ToonRenderer 组件属性
 */
export interface ToonRendererProps {
  /**
   * TOON UI 数据
   * 从 parseToon() 返回或 AI 生成后解析
   */
  ui: ToonUI;
  
  /**
   * 组件点击事件处理
   * @param component - 被点击的组件数据
   */
  onComponentClick?: (component: Component) => void;
  
  /**
   * 输入框变化事件处理
   * @param component - 输入框组件数据
   * @param value - 输入值
   */
  onInputChange?: (component: Component, value: string) => void;
  
  /**
   * 容器样式类名
   */
  className?: string;
}

/**
 * ToonRenderer - TOON 格式到 React 组件的渲染器
 * 
 * 工作流程:
 * 1. 接收 TOON UI 数据 (通过 parseToon 解析)
 * 2. 遍历 components 数组
 * 3. 根据 type 查找对应的 React 组件
 * 4. 传递 props 并渲染
 * 
 */
export const ToonRenderer: React.FC<ToonRendererProps> = ({
  ui,
  onComponentClick,
  onInputChange,
  className = "flex flex-col gap-4 p-6",
}) => {
  /**
   * 渲染单个组件
   */
  const renderComponent = (component: Component, index: number): React.ReactNode => {
    const { type, props = {} } = component;
    
    // 查找对应的 React 组件
    const ReactComponent = COMPONENT_MAP[type as keyof typeof COMPONENT_MAP];
    
    if (!ReactComponent) {
      console.warn(`Unknown component type: ${type}`);
      return null;
    }
    
    // 根据组件类型添加事件处理
    const componentProps: any = { ...props };
    
    if (type === "button") {
      componentProps.onClick = () => onComponentClick?.(component);
    }
    
    if (type === "input") {
      componentProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange?.(component, e.target.value);
      };
    }
    
    return <ReactComponent key={index} {...componentProps} />;
  };
  
  return (
    <div className={className}>
      {ui.components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};
