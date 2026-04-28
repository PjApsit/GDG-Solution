import base64
import csv
import io
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import date

MAX_TEXT_CHARS = 12000
MAX_TABLE_ROWS = 25
MAX_TABLES = 4

ISSUE_RULES = [
    ("Dengue Outbreak", 8, ["dengue", "fever", "mosquito", "platelet"]),
    ("Cholera Cases", 8, ["cholera", "diarrhea", "contaminated water", "vomiting"]),
    ("Disease Outbreak", 7, ["outbreak", "infection", "patients", "cases", "medical camp"]),
    ("Flood Displacement", 9, ["flood", "waterlogging", "relief camp", "displaced"]),
    ("Water Scarcity", 7, ["water scarcity", "drinking water", "tanker", "dry well"]),
    ("Food Shortage", 7, ["food shortage", "ration", "hunger", "meal"]),
    ("Shelter Need", 6, ["shelter", "tarpaulin", "blanket", "temporary camp"]),
    ("Landslide Risk", 8, ["landslide", "slope", "evacuation", "monsoon"]),
]

URGENCY_WORDS = [
    "urgent",
    "emergency",
    "critical",
    "immediate",
    "asap",
    "today",
    "shortage",
    "severe",
    "high risk",
]

KNOWN_LOCATIONS = [
    "Dharavi, Mumbai",
    "Mumbai",
    "Sundarbans, West Bengal",
    "Sundarbans",
    "Wayanad, Kerala",
    "Wayanad",
    "Patna, Bihar",
    "Patna",
    "Thar Desert, Rajasthan",
    "Rajasthan",
    "Kolkata",
    "Delhi",
    "Bengaluru",
    "Chennai",
    "Pune",
    "Hyderabad",
]


