export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { input, images } = req.body;
  if (!input?.trim() && (!images || images.length === 0)) return res.status(400).json({ error: "입력값 없음" });

  const SYSTEM = `당신은 자기 구조 분석 전문가입니다.
사용자가 자신에 대해 입력한 모든 종류의 정보(검사 결과, 주변 묘사, 자기 관찰, 패턴 기록 등)를 종합 분석해서 그 사람 전용 위기 신호 자기점검 체계를 만들어주세요.

규칙:
- 위로 문장 금지. 구조 분석만.
- 각 신호는 입력된 데이터 중 하나 이상을 명시적 근거로 사용
- 데이터 없는 영역은 있는 것들로 교차 추론
- 신호는 행동/관계/내면 영역 골고루
- 반드시 순수 JSON만 반환 (코드블록, 설명 텍스트 없이)`;

  const USER = `다음은 사용자가 자신에 대해 입력한 정보입니다:

---
${input}
---

아래 JSON 구조로 이 사람 전용 위기 신호 체계를 만들어주세요:

{
  "identity": "한 줄 정체성 정의 (입력 데이터 기반)",
  "strengths": [
    {"label": "강점명", "basis": "근거가 된 입력 내용"}
  ],
  "stage1": [
    {"signal": "신호 내용 (구체적 행동/상황으로)", "basis": "근거"}
  ],
  "stage2": [
    {"signal": "신호 내용", "basis": "근거"}
  ],
  "stage3": [
    {"signal": "신호 내용", "basis": "근거"}
  ],
  "weeklyQ": ["주간 점검 질문 3개 (이 사람 패턴 기반)"],
  "monthlyQ": "월간 점검 질문 1개",
  "crisisA": "이 사람의 과열형 위기 패턴 (1~2줄)",
  "crisisB": "이 사람의 공허형 위기 패턴 (1~2줄)",
  "dataGaps": ["분석에 더 있으면 좋을 정보 2~3가지"]
}

각 stage는 최소 4개 이상. 강점은 3~5개.`;

  // Build message content: images first, then text
  let userContent;
  if (images && images.length > 0) {
    userContent = [
      ...images.map((img) => ({
        type: "image",
        source: {
          type: "base64",
          media_type: img.mimeType,
          data: img.data,
        },
      })),
      { type: "text", text: USER },
    ];
  } else {
    userContent = USER;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
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
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({ error: `API 오류: ${errData.error?.message || JSON.stringify(errData.error)}` });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Transfer-Encoding", "chunked");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const event = JSON.parse(data);
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
            res.write(event.delta.text);
          }
        } catch {}
      }
    }

    res.end();
  } catch (e) {
    console.error("Analyze error:", e);
    if (!res.headersSent) {
      res.status(500).json({ error: "분석 중 오류가 발생했습니다." });
    } else {
      res.end();
    }
  }
}
