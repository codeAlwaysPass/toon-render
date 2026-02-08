"use client";

import { useState } from "react";
import { parseToon, type ToonUI, type Component } from "@toon-render/core";
import { ToonRenderer } from "@toon-render/react";
import { catalog } from "@toon-render/ui";

/**
 * 主页面组件
 */
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [ui, setUi] = useState<ToonUI | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string>("");

  /**
   * 调用 DeepSeek API 生成 UI
   */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setRawResponse("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      const data = await response.json();
      setRawResponse(data.toon);

      // 解析 TOON 格式
      const parsedUI = parseToon(data.toon);
      setUi(parsedUI);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Toon Render
          </h1>
          <p className="text-lg text-gray-600">
            AI驱动的UI生成平台 · 基于TOON格式 · 节省60% Token
          </p>
        </div>

        {/* 输入区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              描述你想要的UI (支持风格定制)
            </span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如: 创建一个科技感的登录表单&#10;例如: 创建一个可爱风格的搜索框&#10;例如: 创建一个极简风格的注册页面"
              className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg resize-none
                       focus:outline-none focus:border-purple-500 transition-colors
                       placeholder:text-gray-400"
              disabled={loading}
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                     font-semibold py-3 px-6 rounded-lg 
                     hover:from-purple-700 hover:to-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "生成中..." : "生成 UI"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <strong className="font-semibold">错误: </strong>
              {error}
            </div>
          )}
        </div>

        {/* 结果展示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TOON 原始数据 */}
          {rawResponse && (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3">
              <h2 className="text-xl font-bold text-gray-800">TOON 格式数据</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {rawResponse}
              </pre>
              <p className="text-sm text-gray-500">
                💡 相比 JSON 节省约 60% token
              </p>
            </div>
          )}

          {/* 渲染结果 */}
          {ui && (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3">
              <h2 className="text-xl font-bold text-gray-800">渲染结果</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                <ToonRenderer
                  ui={ui}
                  onComponentClick={(component: Component) => {
                    console.log("Clicked:", component);
                    alert(`点击了: ${component.type}`);
                  }}
                  onInputChange={(component: Component, value: string) => {
                    console.log("Input changed:", value);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            由 <a href="https://github.com/toon-format/toon" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">TOON Format</a> 和 <a href="https://www.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">DeepSeek</a> 驱动
          </p>
          <p className="text-xs">
            已支持使用 {Object.keys(catalog.components).length} 个组件
          </p>
        </div>
      </div>
    </div>
  );
}
