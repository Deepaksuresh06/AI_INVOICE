import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { Invoice } from "../models/invoiceJSONModel";
import { InvoiceSchema } from "../types/invoiceSchema";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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

async function repairFunction(brokenJson: string, validationError: unknown) {
  const result = await model.generateContent(`
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
  `);

    return cleanJsonResponse(
      result.response.text()
    );
}

async function validateWithRepair(text: string) {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const parsed = JSON.parse(text);

      const validation =
        InvoiceSchema.safeParse(parsed);

      if (validation.success) {
        return validation.data;
      }

      if (attempt === MAX_ATTEMPTS) {
        throw new Error(
          JSON.stringify(
            validation.error.format(),
            null,
            2
          )
        );
      }

      text = await repairFunction(
        text,
        validation.error.format()
      );
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) {
        throw error;
      }

      text = await repairFunction(
        text,
        error
      );
    }
  }

  throw new Error(
    "Unable to validate invoice"
  );
}

export const processInvoice = async (filePath: string, mimeType: string) => {
  const imageBase64 =
    fileToBase64(filePath);

  const result =
    await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },

      `
      You are an invoice data extraction system.

      Extract structured data from the invoice.

      Return ONLY valid JSON.

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
      }
      `,
    ]);

  let text = cleanJsonResponse(result.response.text());
  const invoiceData = await validateWithRepair(text);
  const savedInvoice = await Invoice.create(invoiceData);
  await fs.promises.unlink(filePath);


  return savedInvoice;
};