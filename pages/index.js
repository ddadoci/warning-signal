import { useState, useRef, useCallback, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function App() {
  const [phase, setPhase] = useState("input");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // { id, label }
  const [uploadedImages, setUploadedImages] = useState([]); // { name, data, mimeType }
  const [showFloatScore, setShowFloatScore] = useState(false);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);
  const textareaRef = useRef();
  const fileInputRef = useRef();
  const heroRef = useRef();
  const checklistRef = useRef();

  const loadMessages = [
    "당신의 번아웃 신호 체계를 분석 중입니다.",
    "입력한 데이터들은 저장/보관되지 않습니다.",
    "몇 초 뒤면 당신의 삶을 바꿀 신호체계가 완성됩니다.",
  ];

  useEffect(() => {
    setIsKakaoInApp(/KAKAOTALK/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setLoadMsgIdx((i) => (i + 1) % loadMessages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "result") { setShowFloatScore(false); return; }
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setShowFloatScore(rect.bottom < 56);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach((file) => {
      const name = file.name.toLowerCase();

      // 이미지 (PNG, JPG)
      if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
        const id = Date.now() + Math.random();
        setUploadedFiles((f) => [...f, { id, label: file.name }]);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result.split(",")[1];
          const mimeType = name.endsWith(".png") ? "image/png" : "image/jpeg";
          setUploadedImages((prev) => [...prev, { name: file.name, data: base64, mimeType }]);
        };
        reader.readAsDataURL(file);
        return;
      }

      // 텍스트 파일 (TXT, MD)
      if (file.type === "text/plain" || name.endsWith(".txt") || name.endsWith(".md")) {
        const id = Date.now() + Math.random();
        const reader = new FileReader();
        reader.onload = (e) => {
          setInputText((prev) => prev + `\n\n[${file.name}]\n${e.target.result}`);
          setUploadedFiles((f) => [...f, { id, label: file.name }]);
        };
        reader.readAsText(file);
        return;
      }

      // 문서/엑셀/PDF
      if (name.endsWith(".docx") || name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".pdf")) {
        const id = Date.now() + Math.random();
        setUploadedFiles((f) => [...f, { id, label: `${file.name} (처리 중...)` }]);
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target.result.split(",")[1];
          try {
            const res = await fetch("/api/parse", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileName: file.name, fileBase64: base64 }),
            });
            const data = await res.json();
            if (data.text) {
              setInputText((prev) => prev + `\n\n[${file.name}]\n${data.text}`);
              setUploadedFiles((f) => f.map((item) => item.id === id ? { id, label: file.name } : item));
            } else {
              setUploadedFiles((f) => f.map((item) => item.id === id ? { id, label: `${file.name} (파싱 실패)` } : item));
            }
          } catch {
            setUploadedFiles((f) => f.map((item) => item.id === id ? { id, label: `${file.name} (오류)` } : item));
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      // 지원하지 않는 형식
      const id = Date.now() + Math.random();
      setUploadedFiles((f) => [...f, { id, label: `${file.name} (지원하지 않는 형식)` }]);
    });
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const generate = async () => {
    if (!inputText.trim() && uploadedImages.length === 0) return;
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputText,
          images: uploadedImages.length > 0 ? uploadedImages : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "분석 중 오류가 발생했습니다.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      fullText += decoder.decode(); // flush buffered bytes

      let parsed;
      try {
        parsed = JSON.parse(fullText.trim());
      } catch (e) {
        throw new Error(`파싱 오류: ${e.message} | 응답: ${fullText.slice(0, 120)}`);
      }
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
      <Head><title>분석 중 — checkmywarning</title></Head>
      <style>{globalStyle}</style>
      <div style={css.loadPage}>
        <div style={css.loadInner}>
          <div style={css.spinner} />
          <p style={css.loadText} key={loadMsgIdx}>{loadMessages[loadMsgIdx]}</p>
        </div>
      </div>
    </>
  );

  if (phase === "result" && result) {
    const s1c = result.stage1?.filter((_, i) => checked[`s1-${i}`]).length || 0;
    const s2c = result.stage2?.filter((_, i) => checked[`s2-${i}`]).length || 0;
    const s3c = result.stage3?.filter((_, i) => checked[`s3-${i}`]).length || 0;
    const total = s1c + s2c * 2 + s3c * 3;
    const statusColor = s3c >= 2 ? "#FF4444" : s3c >= 1 || s2c >= 3 ? "#FF8C42" : total >= 3 ? "#FFD700" : "#44FF88";
    const statusLabel = s3c >= 2 ? "즉각 멈춰야 함" : s3c >= 1 || s2c >= 3 ? "구조 점검 필요" : total >= 3 ? "초기 경보" : "안정";

    const handleDownload = async () => {
      if (!checklistRef.current) return;
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(checklistRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "warning-signal-checklist.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    return (
      <>
        <Head><title>나만의 위기 신호 — 결과</title></Head>
        <style>{globalStyle}</style>
        {showFloatScore && (
          <div style={css.floatScore}>
            <div style={css.floatScoreInner}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ ...css.floatScoreNum, color: statusColor }}>{total}</span>
                <span style={{ ...css.floatScoreLabel, color: statusColor }}>{statusLabel}</span>
              </div>
              <button onClick={() => setChecked({})} style={css.resetBtn}>RESET</button>
            </div>
          </div>
        )}
        <div style={css.resultPage}>
          <Nav />
          <div style={css.resultWrap}>
            <div ref={heroRef} style={css.resultHero}>
              <div style={css.resultHeroTag}>PERSONAL WARNING SIGNAL SYSTEM</div>
              <div style={css.resultHeroTitle}>{result.identity}</div>
              <div style={css.resultHeroScore}>
                <span style={{ ...css.scoreNum, color: statusColor }}>{total}</span>
                <span style={{ ...css.scoreLabel, color: statusColor }}>{statusLabel}</span>
              </div>
              <div style={css.scoreMeterWrap}>
                <div style={css.scoreMeter}>
                  <div style={{ ...css.scoreMeterFill, width: `${Math.min(total / 20 * 100, 100)}%`, background: statusColor }} />
                </div>
                <button onClick={() => setChecked({})} style={css.resetBtn}>RESET</button>
              </div>
            </div>

            <div style={css.block}>
              <div style={css.blockLabel}>// 확인된 강점</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.strengths?.map((str, i) => (
                  <div key={i} style={css.strengthCard}>
                    <div style={css.strengthName}>{str.label}</div>
                    <div style={css.strengthBasis}>{str.basis}</div>
                  </div>
                ))}
              </div>
            </div>

            <div ref={checklistRef} style={{ background: "#0a0a0a" }}>
              <div style={{ padding: "16px 0 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#777", letterSpacing: "0.12em" }}>// 위기 신호 체크리스트</span>
                <button onClick={handleDownload} style={css.downloadBtn}>↓ 이미지 저장</button>
              </div>
              <SignalBlock id="s1" tag="STAGE 01" label="초기 경보" accent="#FFD700"
                items={result.stage1} checked={checked} onToggle={toggleCheck} />
              <SignalBlock id="s2" tag="STAGE 02" label="구조 점검 필요" accent="#FF8C42"
                items={result.stage2} checked={checked} onToggle={toggleCheck} />
              <SignalBlock id="s3" tag="STAGE 03" label="즉각 멈춰야 함" accent="#FF4444"
                items={result.stage3} checked={checked} onToggle={toggleCheck} />
            </div>

            <div style={css.block}>
              <div style={css.blockLabel}>// 정기 점검 질문</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {result.weeklyQ?.map((q, i) => (
                  <div key={i} style={css.qRow}>
                    <span style={css.qTag}>WEEKLY {i + 1}</span>
                    <span style={css.qText}>{q}</span>
                  </div>
                ))}
                <div style={{ ...css.qRow, borderTop: "1px solid #333", marginTop: 4, paddingTop: 16 }}>
                  <span style={{ ...css.qTag, color: "#fff" }}>MONTHLY</span>
                  <span style={{ ...css.qText, color: "#fff", fontWeight: 600 }}>{result.monthlyQ}</span>
                </div>
              </div>
            </div>

            <div style={css.block}>
              <div style={css.blockLabel}>// 위기 유형</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={css.crisisCard}>
                  <div style={css.crisisTag}>A TYPE · 과열형</div>
                  <div style={css.crisisText}>{result.crisisA}</div>
                </div>
                <div style={{ ...css.crisisCard, borderColor: "#7B5EA744" }}>
                  <div style={{ ...css.crisisTag, color: "#A084DC" }}>B TYPE · 공허형</div>
                  <div style={css.crisisText}>{result.crisisB}</div>
                </div>
              </div>
            </div>

            {result.dataGaps?.length > 0 && (
              <div style={{ ...css.block, borderColor: "#1a1a1a" }}>
                <div style={css.blockLabel}>// 정확도를 높이려면</div>
                {result.dataGaps.map((g, i) => (
                  <div key={i} style={{ display: "flex", padding: "5px 0" }}>
                    <span style={{ color: "#777", marginRight: 10, fontFamily: "monospace" }}>+</span>
                    <span style={{ color: "#aaa", fontSize: 13 }}>{g}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Share block */}
            <div style={css.shareBlock}>
              <div style={css.blockLabel}>// 공유하기</div>
              <p style={css.shareDesc}>내 위기 신호 체계가 생겼다면, 주변에도 알려보세요.</p>
              <div style={css.shareRow}>
                <button onClick={() => {
                  const text = `나만의 위기 신호 체크리스트를 만들었어요.\n\n${result.identity}\n\ncheckmywarning.com`;
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                  window.open(url, "_blank");
                }} style={css.shareBtn}>
                  𝕏 트위터/X
                </button>
                <button onClick={() => {
                  const text = `나만의 위기 신호 체크리스트를 만들었어요.\n\n${result.identity}\n\ncheckmywarning.com`;
                  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://checkmywarning.com")}&quote=${encodeURIComponent(text)}`;
                  window.open(url, "_blank");
                }} style={css.shareBtn}>
                  f 페이스북
                </button>
                <button onClick={() => {
                  const text = `나만의 위기 신호 체크리스트를 만들었어요.\n\n"${result.identity}"\n\ncheckmywarning.com에서 직접 만들어보세요.`;
                  navigator.clipboard.writeText(text).then(() => alert("복사됐어요! 어디든 붙여넣기하세요."));
                }} style={css.shareBtn}>
                  ⎘ 텍스트 복사
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText("https://checkmywarning.com").then(() => alert("링크가 복사됐어요!"));
                }} style={{ ...css.shareBtn, color: "#fff", borderColor: "#333" }}>
                  🔗 링크 복사
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
              <button onClick={() => { setPhase("input"); setResult(null); setChecked({}); }} style={css.ctaBtnWhite}>처음으로</button>
              <button onClick={() => { setPhase("input"); setResult(null); setChecked({}); }} style={css.ctaBtnBlack}>정보 추가하고 재분석 →</button>
            </div>

            <Footer />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>checkmywarning — 당신이 무너지기 전에 신호가 온다</title>
        <meta name="description" content="자신에 대한 정보를 입력하면 AI가 당신 전용 위기 신호 자기점검 체계를 만들어드립니다." />
        <meta property="og:title" content="당신이 무너지기 전에 신호가 온다. 당신만 모를 뿐." />
        <meta property="og:description" content="checkmywarning — 나만의 위기 신호 체크리스트" />
      </Head>
      <style>{globalStyle}</style>
      <div style={css.inputPage}>
        <Nav />

        <div style={css.hero}>
          <div style={css.heroEyebrow}>WARNING SIGNAL GENERATOR</div>
          <h1 style={css.heroTitle}>
            당신이 무너지기 전에<br />
            <span style={css.heroAccent}>신호가 온다.</span>
          </h1>
          <p style={css.heroSub}>당신만 모를 뿐.</p>
          <div style={css.heroDivider} />
          <p style={css.heroDesc}>
            자신에 대해 아는 것을 입력하면 — AI가 당신 전용 위기 신호 체계를 만듭니다.<br />
            번아웃이 오기 전에, 스스로 먼저 알아채세요.
          </p>
        </div>

        <div style={css.inputSection}>
          <div style={css.inputLabel}>// 자신에 대해 아는 것을 입력하세요</div>
          <div
            style={{ ...css.dropZone, borderColor: dragOver ? "#fff" : "#222" }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"검사 결과, 주변의 말, 스스로 관찰한 패턴, 반복되는 어려움\n사주나 별자리 정보까지 — 형식 없이, 아는 만큼만."}
              style={css.textarea}
            />
            {uploadedFiles.length > 0 && (
              <div style={css.fileList}>
                {uploadedFiles.map((f) => <div key={f.id} style={css.fileItem}>📎 {f.label}</div>)}
              </div>
            )}
            <div style={css.dropHint}>
              {isKakaoInApp ? (
                <span style={{ color: "#666" }}>카카오 인앱 브라우저는 파일 업로드를 지원하지 않습니다. 텍스트를 직접 붙여넣어 주세요.</span>
              ) : (
                <>
                  txt, md, pdf, docx, xlsx, png, jpg 드래그 또는{" "}
                  <label style={css.uploadLink}>
                    클릭해서 업로드
                    <input ref={fileInputRef} type="file"
                      accept="text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,image/*,.txt,.md,.pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                      multiple
                      style={{ position: "fixed", top: "-200vh", opacity: 0, pointerEvents: "none" }}
                      onChange={(e) => handleFiles(e.target.files)} />
                  </label>
                </>
              )}
            </div>
          </div>

          <div style={css.chipRow}>
            {["MBTI / DISC", "TCI / NEO-PI", "에니어그램", "CliftonStrengths", "사주 만세력", "별자리", "주변 묘사", "번아웃 경험", "자기 관찰"].map(t => (
              <div key={t} style={css.chip}>{t}</div>
            ))}
          </div>

          {error && <div style={css.errorMsg}>{error}</div>}

          <button
            onClick={generate}
            disabled={!inputText.trim() && uploadedImages.length === 0}
            style={{ ...css.generateBtn, opacity: (inputText.trim() || uploadedImages.length > 0) ? 1 : 0.3, cursor: (inputText.trim() || uploadedImages.length > 0) ? "pointer" : "not-allowed" }}
          >
            위기 신호 체크리스트 생성 →
          </button>
          <p style={css.noteText}>입력 내용은 저장되지 않음 · 분석 30초 내외</p>
        </div>

        <div style={css.manifesto}>
          <div style={css.manifestoLine}>"번아웃은 갑자기 오지 않는다."</div>
          <div style={css.manifestoLine}>"항상 신호가 먼저 온다."</div>
          <div style={css.manifestoLine}>"문제는 그 신호가 사람마다 다르다는 것."</div>
          <div style={css.manifestoLineAccent}>"당신의 신호를 당신이 먼저 알아야 한다."</div>
        </div>

        <Footer />
      </div>
    </>
  );
}

