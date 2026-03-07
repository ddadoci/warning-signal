import { useState, useRef, useCallback } from "react";
import Head from "next/head";

export default function App() {
  const [phase, setPhase] = useState("input");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const textareaRef = useRef();
  const fileInputRef = useRef();

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach((file) => {
      if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setInputText((prev) => prev + `\n\n[${file.name}]\n${e.target.result}`);
          setUploadedFiles((f) => [...f, file.name]);
        };
        reader.readAsText(file);
      } else {
        setUploadedFiles((f) => [...f, `${file.name} (텍스트 파일만 지원)`]);
      }
    });
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // ← 핵심 변경: Anthropic 직접 호출 → 내 백엔드 호출
  const generate = async () => {
    if (!inputText.trim()) return;
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputText }),
      });
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      setResult(parsed);
      setPhase("result");
    } catch (e) {
      setError(e.message || "분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      setPhase("input");
    }
  };

  const toggleCheck = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  if (phase === "loading") return (
    <>
      <Head><title>분석 중 — 나만의 위기 신호 체크리스트</title></Head>
      <div style={css.page}>
        <div style={css.loadCard}>
          <div style={css.loadDots}>
            {[0,1,2].map(i => <div key={i} style={{ ...css.loadDot, animationDelay: `${i * 0.2}s` }} />)}
          </div>
          <p style={css.loadText}>입력한 정보를 교차 분석하는 중</p>
          <p style={css.loadSub}>패턴 도출, 신호 설계 중…</p>
        </div>
        <style>{keyframes}</style>
      </div>
    </>
  );

  if (phase === "result" && result) {
    const s1c = result.stage1?.filter((_, i) => checked[`s1-${i}`]).length || 0;
    const s2c = result.stage2?.filter((_, i) => checked[`s2-${i}`]).length || 0;
    const s3c = result.stage3?.filter((_, i) => checked[`s3-${i}`]).length || 0;
    const total = s1c + s2c * 2 + s3c * 3;
    const statusColor = s3c >= 2 ? "#B84040" : s3c >= 1 || s2c >= 3 ? "#D4724A" : total >= 3 ? "#C9973A" : "#3D7A5C";
    const statusLabel = s3c >= 2 ? "즉각 멈춰야 함" : s3c >= 1 || s2c >= 3 ? "구조 점검 필요" : total >= 3 ? "초기 경보" : "안정";

    return (
      <>
        <Head><title>나만의 위기 신호 체크리스트 — 결과</title></Head>
        <style>{keyframes}</style>
        <div style={css.page}>
          <div style={css.resultCard}>
            <div style={css.header}>
              <div style={css.headerTag}>PERSONAL WARNING SIGNAL SYSTEM</div>
              <div style={css.headerTitle}>{result.identity}</div>
            </div>

            <div style={css.statusBar}>
              <div>
                <div style={css.statusLabel}>현재 위험도</div>
                <div style={{ ...css.statusScore, color: statusColor }}>{total}</div>
                <div style={css.statusDesc}>{statusLabel}</div>
              </div>
              <div style={css.meterWrap}>
                <div style={css.meterTrack}>
                  <div style={{ ...css.meterFill, width: `${Math.min(total / 20 * 100, 100)}%`, background: statusColor }} />
                </div>
              </div>
              <button onClick={() => setChecked({})} style={css.resetSmall}>초기화</button>
            </div>

            <div style={css.section}>
              <div style={css.sectionTag}>확인된 강점</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.strengths?.map((str, i) => (
                  <div key={i} style={css.strengthItem}>
                    <div style={css.strengthLabel}>{str.label}</div>
                    <div style={css.strengthBasis}>{str.basis}</div>
                  </div>
                ))}
              </div>
            </div>

            <SignalBlock id="s1" badge="1단계 · 초기 경보" title="어긋나기 시작하는 신호"
              color="#C9973A" bg="#FDF8E7" border="#E8C84A55"
              items={result.stage1} checked={checked} onToggle={toggleCheck} />
            <SignalBlock id="s2" badge="2단계 · 중간 경보" title="구조적 문제 진입"
              color="#D4724A" bg="#FBF0EB" border="#D4724A44"
              items={result.stage2} checked={checked} onToggle={toggleCheck} />
            <SignalBlock id="s3" badge="3단계 · 위험 경보" title="즉각 멈춰야 함"
              color="#B84040" bg="#F9ECEC" border="#B8404044"
              items={result.stage3} checked={checked} onToggle={toggleCheck} />

            <div style={css.section}>
              <div style={css.sectionTag}>정기 점검</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.weeklyQ?.map((q, i) => (
                  <div key={i} style={css.qItem}>
                    <span style={css.qNum}>W{i+1}</span>
                    <span style={css.qText}>{q}</span>
                  </div>
                ))}
                <div style={{ ...css.qItem, borderTop: "2px solid #DDD8D0", paddingTop: 14, marginTop: 2 }}>
                  <span style={{ ...css.qNum, fontWeight: 700, color: "#1C1916" }}>M1</span>
                  <span style={{ ...css.qText, fontWeight: 600 }}>{result.monthlyQ}</span>
                </div>
              </div>
            </div>

            <div style={{ ...css.section, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={css.crisisA}>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: "#D4724A", marginBottom: 6 }}>A타입 · 과열형</div>
                <div style={css.crisisText}>{result.crisisA}</div>
              </div>
              <div style={css.crisisB}>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: "#5E3FA3", marginBottom: 6 }}>B타입 · 공허형</div>
                <div style={css.crisisText}>{result.crisisB}</div>
              </div>
            </div>

            {result.dataGaps?.length > 0 && (
              <div style={{ ...css.section, background: "#F7F4EF" }}>
                <div style={css.sectionTag}>정확도를 높이려면</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.dataGaps.map((g, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#6B6560", display: "flex", gap: 8 }}>
                      <span style={{ color: "#B5AFA9", fontFamily: "monospace" }}>+</span>
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: "20px 24px 28px", display: "flex", gap: 10, borderTop: "1px solid #DDD8D0" }}>
              <button onClick={() => { setPhase("input"); setResult(null); setChecked({}); }} style={css.btnSecondary}>
                처음으로
              </button>
              <button onClick={() => { setPhase("input"); setResult(null); setChecked({}); }} style={css.btnPrimary}>
                정보 추가하고 재분석 →
              </button>
            </div>

            <div style={{ ...css.footer, borderTop: "1px solid #DDD8D0", padding: "16px 24px" }}>
              <span style={css.footerName}>따도씨</span>
              <span style={css.footerDot}>·</span>
              <a href="mailto:ddadoci@gmail.com" style={css.footerLink}>ddadoci@gmail.com</a>
              <span style={css.footerDot}>·</span>
              <a href="https://instagram.com/dododokang" target="_blank" rel="noopener noreferrer" style={css.footerLink}>@dododokang</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>나만의 위기 신호 체크리스트 만들기</title>
        <meta name="description" content="자신에 대한 정보를 입력하면 AI가 당신 전용 위기 신호 자기점검 체계를 만들어드립니다." />
        <meta property="og:title" content="나만의 위기 신호 체크리스트" />
        <meta property="og:description" content="검사 결과, 주변 묘사, 자기 관찰 — 아는 것을 입력하면 AI가 분석합니다." />
      </Head>
      <style>{keyframes}</style>
      <div style={css.page}>
        <div style={css.inputCard}>
          <div style={css.titleArea}>
            <div style={css.titleTag}>Self-Architecture · Warning Signal Generator</div>
            <h1 style={css.title}>나만의 위기 신호<br />체크리스트 만들기</h1>
            <p style={css.titleSub}>
              자신에 대해 알고 있는 것을 자유롭게 입력하세요.<br />
              검사 결과, 주변 묘사, 자기 관찰, 패턴 기록 — 형식 없이.
            </p>
          </div>

          <div
            style={{ ...css.dropZone, borderColor: dragOver ? "#1C1916" : "#DDD8D0", background: dragOver ? "#F0EDE8" : "#F7F4EF" }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"자신에 대해 아는 것을 자유롭게 써주세요.\n\n검사 결과, 주변의 말, 스스로 관찰한 패턴, 반복되는 어려움, 사주나 별자리 정보까지 — 형식 없이, 아는 만큼만."}
              style={css.textarea}
            />
            {uploadedFiles.length > 0 && (
              <div style={css.fileList}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={css.fileItem}>
                    <span>📎</span><span>{f}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={css.dropHint}>
              <span>txt, md 파일을 드래그하거나 </span>
              <span onClick={() => fileInputRef.current?.click()} style={css.uploadLink}>클릭해서 업로드</span>
              <input ref={fileInputRef} type="file" accept=".txt,.md" multiple style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)} />
            </div>
          </div>

          <div style={css.infoRow}>
            {["MBTI / DISC", "TCI / NEO-PI", "에니어그램", "CliftonStrengths", "사주 만세력", "별자리 / 태양·달·상승", "주변 묘사", "번아웃 경험", "자기 관찰 메모"].map(t => (
              <div key={t} style={css.infoChip}>{t}</div>
            ))}
          </div>

          {error && <div style={css.errorMsg}>{error}</div>}

          <button
            onClick={generate}
            disabled={!inputText.trim()}
            style={{ ...css.btnPrimary, width: "100%", padding: "14px", fontSize: 14, opacity: inputText.trim() ? 1 : 0.4, cursor: inputText.trim() ? "pointer" : "not-allowed" }}
          >
            위기 신호 체크리스트 만들기 →
          </button>

          <p style={css.noteText}>입력한 내용은 저장되지 않아요 · 분석은 30초 내외</p>

          <div style={css.footer}>
            <span style={css.footerName}>따도씨</span>
            <span style={css.footerDot}>·</span>
            <a href="mailto:ddadoci@gmail.com" style={css.footerLink}>ddadoci@gmail.com</a>
            <span style={css.footerDot}>·</span>
            <a href="https://instagram.com/dododokang" target="_blank" rel="noopener noreferrer" style={css.footerLink}>@dododokang</a>
          </div>
        </div>
      </div>
    </>
  );
}

