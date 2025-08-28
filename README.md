A web-based application that extracts text and key invoice details (VAT, date, total price) from PDF and image files using OCR. Built with Node.js, Express, Multer, PDF-Parse, and Tesseract.js.

Features
Upload PDF or image invoices (JPG, JPEG, PNG).
Automatically extract invoice text using OCR.
Detect key invoice fields:
VAT number
Invoice date
Total price
Returns extracted text and parsed invoice details in JSON format.

Supports multiple languages in OCR (English + Greek).

Tech Stack
Backend: Node.js, Express
File Uploads: Multer
PDF Parsing: pdf-parse
OCR: Tesseract.js

Frontend: Static HTML/CSS/JS served from Express
CORS: Enabled for cross-origin requests
