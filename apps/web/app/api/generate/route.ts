import { NextResponse } from "next/server";
import OpenAI from "openai";
import { catalog } from "@toon-render/ui";

import { DEEPSEEK_CONFIG } from "../../models/config";

/**
 * 注意: catalog 是从 @toon-render/ui 导入的组件目录
 * 每个组件的 catalog 定义在各自的组件目录下 (如 components/Button/catalog.ts)
 * 主 catalog.ts 只负责注册这些组件定义
 */

/**
 * POST /api/generate
 * 
 * 调用 DeepSeek API 生成 TOON 格式的 UI
 */
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    if (!DEEPSEEK_CONFIG.apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY not configured" },
        { status: 500 }
      );
    }

    // 初始化 OpenAI 客户端（使用 DeepSeek API）
    const openai = new OpenAI({
      baseURL: DEEPSEEK_CONFIG.baseURL,
      apiKey: DEEPSEEK_CONFIG.apiKey,
    });

    // 调用 DeepSeek API
    const completion = await openai.chat.completions.create({
      model: DEEPSEEK_CONFIG.model,
      messages: [
        {
          role: "system",
          content: catalog.prompt(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: DEEPSEEK_CONFIG.temperature,
      max_tokens: DEEPSEEK_CONFIG.maxTokens,
    });

    const content = completion.choices[0]?.message?.content || "";

    // 提取 TOON 代码块
    const toonMatch = content.match(/```toon\n([\s\S]*?)```/);
    const toonString = toonMatch ? toonMatch[1].trim() : content.trim();

    return NextResponse.json({
      toon: toonString,
      raw: content,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