function SignalBlock({ id, badge, title, color, bg, border, items, checked, onToggle }) {
  if (!items?.length) return null;
  return (
    <div style={{ borderTop: "1px solid #DDD8D0", padding: "18px 24px", background: "#F7F4EF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 99, background: bg, color, border: `1px solid ${border}` }}>
          {badge}
        </span>
        <span style={{ fontSize: 12, color: "#6B6560" }}>{title}</span>
      </div>
      <div style={{ background: "white", border: "1px solid #DDD8D0", borderRadius: 10, overflow: "hidden" }}>
        {items.map((item, i) => {
          const key = `${id}-${i}`;
          const on = !!checked[key];
          return (
            <div key={key} onClick={() => onToggle(key)}
              style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < items.length - 1 ? "1px solid #F0EDE8" : "none", cursor: "pointer", background: on ? "#F5F3EF" : "white", transition: "background 0.12s", userSelect: "none", alignItems: "flex-start" }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${on ? "transparent" : "#DDD8D0"}`, background: on ? color : "white", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}>
                {on && <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div>
                <div style={{ fontSize: 13, color: on ? "#6B6560" : "#1C1916", lineHeight: 1.5 }}>{item.signal}</div>
                <div style={{ fontSize: 11, color: "#B5AFA9", marginTop: 3, fontFamily: "monospace", lineHeight: 1.4 }}>{item.basis}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes pulse { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
  button:hover { opacity: 0.82; }
  textarea::placeholder { color: #B5AFA9; }
  a:hover { opacity: 0.7; }
`;

const css = {
  page: { minHeight: "100vh", background: "#F7F4EF", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px 64px", fontFamily: "'Georgia', 'Noto Serif KR', serif" },
  inputCard: { width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 },
  resultCard: { width: "100%", maxWidth: 540, background: "#F7F4EF", border: "1px solid #DDD8D0", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(28,25,22,0.07)" },
  titleArea: { padding: 0 },
  titleTag: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: "#B5AFA9", textTransform: "uppercase", marginBottom: 14 },
  title: { fontSize: 28, fontWeight: 700, color: "#1C1916", lineHeight: 1.25, marginBottom: 10 },
  titleSub: { fontSize: 13, color: "#6B6560", lineHeight: 1.7 },
  dropZone: { border: "1.5px dashed", borderRadius: 12, overflow: "hidden", transition: "all 0.15s" },
  textarea: { width: "100%", minHeight: 200, background: "transparent", border: "none", outline: "none", padding: "18px 20px 10px", fontSize: 13, color: "#1C1916", lineHeight: 1.75, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" },
  fileList: { padding: "0 20px 8px", display: "flex", flexDirection: "column", gap: 4 },
  fileItem: { fontSize: 11, color: "#6B6560", fontFamily: "monospace", display: "flex", gap: 6, alignItems: "center" },
  dropHint: { padding: "10px 20px 14px", fontSize: 11, color: "#B5AFA9", fontFamily: "monospace", letterSpacing: "0.05em", borderTop: "1px solid #EDE9E3" },
  uploadLink: { color: "#6B6560", textDecoration: "underline", cursor: "pointer" },
  infoRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  infoChip: { background: "white", border: "1px solid #DDD8D0", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#6B6560", fontFamily: "monospace" },
  errorMsg: { background: "#F9ECEC", border: "1px solid #B8404033", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#B84040" },
  noteText: { textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "#B5AFA9", letterSpacing: "0.06em" },
  footer: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 4 },
  footerName: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", letterSpacing: "0.06em" },
  footerDot: { color: "#DDD8D0", fontSize: 10 },
  footerLink: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", textDecoration: "none", letterSpacing: "0.04em" },
  header: { background: "#1C1916", padding: "28px 24px 24px" },
  headerTag: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: "#E8C84A", marginBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: 600, color: "#F7F4EF", lineHeight: 1.4 },
  statusBar: { background: "white", borderBottom: "1px solid #DDD8D0", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 },
  statusLabel: { fontFamily: "monospace", fontSize: 10, color: "#B5AFA9", letterSpacing: "0.1em", marginBottom: 4 },
  statusScore: { fontSize: 30, fontWeight: 700, fontFamily: "monospace", lineHeight: 1 },
  statusDesc: { fontSize: 11, color: "#6B6560", marginTop: 3 },
  meterWrap: { flex: 1 },
  meterTrack: { height: 4, background: "#F0EDE8", borderRadius: 99, overflow: "hidden" },
  meterFill: { height: "100%", borderRadius: 99, transition: "width 0.5s ease" },
  resetSmall: { fontFamily: "monospace", fontSize: 10, color: "#B5AFA9", background: "none", border: "1px solid #DDD8D0", borderRadius: 6, padding: "5px 10px", cursor: "pointer", letterSpacing: "0.06em", flexShrink: 0 },
  section: { padding: "18px 24px", borderTop: "1px solid #DDD8D0", background: "#F7F4EF" },
  sectionTag: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", color: "#B5AFA9", textTransform: "uppercase", marginBottom: 12 },
  strengthItem: { background: "white", border: "1px solid #DDD8D0", borderRadius: 8, padding: "10px 14px" },
  strengthLabel: { fontSize: 13, fontWeight: 600, color: "#1C1916", marginBottom: 3 },
  strengthBasis: { fontSize: 11, color: "#B5AFA9", fontFamily: "monospace", lineHeight: 1.4 },
  qItem: { background: "white", border: "1px solid #DDD8D0", borderRadius: 8, padding: "11px 14px", display: "flex", gap: 10, alignItems: "flex-start" },
  qNum: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", flexShrink: 0, width: 20, marginTop: 1 },
  qText: { fontSize: 13, color: "#1C1916", lineHeight: 1.55 },
  crisisA: { flex: 1, minWidth: 180, background: "#FBF0EB", border: "1px solid #D4724A33", borderRadius: 10, padding: "13px 15px" },
  crisisB: { flex: 1, minWidth: 180, background: "#F2EEF8", border: "1px solid #7B5EA733", borderRadius: 10, padding: "13px 15px" },
  crisisText: { fontSize: 12, lineHeight: 1.6, color: "#1C1916" },
  btnPrimary: { background: "#1C1916", color: "#F7F4EF", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", fontWeight: 600, letterSpacing: "0.02em" },
  btnSecondary: { background: "transparent", color: "#6B6560", border: "1px solid #DDD8D0", borderRadius: 8, padding: "11px 16px", fontSize: 12, fontFamily: "monospace", cursor: "pointer", letterSpacing: "0.07em" },
  loadCard: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 },
  loadDots: { display: "flex", gap: 8 },
  loadDot: { width: 8, height: 8, borderRadius: "50%", background: "#1C1916", animation: "pulse 1.2s ease-in-out infinite" },
  loadText: { fontFamily: "monospace", fontSize: 13, color: "#6B6560", letterSpacing: "0.08em" },
  loadSub: { fontFamily: "monospace", fontSize: 11, color: "#B5AFA9", letterSpacing: "0.06em" },
};
