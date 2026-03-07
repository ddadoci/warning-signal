import Head from "next/head";
import Link from "next/link";

export default function Article() {
  return (
    <>
      <Head>
        <title>위기 신호란 무엇인가 — checkmywarning</title>
        <meta name="description" content="번아웃과 위기는 갑자기 오지 않습니다. 항상 신호가 먼저 옵니다. 위기 신호의 개념과 유형, 그리고 내 신호를 파악하는 방법을 알아봅니다." />
      </Head>
      <style>{globalStyle}</style>
      <div style={css.page}>
        <div style={css.container}>

          <nav style={css.nav}>
            <Link href="/" style={css.navLogo}>checkmywarning</Link>
            <div style={css.navLinks}>
              <Link href="/about" style={css.navLink}>소개</Link>
              <Link href="/blog/what-is-warning-signal" style={css.navLinkActive}>아티클</Link>
            </div>
          </nav>

          <header style={css.header}>
            <div style={css.headerTag}>ARTICLE · 자기 구조 분석</div>
            <h1 style={css.headerTitle}>위기 신호란 무엇인가</h1>
            <p style={css.headerMeta}>따도씨 · 2025</p>
          </header>

          <article>
            <p style={css.lead}>
              번아웃은 갑자기 오지 않습니다. 항상 신호가 먼저 옵니다.
              그 신호를 알아채지 못하거나, 알아채더라도 무시하는 것이 문제입니다.
            </p>

            <h2 style={css.h2}>위기 신호의 정의</h2>
            <p style={css.p}>
              위기 신호란 개인이 심리적·에너지적 한계에 가까워질 때 나타나는 행동, 감정, 관계 패턴의 변화입니다.
              의학적 진단 기준이 아니라, 개인의 평소 패턴에서 벗어나는 변화를 의미합니다.
            </p>
            <p style={css.p}>
              예를 들어, 평소에 유머 감각이 넘치는 사람이 웃음이 사라진다면 그것이 위기 신호입니다.
              평소에 먼저 연락하는 사람이 연락을 끊는다면, 평소에 문제 앞에서 에너지가 생기는 사람이 회피하기 시작한다면 — 그것이 그 사람의 위기 신호입니다.
            </p>

            <h2 style={css.h2}>왜 신호는 사람마다 다를까</h2>
            <p style={css.p}>
              위기 신호가 사람마다 다른 이유는 강점과 기질이 다르기 때문입니다.
              자극 추구 성향이 강한 사람은 위기 초기에 새로운 것에 과하게 뛰어드는 방식으로 신호가 나타납니다.
              반면 안정 추구 성향이 강한 사람은 오히려 변화를 극단적으로 거부하는 방식으로 나타납니다.
            </p>
            <p style={css.p}>
              공감 능력이 강점인 사람은 타인의 감정에 과하게 흡수되어 자신의 경계가 무너지는 것이 신호입니다.
              전략적 사고가 강점인 사람은 미래에 대한 시나리오가 모두 부정적으로만 보이기 시작하는 것이 신호입니다.
              강점이 역전되는 지점이 바로 위기의 입구입니다.
            </p>

            <h2 style={css.h2}>두 가지 위기 유형</h2>
            <p style={css.p}>
              위기는 크게 두 가지 패턴으로 나뉩니다.
            </p>
            <div style={css.twoCol}>
              <div style={css.colA}>
                <div style={css.colTag}>A타입 · 과열형</div>
                <p style={css.colText}>
                  에너지가 너무 많이 분산되어 소진되는 패턴입니다.
                  새로운 프로젝트, 새로운 관계, 새로운 관심사에 계속 뛰어들다가 어느 순간 모든 것이 무너집니다.
                  낙천적이고 실행력이 강한 사람에게 자주 나타납니다.
                </p>
              </div>
              <div style={css.colB}>
                <div style={css.colTagB}>B타입 · 공허형</div>
                <p style={css.colText}>
                  열심히 하고 있지만 왜 하는지 모르는 상태입니다.
                  성과도 있고 칭찬도 받는데 기쁘지 않습니다.
                  자기 신념이나 정체성이 불명확한 사람에게 자주 나타납니다.
                  A타입 이후에 B타입으로 이어지는 경우가 많습니다.
                </p>
              </div>
            </div>

            <h2 style={css.h2}>위기 신호의 3단계</h2>
            <p style={css.p}>
              위기 신호는 단계적으로 진행됩니다. 초기에 알아챌수록 회복이 빠릅니다.
            </p>
            <div style={css.stages}>
              {[
                { stage: "1단계", label: "초기 경보", color: "#C9973A", bg: "#FDF8E7", desc: "평소와 다른 작은 행동 변화들이 나타납니다. 이 시점에 인식하면 간단한 조정으로 회복 가능합니다." },
                { stage: "2단계", label: "중간 경보", color: "#D4724A", bg: "#FBF0EB", desc: "구조적 문제가 시작됩니다. 열심히 하는데 결과가 공허하거나, 작은 결정도 어려워집니다." },
                { stage: "3단계", label: "위험 경보", color: "#B84040", bg: "#F9ECEC", desc: "핵심 강점이 역전됩니다. 즉각 멈추고 환경을 바꿔야 합니다." },
              ].map((s) => (
                <div key={s.stage} style={{ ...css.stageItem, background: s.bg, borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: s.color, letterSpacing: "0.1em" }}>{s.stage}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#3D3530", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 style={css.h2}>내 위기 신호를 파악하는 방법</h2>
            <p style={css.p}>
              자신의 위기 신호를 파악하려면 두 가지가 필요합니다. 첫째, 자신의 강점과 기질에 대한 데이터입니다.
              MBTI, 에니어그램, TCI, CliftonStrengths 같은 검사 결과가 도움이 됩니다.
              둘째, 주변 사람들의 관찰입니다. 나를 오래 알아온 사람들이 "언제 달라 보이더라"고 말하는 순간들이 중요한 단서입니다.
            </p>
            <p style={css.p}>
              이 두 가지 데이터를 교차 분석하면 자신만의 위기 신호 패턴이 보이기 시작합니다.
              checkmywarning은 이 과정을 자동화합니다. 알고 있는 것을 입력하면, AI가 교차 분석해서 당신 전용 체크리스트를 만들어드립니다.
            </p>
          </article>

          <div style={css.cta}>
            <p style={css.ctaText}>내 위기 신호 체크리스트가 궁금하다면</p>
            <Link href="/" style={css.ctaBtn}>지금 바로 만들어보기 →</Link>
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
  header: { marginBottom: 48 },
  headerTag: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: "#B5AFA9", marginBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 12 },
  headerMeta: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", letterSpacing: "0.06em" },
  lead: { fontSize: 16, lineHeight: 1.9, color: "#3D3530", marginBottom: 40, fontStyle: "italic", borderLeft: "3px solid #DDD8D0", paddingLeft: 20 },
  h2: { fontSize: 18, fontWeight: 700, marginTop: 40, marginBottom: 16 },
  p: { fontSize: 14, lineHeight: 1.9, color: "#3D3530", marginBottom: 16 },
  twoCol: { display: "flex", gap: 16, flexWrap: "wrap", margin: "24px 0" },
  colA: { flex: 1, minWidth: 200, background: "#FBF0EB", border: "1px solid #D4724A33", borderRadius: 10, padding: "16px 18px" },
  colB: { flex: 1, minWidth: 200, background: "#F2EEF8", border: "1px solid #7B5EA733", borderRadius: 10, padding: "16px 18px" },
  colTag: { fontFamily: "monospace", fontSize: 10, color: "#D4724A", letterSpacing: "0.1em", marginBottom: 8 },
  colTagB: { fontFamily: "monospace", fontSize: 10, color: "#5E3FA3", letterSpacing: "0.1em", marginBottom: 8 },
  colText: { fontSize: 13, lineHeight: 1.7, color: "#3D3530" },
  stages: { display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" },
  stageItem: { padding: "16px 20px", borderRadius: "0 8px 8px 0" },
  cta: { textAlign: "center", margin: "56px 0 40px", padding: "40px 24px", background: "white", border: "1px solid #DDD8D0", borderRadius: 16 },
  ctaText: { fontSize: 14, color: "#6B6560", marginBottom: 16 },
  ctaBtn: { background: "#1C1916", color: "#F7F4EF", padding: "14px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600 },
  footer: { display: "flex", gap: 12, alignItems: "center", justifyContent: "center", paddingTop: 32, borderTop: "1px solid #EDE9E3" },
  footerLink: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9" },
  footerText: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9" },
};
