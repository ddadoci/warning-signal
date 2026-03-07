import Head from "next/head";
import Link from "next/link";

const NAV = () => (
  <nav style={s.nav}>
    <Link href="/" style={s.navLogo}>checkmywarning</Link>
    <div style={s.navLinks}>
      <Link href="/blog/what-is-warning-signal" style={s.navLinkActive}>아티클</Link>
      <Link href="/about" style={s.navLink}>소개</Link>
      <Link href="/" style={s.navCta}>체크리스트 만들기</Link>
    </div>
  </nav>
);

const FOOTER = () => (
  <footer style={s.footer}>
    <div style={s.footerLeft}>
      <span style={s.footerLogo}>checkmywarning</span>
      <span style={s.footerCopy}>© 2025 by 따도씨</span>
    </div>
    <div style={s.footerRight}>
      <a href="mailto:ddadoci@gmail.com" style={s.footerLink}>ddadoci@gmail.com</a>
      <a href="https://instagram.com/dododokang" target="_blank" rel="noopener noreferrer" style={s.footerLink}>@dododokang</a>
      <Link href="/privacy" style={s.footerLink}>개인정보처리방침</Link>
    </div>
  </footer>
);

export default function Article() {
  return (
    <>
      <Head>
        <title>위기 신호란 무엇인가 — checkmywarning</title>
        <meta name="description" content="번아웃과 위기는 갑자기 오지 않습니다. 항상 신호가 먼저 옵니다. 위기 신호의 개념과 유형, 그리고 내 신호를 파악하는 방법을 알아봅니다." />
      </Head>
      <style>{globalStyle}</style>
      <div style={s.page}>
        <NAV />
        <div style={s.container}>

          <header style={s.header}>
            <div style={s.eyebrow}>ARTICLE · 자기 구조 분석</div>
            <h1 style={s.title}>위기 신호란 무엇인가</h1>
            <p style={s.meta}>따도씨 · 2025</p>
          </header>

          <article>
            <p style={s.lead}>"번아웃은 갑자기 오지 않습니다. 항상 신호가 먼저 옵니다. 그 신호를 알아채지 못하거나, 알아채더라도 무시하는 것이 문제입니다."</p>

            <h2 style={s.h2}>위기 신호의 정의</h2>
            <p style={s.p}>위기 신호란 개인이 심리적·에너지적 한계에 가까워질 때 나타나는 행동, 감정, 관계 패턴의 변화입니다. 의학적 진단 기준이 아니라, 개인의 평소 패턴에서 벗어나는 변화를 의미합니다.</p>
            <p style={s.p}>예를 들어, 평소에 유머 감각이 넘치는 사람이 웃음이 사라진다면 그것이 위기 신호입니다. 평소에 먼저 연락하는 사람이 연락을 끊는다면, 평소에 문제 앞에서 에너지가 생기는 사람이 회피하기 시작한다면 — 그것이 그 사람의 위기 신호입니다.</p>

            <h2 style={s.h2}>왜 신호는 사람마다 다를까</h2>
            <p style={s.p}>위기 신호가 사람마다 다른 이유는 강점과 기질이 다르기 때문입니다. 자극 추구 성향이 강한 사람은 위기 초기에 새로운 것에 과하게 뛰어드는 방식으로 신호가 나타납니다. 반면 안정 추구 성향이 강한 사람은 오히려 변화를 극단적으로 거부하는 방식으로 나타납니다.</p>
            <p style={s.p}>공감 능력이 강점인 사람은 타인의 감정에 과하게 흡수되어 자신의 경계가 무너지는 것이 신호입니다. 전략적 사고가 강점인 사람은 미래에 대한 시나리오가 모두 부정적으로만 보이기 시작하는 것이 신호입니다. 강점이 역전되는 지점이 바로 위기의 입구입니다.</p>

            <h2 style={s.h2}>두 가지 위기 유형</h2>
            <div style={s.twoCol}>
              <div style={s.colA}>
                <div style={s.colTagA}>A TYPE · 과열형</div>
                <p style={s.colText}>에너지가 너무 많이 분산되어 소진되는 패턴입니다. 새로운 프로젝트, 새로운 관계, 새로운 관심사에 계속 뛰어들다가 어느 순간 모든 것이 무너집니다. 낙천적이고 실행력이 강한 사람에게 자주 나타납니다.</p>
              </div>
              <div style={s.colB}>
                <div style={s.colTagB}>B TYPE · 공허형</div>
                <p style={s.colText}>열심히 하고 있지만 왜 하는지 모르는 상태입니다. 성과도 있고 칭찬도 받는데 기쁘지 않습니다. 자기 신념이나 정체성이 불명확한 사람에게 자주 나타납니다. A타입 이후에 B타입으로 이어지는 경우가 많습니다.</p>
              </div>
            </div>

            <h2 style={s.h2}>위기 신호의 3단계</h2>
            {[
              { stage: "STAGE 01", label: "초기 경보", color: "#FFD700", desc: "평소와 다른 작은 행동 변화들이 나타납니다. 이 시점에 인식하면 간단한 조정으로 회복 가능합니다." },
              { stage: "STAGE 02", label: "구조 점검 필요", color: "#FF8C42", desc: "구조적 문제가 시작됩니다. 열심히 하는데 결과가 공허하거나, 작은 결정도 어려워집니다." },
              { stage: "STAGE 03", label: "즉각 멈춰야 함", color: "#FF4444", desc: "핵심 강점이 역전됩니다. 즉각 멈추고 환경을 바꿔야 합니다." },
            ].map((st) => (
              <div key={st.stage} style={{ ...s.stageItem, borderLeftColor: st.color }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: st.color, letterSpacing: "0.12em" }}>{st.stage}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{st.label}</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>{st.desc}</p>
              </div>
            ))}

            <h2 style={s.h2}>내 위기 신호를 파악하는 방법</h2>
            <p style={s.p}>자신의 위기 신호를 파악하려면 두 가지가 필요합니다. 첫째, 자신의 강점과 기질에 대한 데이터입니다. MBTI, 에니어그램, TCI, CliftonStrengths 같은 검사 결과가 도움이 됩니다. 둘째, 주변 사람들의 관찰입니다. 나를 오래 알아온 사람들이 "언제 달라 보이더라"고 말하는 순간들이 중요한 단서입니다.</p>
            <p style={s.p}>이 두 가지 데이터를 교차 분석하면 자신만의 위기 신호 패턴이 보이기 시작합니다. checkmywarning은 이 과정을 자동화합니다. 알고 있는 것을 입력하면, AI가 교차 분석해서 당신 전용 체크리스트를 만들어드립니다.</p>
          </article>

          <div style={s.ctaBlock}>
            <p style={s.ctaText}>내 위기 신호 체크리스트가 궁금하다면</p>
            <Link href="/" style={s.ctaBtn}>지금 바로 만들어보기 →</Link>
          </div>

        </div>
        <FOOTER />
      </div>
    </>
  );
}

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Noto+Serif+KR:wght@300;400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0a0a0a; }
  a { text-decoration: none; color: inherit; }
  a:hover { opacity: 0.7; }
