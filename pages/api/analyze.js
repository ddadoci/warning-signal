export const config = {
  runtime: "edge",
};

const TOOL = {
  name: "generate_warning_signal",
  description: "사용자 입력 데이터를 분석해 그 사람 전용 위기 신호 자기점검 체계를 생성합니다.",
  input_schema: {
    type: "object",
    properties: {
      identity: { type: "string", description: "한 줄 정체성 정의 (입력 데이터 기반)" },
      strengths: {
        type: "array",
        description: "강점 3~5개",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            basis: { type: "string", description: "근거가 된 입력 내용" },
          },
          required: ["label", "basis"],
        },
      },
      stage1: {
        type: "array",
        description: "1단계 위기 신호 최소 4개 (초기 경고, 구체적 행동/상황)",
        items: {
          type: "object",
          properties: {
            signal: { type: "string" },
            basis: { type: "string" },
          },
          required: ["signal", "basis"],
        },
      },
      stage2: {
        type: "array",
        description: "2단계 위기 신호 최소 4개 (심화 경고)",
        items: {
          type: "object",
          properties: {
            signal: { type: "string" },
            basis: { type: "string" },
          },
          required: ["signal", "basis"],
        },
      },
      stage3: {
        type: "array",
        description: "3단계 위기 신호 최소 4개 (임계점)",
        items: {
          type: "object",
          properties: {
            signal: { type: "string" },
            basis: { type: "string" },
          },
          required: ["signal", "basis"],
        },
      },
      weeklyQ: {
        type: "array",
        description: "주간 점검 질문 3개 (이 사람 패턴 기반)",
        items: { type: "string" },
      },
      monthlyQ: { type: "string", description: "월간 점검 질문 1개" },
      crisisA: { type: "string", description: "이 사람의 과열형 위기 패턴 (1~2줄)" },
      crisisB: { type: "string", description: "이 사람의 공허형 위기 패턴 (1~2줄)" },
      dataGaps: {
        type: "array",
        description: "분석에 더 있으면 좋을 정보 2~3가지",
        items: { type: "string" },
      },
    },
    required: [
      "identity", "strengths", "stage1", "stage2", "stage3",
      "weeklyQ", "monthlyQ", "crisisA", "crisisB", "dataGaps",
    ],
  },
};

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { input, images } = await req.json();
  if (!input?.trim() && (!images || images.length === 0))
    return new Response(JSON.stringify({ error: "입력값 없음" }), { status: 400 });

  const SYSTEM = `당신은 자기 구조 분석 전문가입니다.
사용자가 자신에 대해 입력한 모든 종류의 정보(검사 결과, 주변 묘사, 자기 관찰, 패턴 기록 등)를 종합 분석해서 그 사람 전용 위기 신호 자기점검 체계를 만들어주세요.

규칙:
- 위로 문장 금지. 구조 분석만.
- 각 신호는 입력된 데이터 중 하나 이상을 명시적 근거로 사용
- 데이터 없는 영역은 있는 것들로 교차 추론
- 신호는 행동/관계/내면 영역 골고루`;

  const USER = `다음은 사용자가 자신에 대해 입력한 정보입니다:

---
${input}
---

generate_warning_signal 도구를 사용해 이 사람 전용 위기 신호 체계를 만들어주세요. 각 stage는 최소 4개 이상, 강점은 3~5개.`;

  let userContent;
  if (images && images.length > 0) {
    userContent = [
      ...images.map((img) => ({
        type: "image",
        source: { type: "base64", media_type: img.mimeType, data: img.data },
      })),
      { type: "text", text: USER },
    ];
  } else {
    userContent = USER;
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      stream: true,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "generate_warning_signal" },
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!anthropicRes.ok) {
    const errData = await anthropicRes.json();
    return new Response(
      JSON.stringify({ error: `API 오류: ${errData.error?.message || JSON.stringify(errData.error)}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream input_json_delta fragments from tool_use
  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicRes.body.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const event = JSON.parse(data);
              if (
                event.type === "content_block_delta" &&
                event.delta?.type === "input_json_delta"
              ) {
                controller.enqueue(new TextEncoder().encode(event.delta.partial_json));
              }
            } catch {}
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
