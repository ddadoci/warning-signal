import Head from "next/head";
import Link from "next/link";

const NAV = () => (
  <nav style={s.nav}>
    <Link href="/" style={s.navLogo}>checkmywarning</Link>
    <div style={s.navLinks}>
      <Link href="/blog/what-is-warning-signal" style={s.navLink}>아티클</Link>
      <Link href="/about" style={s.navLinkActive}>소개</Link>
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

export default function About() {
  return (
    <>
      <Head>
        <title>소개 — checkmywarning</title>
        <meta name="description" content="checkmywarning은 자기 구조 분석 기반의 위기 신호 자기점검 체계를 만들어주는 서비스입니다." />
      </Head>
      <style>{globalStyle}</style>
      <div style={s.page}>
        <NAV />
        <div style={s.container}>

          <header style={s.header}>
            <div style={s.eyebrow}>ABOUT</div>
            <h1 style={s.title}>나를 가장 잘 아는 건<br />결국 나 자신이다</h1>
            <p style={s.sub}>checkmywarning은 자기 구조 분석 기반의 위기 신호 자기점검 체계를 만들어주는 서비스입니다.</p>
          </header>

          <section style={s.section}>
            <h2 style={s.h2}>왜 만들었나요</h2>
            <p style={s.p}>번아웃은 갑자기 오지 않습니다. 항상 신호가 먼저 옵니다. 문제는 그 신호가 사람마다 다르다는 것입니다. 어떤 사람은 유머 감각이 사라질 때, 어떤 사람은 새로운 것에 과하게 뛰어들 때, 어떤 사람은 연락을 먼저 안 하게 될 때 위기가 시작됩니다.</p>
            <p style={s.p}>일반적인 번아웃 체크리스트는 모든 사람에게 같은 질문을 던집니다. 하지만 사람의 구조는 다릅니다. checkmywarning은 당신이 입력한 정보를 바탕으로 당신에게만 맞는 위기 신호 체계를 만들어드립니다.</p>
          </section>

          <section style={s.section}>
            <h2 style={s.h2}>어떻게 작동하나요</h2>
            {[
              { num: "01", title: "자유롭게 입력", desc: "MBTI, 에니어그램, TCI 등 검사 결과나 주변에서 자주 듣는 말, 스스로 관찰한 패턴을 형식 없이 입력합니다." },
              { num: "02", title: "AI 교차 분석", desc: "입력된 정보를 교차 분석해 당신의 강점 구조, 위기 패턴, 과열형·공허형 위기 유형을 파악합니다." },
              { num: "03", title: "전용 체크리스트 생성", desc: "1단계(초기 경보)부터 3단계(위험 경보)까지, 당신의 데이터에 근거한 구체적인 위기 신호 목록을 만들어드립니다." },
              { num: "04", title: "정기 점검", desc: "주간·월간 점검 질문으로 자신의 상태를 주기적으로 확인합니다." },
            ].map((step) => (
              <div key={step.num} style={s.step}>
                <span style={s.stepNum}>{step.num}</span>
                <div>
                  <div style={s.stepTitle}>{step.title}</div>
                  <div style={s.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </section>

          <section style={s.section}>
            <h2 style={s.h2}>만든 사람</h2>
            <div style={s.profileCard}>
              <div style={s.profileName}>따도씨</div>
              <p style={s.p}>자기 구조 분석과 강점 기반 설계에 관심이 많습니다. 사람마다 다른 위기 패턴을 데이터로 구조화하는 작업을 합니다. TCI, CliftonStrengths, 에니어그램, 사주 등 다양한 자기 이해 도구를 교차 분석해 개인 전용 인사이트를 만드는 것이 전문입니다.</p>
              <div style={s.profileLinks}>
                <a href="mailto:ddadoci@gmail.com" style={s.profileLink}>ddadoci@gmail.com</a>
                <span style={{ color: "#333" }}>·</span>
                <a href="https://instagram.com/dododokang" target="_blank" rel="noopener noreferrer" style={s.profileLink}>@dododokang</a>
              </div>
            </div>
          </section>

          <div style={s.cta}>
            <Link href="/" style={s.ctaBtn}>내 위기 신호 체크리스트 만들기 →</Link>
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
  header: { marginBottom: 64, paddingBottom: 48, borderBottom: "1px solid #1a1a1a" },
  eyebrow: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#444", letterSpacing: "0.2em", marginBottom: 24 },
  title: { fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.35, color: "#fff", marginBottom: 20, wordBreak: "keep-all" },
  sub: { fontSize: 15, color: "#666", lineHeight: 1.9 },
  section: { marginBottom: 56, paddingBottom: 56, borderBottom: "1px solid #1a1a1a" },
  h2: { fontSize: 16, fontWeight: 700, color: "#aaa", marginBottom: 24, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" },
  p: { fontSize: 14, lineHeight: 2.0, color: "#666", marginBottom: 16 },
  step: { display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 },
  stepNum: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333", flexShrink: 0, width: 28, paddingTop: 3 },
  stepTitle: { fontSize: 14, fontWeight: 600, color: "#ccc", marginBottom: 6 },
  stepDesc: { fontSize: 13, color: "#555", lineHeight: 1.8 },
  profileCard: { background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 4, padding: "24px 28px" },
  profileName: { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 },
  profileLinks: { display: "flex", gap: 12, alignItems: "center", marginTop: 16 },
  profileLink: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.04em" },
  cta: { textAlign: "center", paddingTop: 16 },
  ctaBtn: { display: "inline-block", background: "#fff", color: "#000", padding: "14px 28px", borderRadius: 2, fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.04em" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, padding: "28px 32px", borderTop: "1px solid #1a1a1a" },
  footerLeft: { display: "flex", flexDirection: "column", gap: 4 },
  footerLogo: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#fff", letterSpacing: "0.06em" },
  footerCopy: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333" },
  footerRight: { display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" },
  footerLink: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333", letterSpacing: "0.04em" },
};
