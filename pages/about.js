import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>서비스 소개 — checkmywarning</title>
        <meta name="description" content="checkmywarning은 자신에 대한 정보를 입력하면 AI가 당신 전용 위기 신호 자기점검 체계를 만들어주는 서비스입니다." />
      </Head>
      <style>{globalStyle}</style>
      <div style={css.page}>
        <div style={css.container}>

          <nav style={css.nav}>
            <Link href="/" style={css.navLogo}>checkmywarning</Link>
            <div style={css.navLinks}>
              <Link href="/about" style={css.navLinkActive}>소개</Link>
              <Link href="/blog/what-is-warning-signal" style={css.navLink}>아티클</Link>
            </div>
          </nav>

          <header style={css.header}>
            <div style={css.headerTag}>ABOUT</div>
            <h1 style={css.headerTitle}>나를 가장 잘 아는 건<br />결국 나 자신이다</h1>
            <p style={css.headerSub}>
              checkmywarning은 자기 구조 분석 기반의 위기 신호 자기점검 체계를 만들어주는 서비스입니다.
            </p>
          </header>

          <section style={css.section}>
            <h2 style={css.sectionTitle}>왜 만들었나요</h2>
            <p style={css.text}>
              번아웃은 갑자기 오지 않습니다. 항상 신호가 먼저 옵니다. 문제는 그 신호가 사람마다 다르다는 것입니다.
              어떤 사람은 유머 감각이 사라질 때, 어떤 사람은 새로운 것에 과하게 뛰어들 때, 어떤 사람은 연락을 먼저 안 하게 될 때 위기가 시작됩니다.
            </p>
            <p style={css.text}>
              일반적인 번아웃 체크리스트는 모든 사람에게 같은 질문을 던집니다. 하지만 사람의 구조는 다릅니다.
              checkmywarning은 당신이 입력한 정보 — 성격 검사 결과, 주변의 묘사, 스스로 관찰한 패턴 — 를 바탕으로
              당신에게만 맞는 위기 신호 체계를 만들어드립니다.
            </p>
          </section>

          <section style={css.section}>
            <h2 style={css.sectionTitle}>어떻게 작동하나요</h2>
            <div style={css.steps}>
              {[
                { num: "01", title: "자유롭게 입력", desc: "MBTI, 에니어그램, TCI 등 검사 결과나 주변에서 자주 듣는 말, 스스로 관찰한 패턴을 형식 없이 입력합니다." },
                { num: "02", title: "AI 교차 분석", desc: "입력된 정보를 교차 분석해 당신의 강점 구조, 위기 패턴, 과열형·공허형 위기 유형을 파악합니다." },
                { num: "03", title: "전용 체크리스트 생성", desc: "1단계(초기 경보)부터 3단계(위험 경보)까지, 당신의 데이터에 근거한 구체적인 위기 신호 목록을 만들어드립니다." },
                { num: "04", title: "정기 점검", desc: "주간·월간 점검 질문으로 자신의 상태를 주기적으로 확인합니다." },
              ].map((step) => (
                <div key={step.num} style={css.step}>
                  <div style={css.stepNum}>{step.num}</div>
                  <div>
                    <div style={css.stepTitle}>{step.title}</div>
                    <div style={css.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={css.section}>
            <h2 style={css.sectionTitle}>만든 사람</h2>
            <div style={css.profile}>
              <div style={css.profileName}>따도씨</div>
              <p style={css.text}>
                자기 구조 분석과 강점 기반 설계에 관심이 많습니다. 사람마다 다른 위기 패턴을 데이터로 구조화하는 작업을 합니다.
                TCI, CliftonStrengths, 에니어그램, 사주 등 다양한 자기 이해 도구를 교차 분석해 개인 전용 인사이트를 만드는 것이 전문입니다.
              </p>
              <div style={css.profileLinks}>
                <a href="mailto:ddadoci@gmail.com" style={css.profileLink}>ddadoci@gmail.com</a>
                <span style={{ color: "#DDD8D0" }}>·</span>
                <a href="https://instagram.com/dododokang" target="_blank" rel="noopener noreferrer" style={css.profileLink}>@dododokang</a>
              </div>
            </div>
          </section>

          <div style={css.cta}>
            <Link href="/" style={css.ctaBtn}>내 위기 신호 체크리스트 만들기 →</Link>
          </div>

          <footer style={css.footer}>
            <Link href="/privacy" style={css.footerLink}>개인정보처리방침</Link>
            <span style={{ color: "#DDD8D0" }}>·</span>
            <span style={css.footerText}>© 2025 checkmywarning by 따도씨</span>
          </footer>

        </div>
      </div>
    </>
  );
}

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  a { text-decoration: none; }
  a:hover { opacity: 0.7; }
`;

const css = {
  page: { minHeight: "100vh", background: "#F7F4EF", fontFamily: "'Georgia', 'Noto Serif KR', serif", color: "#1C1916" },
  container: { maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", borderBottom: "1px solid #DDD8D0", marginBottom: 56 },
  navLogo: { fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#1C1916", letterSpacing: "0.06em" },
  navLinks: { display: "flex", gap: 24 },
  navLink: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", letterSpacing: "0.06em" },
  navLinkActive: { fontFamily: "monospace", fontSize: 11, color: "#1C1916", letterSpacing: "0.06em" },
  header: { marginBottom: 56 },
  headerTag: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: "#B5AFA9", marginBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 },
  headerSub: { fontSize: 15, color: "#6B6560", lineHeight: 1.8 },
  section: { marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid #EDE9E3" },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#1C1916" },
  text: { fontSize: 14, lineHeight: 1.9, color: "#3D3530", marginBottom: 16 },
  steps: { display: "flex", flexDirection: "column", gap: 20 },
  step: { display: "flex", gap: 20, alignItems: "flex-start" },
  stepNum: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", flexShrink: 0, width: 28, paddingTop: 2 },
  stepTitle: { fontSize: 14, fontWeight: 600, color: "#1C1916", marginBottom: 6 },
  stepDesc: { fontSize: 13, color: "#6B6560", lineHeight: 1.7 },
  profile: { background: "white", border: "1px solid #DDD8D0", borderRadius: 12, padding: "24px 28px" },
  profileName: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
  profileLinks: { display: "flex", gap: 12, alignItems: "center", marginTop: 12 },
  profileLink: { fontFamily: "monospace", fontSize: 11, color: "#6B6560", letterSpacing: "0.04em" },
  cta: { textAlign: "center", margin: "48px 0" },
  ctaBtn: { background: "#1C1916", color: "#F7F4EF", padding: "14px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600 },
  footer: { display: "flex", gap: 12, alignItems: "center", justifyContent: "center", paddingTop: 32, borderTop: "1px solid #EDE9E3" },
  footerLink: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9" },
  footerText: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9" },
};
