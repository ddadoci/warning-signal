import pdf from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { filename, mimetype, base64data } = req.body;
  if (!base64data || !filename) return res.status(400).json({ error: "파일 데이터 없음" });

  const buffer = Buffer.from(base64data, "base64");

  try {
    let text = "";

    if (mimetype === "application/pdf" || filename.toLowerCase().endsWith(".pdf")) {
      const data = await pdf(buffer);
      text = data.text;
    } else if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword" ||
      filename.toLowerCase().endsWith(".docx") ||
      filename.toLowerCase().endsWith(".doc")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (
      mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimetype === "application/vnd.ms-excel" ||
      filename.toLowerCase().endsWith(".xlsx") ||
      filename.toLowerCase().endsWith(".xls")
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetTexts = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        return `[시트: ${name}]\n${XLSX.utils.sheet_to_csv(sheet)}`;
      });
      text = sheetTexts.join("\n\n");
    } else {
      return res.status(400).json({ error: "지원하지 않는 파일 형식" });
    }

    res.status(200).json({ text: text.trim() });
  } catch (e) {
    console.error("파일 파싱 오류:", e);
    res.status(500).json({ error: "파일 텍스트 추출 실패" });
  }
}
