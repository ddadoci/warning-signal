import mammoth from "mammoth";
import * as XLSX from "xlsx";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { fileName, fileBase64 } = req.body;
  if (!fileBase64 || !fileName) return res.status(400).json({ error: "파일 없음" });

  const buffer = Buffer.from(fileBase64, "base64");
  const name = fileName.toLowerCase();

  try {
    let text = "";

    if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheets = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        return `[시트: ${sheetName}]\n${XLSX.utils.sheet_to_csv(sheet)}`;
      });
      text = sheets.join("\n\n");
    } else if (name.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      return res.status(400).json({ error: "지원하지 않는 파일 형식" });
    }

    const trimmed = text.length > 3000 ? text.slice(0, 3000) + "\n...(이하 생략)" : text;
    res.status(200).json({ text: trimmed });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "파일 파싱 중 오류가 발생했습니다." });
  }
}
