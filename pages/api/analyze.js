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
      actionPlan: {
        type: "object",
        description: "각 위기 수준에 도달했을 때 이 사람이 따라야 할 구체적 대응 솔루션. 위로가 아닌, 입력 데이터(강점/패턴)에 기반한 실행 가능한 행동. 추상적 조언 금지.",
        properties: {
          stable: {
            type: "object",
            description: "안정 상태일 때 (유지/예방 루틴)",
            properties: {
              trigger: { type: "string", description: "이 수준에 있다는 판단 기준 (이 사람의 구체적 상태 묘사)" },
              focus: { type: "string", description: "핵심 대응 방향 한 줄" },
              firstStep: { type: "string", description: "오늘 당장 할 수 있는 단 하나의 구체적 첫 행동" },
              actions: { type: "array", description: "구체적 행동 3~4개. 빈도/시간/대상/방법 같은 구체값을 포함하고 이 사람의 강점을 활용할 것 (예: '쉬기' 금지, '매주 일요일 저녁 30분 다음 주 일정에서 일정 1개 비우기' 형태)", items: { type: "string" } },
            },
            required: ["trigger", "focus", "firstStep", "actions"],
          },
          stage1: {
            type: "object",
            description: "초기 경보 수준일 때 (조기 차단)",
            properties: {
              trigger: { type: "string", description: "이 수준에 있다는 판단 기준 (이 사람의 구체적 상태 묘사)" },
              focus: { type: "string", description: "핵심 대응 방향 한 줄" },
              firstStep: { type: "string", description: "오늘 당장 할 수 있는 단 하나의 구체적 첫 행동" },
              actions: { type: "array", description: "구체적 행동 3~4개. 빈도/시간/대상/방법 같은 구체값을 포함하고 이 사람의 강점을 활용할 것", items: { type: "string" } },
            },
            required: ["trigger", "focus", "firstStep", "actions"],
          },
          stage2: {
            type: "object",
            description: "구조 점검 필요 수준일 때 (부하 줄이기/재정비)",
            properties: {
              trigger: { type: "string", description: "이 수준에 있다는 판단 기준 (이 사람의 구체적 상태 묘사)" },
              focus: { type: "string", description: "핵심 대응 방향 한 줄" },
              firstStep: { type: "string", description: "오늘 당장 할 수 있는 단 하나의 구체적 첫 행동" },
              actions: { type: "array", description: "구체적 행동 3~4개. 무엇을 줄이고 무엇을 멈출지 구체적 대상과 함께", items: { type: "string" } },
            },
            required: ["trigger", "focus", "firstStep", "actions"],
          },
          stage3: {
            type: "object",
            description: "즉각 멈춰야 함 수준일 때 (정지/외부 도움)",
            properties: {
              trigger: { type: "string", description: "이 수준에 있다는 판단 기준 (이 사람의 구체적 상태 묘사)" },
              focus: { type: "string", description: "핵심 대응 방향 한 줄" },
              firstStep: { type: "string", description: "지금 당장 할 단 하나의 구체적 첫 행동 (예: 특정 사람에게 연락)" },
              actions: { type: "array", description: "구체적 행동 3~4개. 누구에게(주변/전문가) 어떻게 도움을 요청할지, 무엇을 즉시 멈출지 구체적으로", items: { type: "string" } },
            },
            required: ["trigger", "focus", "firstStep", "actions"],
          },
        },
        required: ["stable", "stage1", "stage2", "stage3"],
      },
    },
    required: [
      "identity", "strengths", "stage1", "stage2", "stage3",
      "weeklyQ", "monthlyQ", "crisisA", "crisisB", "dataGaps", "actionPlan",
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
- 신호는 행동/관계/내면 영역 골고루
- actionPlan(대응 솔루션)은 추상적 조언("쉬세요", "균형을 찾으세요") 절대 금지. 빈도/시간/대상/방법 같은 구체값을 넣어 바로 실행 가능하게. 이 사람의 강점/패턴을 활용하고, 단계가 올라갈수록 강도와 외부 개입(주변, 전문가)이 커지도록.`;

  const USER = `다음은 사용자가 자신에 대해 입력한 정보입니다:

---
${input}
---

generate_warning_signal 도구를 사용해 이 사람 전용 위기 신호 체계를 만들어주세요. 각 stage는 최소 4개 이상, 강점은 3~5개. actionPlan은 안정/1단계/2단계/3단계 각각에 대해 trigger(진입 판단 기준), focus(핵심 방향 1줄), firstStep(오늘 당장 할 첫 행동 하나), actions(구체값이 들어간 행동 3~4개)를 반드시 포함.`;

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
      max_tokens: 8192,
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
  // IMPORTANT: SSE lines can be split across TCP chunks, so we must buffer
  // incomplete lines and only process complete lines.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicRes.body.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          lineBuffer += decoder.decode(value, { stream: true });
          const lines = lineBuffer.split("\n");
          // Last element may be incomplete, keep it in buffer
          lineBuffer = lines.pop() ?? "";
          for (const line of lines) {
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
              } else if (
                event.type === "message_delta" &&
                event.delta?.stop_reason === "max_tokens"
              ) {
                controller.enqueue(new TextEncoder().encode("\n__MAX_TOKENS__"));
              }
            } catch {}
          }
        }
        // Flush any remaining buffered line
        if (lineBuffer.startsWith("data: ")) {
          const data = lineBuffer.slice(6).trim();
          try {
            const event = JSON.parse(data);
            if (
              event.type === "content_block_delta" &&
              event.delta?.type === "input_json_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.partial_json));
            } else if (
              event.type === "message_delta" &&
              event.delta?.stop_reason === "max_tokens"
            ) {
              controller.enqueue(new TextEncoder().encode("\n__MAX_TOKENS__"));
            }
          } catch {}
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
