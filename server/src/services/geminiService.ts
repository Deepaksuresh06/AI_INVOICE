import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { Invoice } from "../models/invoiceJSONModel";
import { InvoiceSchema } from "../types/invoiceSchema";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const ai = new GoogleGenAI({
  apiKey,
});

function fileToBase64(path: string) {
  return fs.readFileSync(path, {
    encoding: "base64",
  });
}

function cleanJsonResponse(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

async function repairFunction(
  brokenJson: string,
  validationError: unknown
) {
  console.log("🔧 Repairing JSON...");

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a JSON repair system.

Fix the JSON below.

Validation Error:
${JSON.stringify(validationError, null, 2)}

JSON:
${brokenJson}

Rules:
- Return ONLY valid JSON
- Do not add explanations
- Preserve existing data
- Fix structure and types only
`,
  });

  return cleanJsonResponse(result.text ?? "");
}

async function validateWithRepair(text: string) {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const parsed = JSON.parse(text);

      const validation = InvoiceSchema.safeParse(parsed);

      if (validation.success) {
        return validation.data;
      }

      console.log(`❌ Validation failed (Attempt ${attempt})`);

      if (attempt === MAX_ATTEMPTS) {
        throw new Error(
          JSON.stringify(validation.error.format(), null, 2)
        );
      }

      text = await repairFunction(
        text,
        validation.error.format()
      );
    } catch (err) {
      console.log(`❌ JSON Parse failed (Attempt ${attempt})`);

      if (attempt === MAX_ATTEMPTS) {
        throw err;
      }

      text = await repairFunction(text, err);
    }
  }

  throw new Error("Unable to validate invoice");
}

export const processInvoice = async (
  filePath: string,
  mimeType: string
) => {
  try {
    console.log("📄 Reading invoice...");

    const imageBase64 = fileToBase64(filePath);

    console.log("🤖 Sending to Gemini...");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
        {
          text: `
            You are an invoice extraction system.
            Extract invoice information accurately.
            Return ONLY valid JSON.
            Rules:
            - subtotal must be a NUMBER (24000.50)
            - tax must be a NUMBER (4320)
            - total must be a NUMBER (28320)
            - Never return currency symbols.
            - Never return commas inside numbers.
            - Never return percentages.
            - Currency must be exactly one of:
              INR
              USD
              EUR
              GBP

            Date format:
            YYYY-MM-DD

            If a value is missing return null.

            No markdown.
            No explanation.
            Only JSON.

            {
              "invoice_number": string | null,
              "date": string | null,
              "supplier": string | null,
              "buyer": string | null,
              "items": [
                {
                  "name": string,
                  "quantity": number,
                  "price": number,
                  "total": number
                }
              ],
              "subtotal": number | null,
              "tax": number | null,
              "total": number | null,
              "currency": "INR" | "USD" | "EUR" | "GBP" | null
            }`,
        },
      ],
    });

    console.log("✅ Gemini Response Received");

    const text = cleanJsonResponse(result.text ?? "");

    console.log(text);

    const invoiceData = await validateWithRepair(text);

    console.log("✅ Validation Successful");

    const savedInvoice = await Invoice.create(invoiceData);

    console.log("✅ Saved to MongoDB");

    await fs.promises.unlink(filePath);

    console.log("🗑 Uploaded image deleted");

    return savedInvoice;
  } catch (error) {
    console.error("Gemini Service Error:", error);

    throw error;
  }
};