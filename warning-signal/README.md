# 나만의 위기 신호 체크리스트

by 따도씨 | ddadoci@gmail.com | @dododokang

---

## 배포 순서 (30분 이내)

### 1단계 — GitHub에 올리기

1. github.com 접속 → New repository
2. Repository name: `warning-signal` (또는 원하는 이름)
3. Public 선택 → Create repository
4. 이 폴더 전체를 업로드 (Upload files 버튼)

### 2단계 — Vercel 연결

1. vercel.com 접속 → GitHub 계정으로 로그인
2. "Add New Project" → 방금 만든 GitHub repo 선택
3. Framework: **Next.js** 자동 감지됨
4. **Environment Variables** 섹션에서:
   - Key: `ANTHROPIC_API_KEY`
   - Value: 본인 Anthropic API 키 입력
   - (console.anthropic.com → API Keys에서 발급)
5. Deploy 클릭

→ 2~3분 후 `https://warning-signal-xxx.vercel.app` 주소 자동 생성

### 3단계 — 커스텀 도메인 연결 (선택)

1. 도메인 구매: 가비아, 후이즈 등에서 연간 1~2만원
2. Vercel → Settings → Domains → 도메인 입력
3. DNS 설정 안내대로 따라하면 완료

---

## 애드센스 승인을 위해 추가할 것

승인 조건: 독립 도메인 + 텍스트 콘텐츠 페이지 3개 이상 + 개인정보처리방침

추가하면 좋은 페이지:
- `/about` — 서비스 소개 + 따도씨 소개
- `/blog/what-is-warning-signal` — "위기 신호란 무엇인가" 아티클
- `/privacy` — 개인정보처리방침 (Google 템플릿 사용 가능)

---

## 파일 구조

```
warning-signal/
├── pages/
│   ├── index.js          ← 메인 앱
│   └── api/
│       └── analyze.js    ← Claude API 호출 (API 키 여기서만 사용)
├── .env.local.example    ← 환경변수 예시 (실제 키는 .env.local에)
├── .gitignore            ← .env.local은 GitHub에 올라가지 않음
└── package.json
```

---

## 비용 예상

| 항목 | 월 비용 |
|---|---|
| Vercel (무료 티어) | 0원 |
| Claude API (1회 분석 약 0.003달러) | 사용량에 따라 |
| 도메인 | 월 1,000~2,000원 |

월 1,000회 분석 기준 API 비용 약 3달러(4,000원) 수준.