`;

const s = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Noto Serif KR', Georgia, serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 100 },
  navLogo: { fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "0.04em" },
  navLinks: { display: "flex", alignItems: "center", gap: 28 },
  navLink: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.06em" },
  navLinkActive: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#888", letterSpacing: "0.06em" },
  navCta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#000", background: "#fff", padding: "6px 14px", borderRadius: 2, letterSpacing: "0.04em" },
  container: { maxWidth: 680, margin: "0 auto", padding: "64px 32px 80px" },
  header: { marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid #1a1a1a" },
  eyebrow: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#444", letterSpacing: "0.2em", marginBottom: 20 },
  title: { fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.35, color: "#fff", marginBottom: 14, wordBreak: "keep-all" },
  meta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#333" },
  lead: { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(16px, 2.2vw, 20px)", color: "#555", lineHeight: 1.8, borderLeft: "2px solid #2a2a2a", paddingLeft: 20, marginBottom: 48, fontStyle: "italic" },
  h2: { fontSize: 13, fontWeight: 500, color: "#555", marginTop: 40, marginBottom: 18, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" },
  p: { fontSize: 14, lineHeight: 2.1, color: "#666", marginBottom: 16 },
  twoCol: { display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0 32px" },
  colA: { flex: 1, minWidth: 200, background: "#0d0d0d", border: "1px solid #FF8C4222", borderRadius: 3, padding: "16px 18px" },
  colB: { flex: 1, minWidth: 200, background: "#0d0d0d", border: "1px solid #7B5EA722", borderRadius: 3, padding: "16px 18px" },
  colTagA: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#FF8C42", letterSpacing: "0.12em", marginBottom: 10 },
  colTagB: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#A084DC", letterSpacing: "0.12em", marginBottom: 10 },
  colText: { fontSize: 13, lineHeight: 1.8, color: "#555" },
  stageItem: { background: "#0d0d0d", borderLeft: "2px solid", padding: "16px 20px", borderRadius: "0 3px 3px 0", marginBottom: 10 },
  ctaBlock: { textAlign: "center", margin: "64px 0 0", padding: "40px 24px", background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 4 },
  ctaText: { fontSize: 13, color: "#444", marginBottom: 20, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" },
  ctaBtn: { display: "inline-block", background: "#fff", color: "#000", padding: "14px 28px", borderRadius: 2, fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.04em" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, padding: "28px 32px", borderTop: "1px solid #1a1a1a" },
  footerLeft: { display: "flex", flexDirection: "column", gap: 4 },
  footerLogo: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#fff", letterSpacing: "0.06em" },
  footerCopy: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333" },
  footerRight: { display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" },
  footerLink: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333", letterSpacing: "0.04em" },
};