def decode_bytes(data):
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def normalize_space(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def trim_text(text, limit=MAX_TEXT_CHARS):
    text = normalize_space(text)
    if len(text) <= limit:
        return text
    return text[:limit].rstrip() + "..."


def format_table(title, columns, rows):
    clean_columns = [normalize_space(col) or f"Column {idx + 1}" for idx, col in enumerate(columns)]
    clean_rows = []
    for row in rows[:MAX_TABLE_ROWS]:
        clean_rows.append({
            clean_columns[idx]: normalize_space(row[idx]) if idx < len(row) else ""
            for idx in range(len(clean_columns))
        })
    return {
        "title": title,
        "columns": clean_columns,
        "rows": clean_rows,
        "rowCount": len(rows),
    }


def has_header(row):
    if not row:
        return False
    text_cells = sum(1 for cell in row if re.search(r"[A-Za-z]", normalize_space(cell)))
    return text_cells >= max(1, len(row) // 2)


def extract_affected_count(text):
    matches = []
    number_then_label = re.compile(
        r"(\d{1,3}(?:,\d{3})+|\d+)\s*(people|persons|families|patients|cases|affected|residents|children)",
        re.IGNORECASE,
    )
    label_then_number = re.compile(
        r"(people|persons|families|patients|cases|affected|residents|children)\D{0,30}(\d{1,3}(?:,\d{3})+|\d+)",
        re.IGNORECASE,
    )

    for number, label in number_then_label.findall(text):
        value = int(number.replace(",", ""))
        multiplier = 5 if label.lower() == "families" else 1
        matches.append(value * multiplier)

    for label, number in label_then_number.findall(text):
        value = int(number.replace(",", ""))
        multiplier = 5 if label.lower() == "families" else 1
        matches.append(value * multiplier)

    return max(matches) if matches else 0


def detect_location(text):
    lowered = text.lower()
    for location in KNOWN_LOCATIONS:
        if location.lower() in lowered:
            return location

    location_match = re.search(
        r"(?:location|area|village|city|district)\s*[:\-]\s*([A-Z][A-Za-z .'-]+(?:,\s*[A-Z][A-Za-z .'-]+)?)",
        text,
    )
    if location_match:
        return normalize_space(location_match.group(1))[:80]

    return "Unknown"


def analyze_text(text, source):
    lowered = text.lower()
    issue_hits = []
    for problem_type, severity, keywords in ISSUE_RULES:
        score = sum(lowered.count(keyword) for keyword in keywords)
        if score:
            issue_hits.append((score, problem_type, severity))

    issue_hits.sort(reverse=True)
    problem_type = issue_hits[0][1] if issue_hits else None
    severity = issue_hits[0][2] if issue_hits else 4
    urgency_count = sum(lowered.count(word) for word in URGENCY_WORDS)
    urgency = min(10, 4 + urgency_count + (2 if issue_hits else 0))
    affected_count = extract_affected_count(text)
    location = detect_location(text)

    insights = []
    if problem_type:
        insights.append(f"{problem_type} indicators were detected.")
    if affected_count:
        insights.append(f"{affected_count:,} affected people/cases were mentioned.")
    if urgency_count:
        insights.append("Urgent response language appears in the source data.")
    if location != "Unknown":
        insights.append(f"Location signal found: {location}.")

    suggested_event = None
    if problem_type or affected_count or urgency_count:
        suggested_event = {
            "location": location,
            "problem_type": problem_type or "Community Support Need",
            "severity": severity,
            "urgency": urgency,
            "affected_count": affected_count,
            "date_recorded": date.today().isoformat(),
            "data_age_days": 0,
            "source": source,
            "accessibility": 5,
        }

    return insights, suggested_event


def summarize_keywords(text):
    words = re.findall(r"[A-Za-z][A-Za-z-]{2,}", text.lower())
    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "from",
        "this",
        "that",
        "are",
        "was",
        "were",
        "have",
        "has",
        "will",
        "not",
        "you",
        "our",
        "your",
    }
    counts = Counter(word for word in words if word not in stop_words)
    return [word for word, _count in counts.most_common(6)]


def parse_csv(data):
    text = decode_bytes(data)
    sample = text[:4096]
    dialect = csv.excel
    try:
        dialect = csv.Sniffer().sniff(sample)
    except csv.Error:
        pass

    rows = [
        [normalize_space(cell) for cell in row]
        for row in csv.reader(io.StringIO(text), dialect)
        if any(normalize_space(cell) for cell in row)
    ]
    if not rows:
        return "CSV file did not contain readable rows.", [], "", []

    max_cols = max(len(row) for row in rows)
    padded_rows = [row + [""] * (max_cols - len(row)) for row in rows]
    if has_header(padded_rows[0]):
        columns = padded_rows[0]
        data_rows = padded_rows[1:]
    else:
        columns = [f"Column {idx + 1}" for idx in range(max_cols)]
        data_rows = padded_rows

    table = format_table("CSV table", columns, data_rows)
    text_blob = " ".join(columns) + " " + " ".join(" ".join(row) for row in padded_rows[:200])
    summary = f"CSV table extracted with {len(data_rows)} rows and {len(columns)} columns."
    return summary, [table], text_blob, []


def column_index(cell_ref):
    letters = re.sub(r"[^A-Z]", "", cell_ref.upper())
    value = 0
    for letter in letters:
        value = value * 26 + (ord(letter) - ord("A") + 1)
    return max(0, value - 1)


def read_shared_strings(zip_file):
    if "xl/sharedStrings.xml" not in zip_file.namelist():
        return []

    root = ET.fromstring(zip_file.read("xl/sharedStrings.xml"))
    namespace = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    strings = []
    for item in root.findall("a:si", namespace):
        texts = [node.text or "" for node in item.findall(".//a:t", namespace)]
        strings.append("".join(texts))
    return strings


def get_xlsx_cell_value(cell, shared_strings):
    cell_type = cell.attrib.get("t")
    namespace = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

    if cell_type == "inlineStr":
        texts = [node.text or "" for node in cell.findall(".//a:t", namespace)]
        return normalize_space("".join(texts))

    value_node = cell.find("a:v", namespace)
    if value_node is None or value_node.text is None:
        return ""

    raw_value = value_node.text
    if cell_type == "s":
        try:
            return normalize_space(shared_strings[int(raw_value)])
        except (ValueError, IndexError):
            return ""

    return normalize_space(raw_value)


def parse_xlsx(data):
    tables = []
    warnings = []
    text_parts = []

    with zipfile.ZipFile(io.BytesIO(data)) as workbook:
        shared_strings = read_shared_strings(workbook)
        worksheet_files = sorted(
            name for name in workbook.namelist()
            if name.startswith("xl/worksheets/sheet") and name.endswith(".xml")
        )

        for sheet_index, sheet_file in enumerate(worksheet_files[:MAX_TABLES], start=1):
            root = ET.fromstring(workbook.read(sheet_file))
            namespace = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
            rows = []

            for row_node in root.findall(".//a:sheetData/a:row", namespace):
                row_values = []
                for cell in row_node.findall("a:c", namespace):
                    idx = column_index(cell.attrib.get("r", "A1"))
                    while len(row_values) <= idx:
                        row_values.append("")
                    row_values[idx] = get_xlsx_cell_value(cell, shared_strings)
                if any(row_values):
                    rows.append(row_values)

            if not rows:
                continue

            max_cols = max(len(row) for row in rows)
            padded_rows = [row + [""] * (max_cols - len(row)) for row in rows]
            if has_header(padded_rows[0]):
                columns = padded_rows[0]
                data_rows = padded_rows[1:]
            else:
                columns = [f"Column {idx + 1}" for idx in range(max_cols)]
                data_rows = padded_rows

            tables.append(format_table(f"Sheet {sheet_index}", columns, data_rows))
            text_parts.append(" ".join(columns))
            text_parts.extend(" ".join(row) for row in padded_rows[:100])

    if not tables:
        warnings.append("Workbook did not contain readable worksheet rows.")

    summary = f"Excel workbook extracted with {len(tables)} readable sheet table(s)."
    return summary, tables, " ".join(text_parts), warnings


def unescape_pdf_text(value):
    value = re.sub(r"\\([nrtbf()\\])", lambda match: {
        "n": "\n",
        "r": "\r",
        "t": "\t",
        "b": "\b",
        "f": "\f",
        "(": "(",
        ")": ")",
        "\\": "\\",
    }.get(match.group(1), match.group(1)), value)
    value = re.sub(
        r"\\([0-7]{1,3})",
        lambda match: chr(int(match.group(1), 8)),
        value,
    )
    return value


def infer_tables_from_text(text):
    tables = []
    candidate_rows = []

    for line in text.splitlines():
        line = normalize_space(line)
        if not line:
            continue

        if "|" in line:
            parts = [part.strip() for part in line.split("|") if part.strip()]
        elif "\t" in line:
            parts = [part.strip() for part in line.split("\t") if part.strip()]
        else:
            parts = [part.strip() for part in re.split(r"\s{2,}", line) if part.strip()]

        if len(parts) >= 2:
            candidate_rows.append(parts)

    if len(candidate_rows) >= 2:
        max_cols = max(len(row) for row in candidate_rows)
        rows = [row + [""] * (max_cols - len(row)) for row in candidate_rows]
        columns = rows[0] if has_header(rows[0]) else [f"Column {idx + 1}" for idx in range(max_cols)]
        data_rows = rows[1:] if has_header(rows[0]) else rows
        tables.append(format_table("Detected text table", columns, data_rows))

    return tables


def configure_tesseract(pytesseract):
    candidates = [
        os.environ.get("TESSERACT_CMD"),
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    ]
    for candidate in candidates:
        if candidate and os.path.exists(candidate):
            pytesseract.pytesseract.tesseract_cmd = candidate
            return candidate
    return None


def ocr_pdf_pages(data, max_pages=3):
    try:
        import pypdfium2 as pdfium
        import pytesseract

        configure_tesseract(pytesseract)
        pdf = pdfium.PdfDocument(data)
        texts = []
        for index in range(min(len(pdf), max_pages)):
            page = pdf[index]
            image = page.render(scale=2).to_pil()
            texts.append(pytesseract.image_to_string(image))
            page.close()
        pdf.close()
        return "\n".join(texts), None
    except Exception as error:
        return "", str(error)


def parse_pdf(data):
    warnings = []
    tables = []
    text_parts = []

    try:
        import pdfplumber

        with pdfplumber.open(io.BytesIO(data)) as pdf:
            for page in pdf.pages[:10]:
                page_text = page.extract_text() or ""
                text_parts.append(page_text)
                for table in page.extract_tables() or []:
                    rows = [[normalize_space(cell) for cell in row] for row in table if row]
                    if len(rows) >= 2 and len(tables) < MAX_TABLES:
                        columns = rows[0] if has_header(rows[0]) else [f"Column {idx + 1}" for idx in range(len(rows[0]))]
                        data_rows = rows[1:] if has_header(rows[0]) else rows
                        tables.append(format_table("PDF table", columns, data_rows))
    except Exception:
        try:
            from PyPDF2 import PdfReader

            reader = PdfReader(io.BytesIO(data))
            text_parts = [(page.extract_text() or "") for page in reader.pages[:10]]
        except Exception:
            raw = data.decode("latin-1", errors="ignore")
            literal_strings = re.findall(r"\((?:\\.|[^\\)])*\)\s*Tj", raw)
            array_strings = re.findall(r"\[((?:\s*\((?:\\.|[^\\)])*\)\s*)+)\]\s*TJ", raw)
            values = []
            for item in literal_strings:
                values.append(unescape_pdf_text(item[1:item.rfind(")")]))
            for array in array_strings:
                values.extend(unescape_pdf_text(match) for match in re.findall(r"\((?:\\.|[^\\)])*\)", array))
            text_parts = values
            warnings.append("PDF fallback extraction used. Install pdfplumber or PyPDF2 for stronger PDF parsing.")

    text = "\n".join(text_parts)
    if not tables:
        tables = infer_tables_from_text(text)[:MAX_TABLES]

    if not normalize_space(text):
        ocr_text, ocr_error = ocr_pdf_pages(data)
        if normalize_space(ocr_text):
            text = ocr_text
            warnings.append("PDF text was extracted with OCR from rendered pages.")
        else:
            detail = f" OCR error: {ocr_error}" if ocr_error else ""
            warnings.append(f"No readable PDF text was found. Scanned PDFs need OCR.{detail}")

    summary = f"PDF processed with {len(tables)} table candidate(s) found."
    return summary, tables, text, warnings


def parse_whatsapp_text(data):
    text = decode_bytes(data)
    messages = []
    current = None
    pattern = re.compile(
        r"^\[?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\]?\s*(?:-|–)\s*([^:]+):\s*(.*)$"
    )

    for line in text.splitlines():
        match = pattern.match(line.strip())
        if match:
            if current:
                messages.append(current)
            current = {
                "date": match.group(1),
                "time": match.group(2),
                "sender": normalize_space(match.group(3)),
                "message": normalize_space(match.group(4)),
            }
        elif current:
            current["message"] = normalize_space(current["message"] + " " + line)

    if current:
        messages.append(current)

    if messages:
        participant_counts = Counter(message["sender"] for message in messages)
        rows = [[item["date"], item["time"], item["sender"], item["message"]] for item in messages]
        tables = [format_table("WhatsApp messages", ["Date", "Time", "Sender", "Message"], rows)]
        participants = ", ".join(name for name, _count in participant_counts.most_common(4))
        summary = f"WhatsApp export parsed with {len(messages)} messages from {len(participant_counts)} participant(s): {participants}."
        text_blob = " ".join(message["message"] for message in messages)
        return summary, tables, text_blob, []

    summary = "Text file processed as plain text."
    return summary, [], text, ["WhatsApp message pattern was not detected; treated as plain text."]


def parse_image(data):
    warnings = []
    text = ""
    tables = []
    summary = "Image received."

    try:
        from PIL import Image

        image = Image.open(io.BytesIO(data))
        summary = f"Image received: {image.format or 'unknown'} format, {image.width}x{image.height}px."
        try:
            import pytesseract

            configure_tesseract(pytesseract)
            text = pytesseract.image_to_string(image)
            if normalize_space(text):
                summary += " OCR text was extracted."
            else:
                warnings.append("OCR ran but no readable text was found.")
        except Exception:
            warnings.append("OCR is not configured. Install Tesseract and pytesseract to extract text from images.")
    except Exception:
        warnings.append("Image metadata could not be read.")

    return summary, tables, text, warnings


def process_file(file_payload):
    name = file_payload.get("originalName") or "uploaded-file"
    mime_type = file_payload.get("mimeType") or "application/octet-stream"
    size_bytes = file_payload.get("sizeBytes") or 0
    ext = os.path.splitext(name)[1].lower()
    data = base64.b64decode(file_payload.get("contentBase64") or "")

    result = {
        "fileName": name,
        "fileType": ext.replace(".", "") or "unknown",
        "mimeType": mime_type,
        "sizeBytes": size_bytes,
        "status": "success",
        "summary": "",
        "tables": [],
        "extractedTextPreview": "",
        "keywords": [],
        "insights": [],
        "warnings": [],
        "suggestedEvent": None,
    }

    try:
        if ext == ".csv":
            summary, tables, text, warnings = parse_csv(data)
            source = "csv"
        elif ext == ".xlsx":
            summary, tables, text, warnings = parse_xlsx(data)
            source = "excel"
        elif ext == ".xls":
            summary, tables, text, warnings = (
                "Legacy .xls files need xlrd; upload .xlsx for built-in extraction.",
                [],
                "",
                ["Unsupported legacy Excel format."],
            )
            source = "excel"
        elif ext == ".pdf":
            summary, tables, text, warnings = parse_pdf(data)
            source = "pdf"
        elif ext == ".txt":
            summary, tables, text, warnings = parse_whatsapp_text(data)
            source = "whatsapp"
        elif ext in {".png", ".jpg", ".jpeg", ".webp"}:
            summary, tables, text, warnings = parse_image(data)
            source = "image"
        else:
            summary, tables, text, warnings = ("Unsupported file type.", [], "", ["Unsupported file type."])
            source = "upload"

        insights, suggested_event = analyze_text(text, source)
        result.update({
            "summary": summary,
            "tables": tables[:MAX_TABLES],
            "extractedTextPreview": trim_text(text, 2000),
            "keywords": summarize_keywords(text),
            "insights": insights,
            "warnings": warnings,
            "suggestedEvent": suggested_event,
        })
    except Exception as error:
        result["status"] = "failed"
        result["summary"] = "File could not be processed."
        result["warnings"] = [str(error)]

    return result


def main():
    payload = json.loads(sys.stdin.read() or "{}")
    files = [process_file(file_payload) for file_payload in payload.get("files", [])]
    json.dump({"files": files}, sys.stdout)


if __name__ == "__main__":
    main()
