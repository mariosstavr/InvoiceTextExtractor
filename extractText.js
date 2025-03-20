const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "ocruploader.html"));
});


const upload = multer({ dest: "uploads/" });

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

// Function to extract text from Image
async function extractTextFromImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, "eng+ell");
    return text;
}

// Extract VAT, Date, and Total Price
function extractInvoiceDetails(text) {
    const vatRegex = /\b\d{9}\b/g;
    const dateRegex = /\b\d{2}[-/]\d{2}[-/]\d{4}\b/g;
    const priceRegex = /(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})\s*€?/g;

    return {
        VAT: text.match(vatRegex)?.[0] || "Not found",
        Date: text.match(dateRegex)?.[0] || "Not found",
        TotalPrice: text.match(priceRegex)?.pop() || "Not found"
    };
}

// Upload and process file
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const extension = req.file.originalname.split(".").pop().toLowerCase();
    let extractedText = "";

    try {
        if (extension === "pdf") {
            extractedText = await extractTextFromPDF(filePath);
        } else if (["jpg", "jpeg", "png"].includes(extension)) {
            extractedText = await extractTextFromImage(filePath);
        } else {
            return res.status(400).json({ error: "Unsupported file type" });
        }

        const invoiceDetails = extractInvoiceDetails(extractedText);
        res.json({ extractedText, invoiceDetails });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        fs.unlinkSync(filePath); 
    }
});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
