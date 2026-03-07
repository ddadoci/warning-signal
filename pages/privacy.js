import Head from "next/head";
import Link from "next/link";

const NAV = () => (
  <nav style={s.nav}>
    <Link href="/" style={s.navLogo}>checkmywarning</Link>
    <div style={s.navLinks}>
      <Link href="/blog/what-is-warning-signal" style={s.navLink}>아티클</Link>
      <Link href="/about" style={s.navLink}>소개</Link>
      <Link href="/" style={s.navCta}>체크리스트 만들기</Link>
    </div>
  </nav>
);

export default function Privacy() {
  return (
    <>
      <Head>
        <title>개인정보처리방침 — checkmywarning</title>
        <meta name="description" content="checkmywarning 개인정보처리방침" />
      </Head>
      <style>{globalStyle}</style>
      <div style={s.page}>
        <NAV />
        <div style={s.container}>
          <header style={s.header}>
            <div style={s.eyebrow}>LEGAL</div>
            <h1 style={s.title}>개인정보처리방침</h1>
            <p style={s.meta}>최종 수정일: 2025년 1월 1일</p>
          </header>
          <article>
            {sections.map((sec) => (
              <section key={sec.title} style={s.section}>
                <h2 style={s.h2}>{sec.title}</h2>
                {sec.content.map((p, i) => <p key={i} style={s.p}>{p}</p>)}
              </section>
            ))}
          </article>
          <footer style={s.footer}>
            <Link href="/privacy" style={{ ...s.footerLink, color: "#fff" }}>개인정보처리방침</Link>
            <span style={{ color: "#1a1a1a" }}>·</span>
            <span style={s.footerLink}>© 2025 checkmywarning by 따도씨</span>
          </footer>
        </div>
      </div>
    </>
  );
}

const sections = [
  { title: "1. 수집하는 개인정보 항목", content: ["checkmywarning(이하 '서비스')은 위기 신호 체크리스트 생성 기능 제공을 위해 사용자가 직접 입력하는 텍스트 정보를 일시적으로 처리합니다.", "입력된 정보(성격 검사 결과, 자기 관찰 내용 등)는 분석 결과 생성 후 서버에 저장되지 않으며, 분석 완료 즉시 삭제됩니다.", "서비스는 회원가입, 로그인 등의 기능을 제공하지 않으므로 이름, 이메일, 전화번호 등의 개인정보를 수집하지 않습니다."] },
  { title: "2. 개인정보의 처리 목적", content: ["서비스는 사용자가 입력한 정보를 AI 분석 엔진(Anthropic Claude API)에 전달하여 개인화된 위기 신호 체크리스트를 생성하는 목적으로만 사용합니다.", "입력된 정보는 마케팅, 광고, 제3자 제공 등의 목적으로 사용되지 않습니다."] },
  { title: "3. 개인정보의 처리 및 보유 기간", content: ["사용자가 입력한 텍스트 정보는 분석 결과 반환 즉시 처리되며 별도로 저장되지 않습니다.", "서비스는 사용자 데이터를 데이터베이스에 보관하지 않습니다."] },
  { title: "4. 제3자 서비스 이용", content: ["서비스는 AI 분석을 위해 Anthropic의 Claude API를 사용합니다. 입력된 텍스트는 분석 목적으로 Anthropic 서버에 전송됩니다.", "서비스는 Vercel 플랫폼에서 호스팅됩니다.", "서비스는 Google AdSense를 통해 광고를 제공할 수 있습니다. Google의 광고 서비스는 쿠키를 사용할 수 있습니다."] },
  { title: "5. 쿠키 사용", content: ["서비스 자체는 쿠키를 사용하지 않습니다. 다만 Google AdSense 등 제3자 광고 서비스가 쿠키를 사용할 수 있습니다.", "브라우저 설정을 통해 쿠키 사용을 거부하거나 삭제할 수 있습니다."] },
  { title: "6. 이용자의 권리", content: ["사용자는 언제든지 입력한 정보의 처리에 대해 문의할 수 있습니다.", "개인정보와 관련한 문의사항은 ddadoci@gmail.com으로 연락해 주시기 바랍니다."] },
  { title: "7. 개인정보처리방침의 변경", content: ["이 개인정보처리방침은 법령 및 서비스 변경에 따라 수정될 수 있습니다. 변경 시 서비스 내 공지를 통해 안내드립니다."] },
  { title: "8. 문의처", content: ["개인정보처리와 관련한 문의, 불만 처리 등에 관한 사항은 아래의 연락처로 문의하여 주시기 바랍니다.", "이메일: ddadoci@gmail.com"] },
];

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Noto+Serif+KR:wght@300;400;600;700&display=swap');
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
  navCta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#000", background: "#fff", padding: "6px 14px", borderRadius: 2, letterSpacing: "0.04em" },
  container: { maxWidth: 680, margin: "0 auto", padding: "64px 32px 80px" },
  header: { marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid #1a1a1a" },
  eyebrow: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#444", letterSpacing: "0.2em", marginBottom: 20 },
  title: { fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, lineHeight: 1.3, color: "#fff", marginBottom: 12 },
  meta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#333" },
  section: { marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #111" },
  h2: { fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 14, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" },
  p: { fontSize: 13, lineHeight: 1.9, color: "#555", marginBottom: 10 },
  footer: { display: "flex", gap: 12, alignItems: "center", justifyContent: "center", paddingTop: 40, borderTop: "1px solid #1a1a1a" },
  footerLink: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#333" },
};