function Nav() {
  return (
    <nav style={navCss.nav}>
      <Link href="/" style={navCss.logo}>checkmywarning</Link>
      <div style={navCss.links}>
        <Link href="/blog/what-is-warning-signal" style={navCss.link}>아티클</Link>
        <Link href="/about" style={navCss.link}>소개</Link>
        <Link href="/" style={navCss.cta}>체크리스트 만들기</Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={footerCss.footer}>
      <div style={footerCss.left}>
        <span style={footerCss.logo}>checkmywarning</span>
        <span style={footerCss.copy}>© 2025 by 따도씨</span>
      </div>
      <div style={footerCss.right}>
        <a href="mailto:ddadoci@gmail.com" style={footerCss.link}>ddadoci@gmail.com</a>
        <a href="https://instagram.com/dododokang" target="_blank" rel="noopener noreferrer" style={footerCss.link}>@dododokang</a>
        <Link href="/privacy" style={footerCss.link}>개인정보처리방침</Link>
      </div>
    </footer>
  );
}

function SignalBlock({ id, tag, label, accent, items, checked, onToggle }) {
  if (!items?.length) return null;
  return (
    <div style={{ ...css.block, borderColor: accent + "33", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: accent, letterSpacing: "0.14em", border: `1px solid ${accent}44`, padding: "3px 10px", borderRadius: 2 }}>{tag}</span>
        <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item, i) => {
          const key = `${id}-${i}`;
          const on = !!checked[key];
          return (
            <div key={key} onClick={() => onToggle(key)}
              style={{ display: "flex", gap: 14, padding: "12px 16px", borderRadius: 3, border: `1px solid ${on ? accent + "44" : "#1a1a1a"}`, cursor: "pointer", background: on ? "#111" : "transparent", transition: "all 0.1s", userSelect: "none", alignItems: "flex-start" }}>
              <div style={{ width: 14, height: 14, borderRadius: 2, border: `1px solid ${on ? accent : "#333"}`, background: on ? accent : "transparent", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.1s" }}>
                {on && <svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2 4-4" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div>
                <div style={{ fontSize: 13, color: on ? "#555" : "#bbb", lineHeight: 1.6, transition: "color 0.1s" }}>{item.signal}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#777", marginTop: 3, lineHeight: 1.4 }}>{item.basis}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Noto+Serif+KR:wght@300;400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0a0a0a; }
  a { text-decoration: none; color: inherit; }
  a:hover { opacity: 0.7; }
  button:hover { opacity: 0.8; }
  textarea::placeholder { color: #444; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeMsg { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

const navCss = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 100 },
  logo: { fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "0.04em" },
  links: { display: "flex", alignItems: "center", gap: 28 },
  link: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", letterSpacing: "0.06em" },
  cta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#000", background: "#fff", padding: "6px 14px", borderRadius: 2, letterSpacing: "0.04em" },
};

const footerCss = {
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, padding: "28px 32px", borderTop: "1px solid #1a1a1a", marginTop: 80 },
  left: { display: "flex", flexDirection: "column", gap: 4 },
  logo: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#fff", letterSpacing: "0.06em" },
  copy: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333" },
  right: { display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" },
  link: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333", letterSpacing: "0.04em" },
};

const css = {
  inputPage: { minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Noto Serif KR', Georgia, serif" },
  hero: { padding: "80px 32px 64px", maxWidth: 760, margin: "0 auto", animation: "fadeUp 0.6s ease both" },
  heroEyebrow: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", letterSpacing: "0.2em", marginBottom: 32 },
  heroTitle: { fontSize: "clamp(38px, 5.5vw, 68px)", fontWeight: 700, lineHeight: 1.35, color: "#fff", marginBottom: 20, fontFamily: "'Noto Serif KR', Georgia, serif", letterSpacing: "-0.01em", wordBreak: "keep-all" },
  heroAccent: { color: "#fff", borderBottom: "3px solid #fff", paddingBottom: 2 },
  heroSub: { fontSize: "clamp(20px, 2.8vw, 28px)", color: "#bbb", fontStyle: "italic", marginBottom: 40, fontFamily: "'DM Serif Display', Georgia, serif" },
  heroDivider: { width: 40, height: 1, background: "#2a2a2a", marginBottom: 28 },
  heroDesc: { fontSize: 15, lineHeight: 2.1, color: "#888", maxWidth: 520 },
  inputSection: { maxWidth: 680, margin: "0 auto", padding: "0 32px 40px" },
  inputLabel: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em", marginBottom: 16 },
  dropZone: { border: "1px solid", borderRadius: 4, overflow: "hidden", transition: "border-color 0.15s", background: "#0d0d0d" },
  textarea: { width: "100%", minHeight: 200, background: "transparent", border: "none", outline: "none", padding: "20px 22px 12px", fontSize: 13, color: "#bbb", lineHeight: 1.8, resize: "vertical", fontFamily: "'Noto Serif KR', Georgia, serif", boxSizing: "border-box" },
  fileList: { padding: "0 22px 8px", display: "flex", flexDirection: "column", gap: 4 },
  fileItem: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444" },
  dropHint: { padding: "10px 22px 14px", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", letterSpacing: "0.06em", borderTop: "1px solid #1a1a1a" },
  uploadLink: { color: "#888", textDecoration: "underline", cursor: "pointer" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 6, margin: "16px 0" },
  chip: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", border: "1px solid #2a2a2a", borderRadius: 2, padding: "4px 10px", letterSpacing: "0.06em" },
  errorMsg: { background: "#110a0a", border: "1px solid #FF444433", borderRadius: 4, padding: "10px 14px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#FF4444", marginBottom: 12 },
  generateBtn: { width: "100%", background: "#fff", color: "#000", border: "none", borderRadius: 2, padding: "16px", fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.06em", transition: "opacity 0.15s" },
  noteText: { textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#444", marginTop: 12, letterSpacing: "0.06em" },
  manifesto: { maxWidth: 680, margin: "0 auto", padding: "64px 32px", borderTop: "1px solid #1a1a1a", display: "flex", flexDirection: "column", gap: 8 },
  manifestoLine: { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: "#444", lineHeight: 1.6 },
  manifestoLineAccent: { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: "#fff", lineHeight: 1.6, marginTop: 12 },
  loadPage: { minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" },
  loadInner: { textAlign: "center", width: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 },
  spinner: { width: 36, height: 36, border: "1px solid #333", borderTop: "1px solid #888", borderRadius: "50%", animation: "spin 0.9s linear infinite", flexShrink: 0 },
  loadText: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#888", letterSpacing: "0.08em", lineHeight: 1.7, animation: "fadeMsg 0.4s ease both", wordBreak: "keep-all" },
  resultPage: { minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Noto Serif KR', Georgia, serif" },
  resultWrap: { maxWidth: 680, margin: "0 auto", padding: "0 32px 40px" },
  resultHero: { padding: "48px 0 40px", borderBottom: "1px solid #1a1a1a", marginBottom: 32 },
  resultHeroTag: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#777", letterSpacing: "0.16em", marginBottom: 16 },
  resultHeroTitle: { fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 28 },
  resultHeroScore: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 },
  scoreNum: { fontFamily: "'DM Mono', monospace", fontSize: 56, fontWeight: 500, lineHeight: 1 },
  scoreLabel: { fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em" },
  scoreMeterWrap: { display: "flex", alignItems: "center", gap: 16 },
  scoreMeter: { flex: 1, height: 1, background: "#1a1a1a", overflow: "hidden" },
  scoreMeterFill: { height: "100%", transition: "width 0.5s ease" },
  resetBtn: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#777", background: "none", border: "1px solid #333", borderRadius: 2, padding: "4px 10px", cursor: "pointer", letterSpacing: "0.1em", flexShrink: 0 },
  block: { border: "1px solid #1a1a1a", borderRadius: 4, padding: "24px", marginBottom: 16 },
  blockLabel: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#777", letterSpacing: "0.12em", marginBottom: 16 },
  strengthCard: { background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "12px 16px" },
  strengthName: { fontSize: 13, fontWeight: 600, color: "#ccc", marginBottom: 4 },
  strengthBasis: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#777", lineHeight: 1.5 },
  qRow: { display: "flex", gap: 16, padding: "11px 0", borderBottom: "1px solid #1a1a1a", alignItems: "flex-start" },
  qTag: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#777", flexShrink: 0, width: 64, letterSpacing: "0.08em", paddingTop: 2 },
  qText: { fontSize: 13, color: "#aaa", lineHeight: 1.7 },
  crisisCard: { flex: 1, minWidth: 200, background: "#0d0d0d", border: "1px solid #FF8C4233", borderRadius: 3, padding: "16px" },
  crisisTag: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#FF8C42", letterSpacing: "0.12em", marginBottom: 8 },
  crisisText: { fontSize: 12, color: "#aaa", lineHeight: 1.7 },
  ctaBtnWhite: { flex: 1, background: "transparent", color: "#888", border: "1px solid #333", borderRadius: 2, padding: "13px", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", letterSpacing: "0.06em" },
  ctaBtnBlack: { flex: 2, background: "#fff", color: "#000", border: "none", borderRadius: 2, padding: "13px", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", fontWeight: 500, letterSpacing: "0.04em" },
  shareBlock: { border: "1px solid #1a1a1a", borderRadius: 4, padding: "24px", marginBottom: 16 },
  shareDesc: { fontSize: 13, color: "#888", marginBottom: 20, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" },
  shareRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  shareBtn: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#999", background: "transparent", border: "1px solid #333", borderRadius: 2, padding: "8px 14px", cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.1s" },
  downloadBtn: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#888", background: "transparent", border: "1px solid #333", borderRadius: 2, padding: "5px 12px", cursor: "pointer", letterSpacing: "0.08em" },
  floatScore: { position: "fixed", top: 57, left: 0, right: 0, zIndex: 150, background: "#0a0a0aee", backdropFilter: "blur(8px)", borderBottom: "1px solid #1a1a1a" },
  floatScoreInner: { maxWidth: 680, margin: "0 auto", padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  floatScoreNum: { fontFamily: "'DM Mono', monospace", fontSize: 40, fontWeight: 500, lineHeight: 1 },
  floatScoreLabel: { fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em" },
};
