export function formatMoney(
  value: number | null | undefined,
  currency: string | null | undefined
) {
  const amount =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : 0;

  const cur = currency ?? "INR";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${cur} ${amount}`;
  }
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  try {
    const d = new Date(value);

    if (Number.isNaN(d.getTime())) return value;

    return d.toLocaleDateString();
  } catch {
    return value;
  }
}

export function downloadText(
  filename: string,
  text: string,
  mime = "application/json"
) {
  const blob = new Blob([text], {
    type: mime,
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);
}

export function toCSV(rows: Record<string, any>[]) {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const escape = (v: any) => {
    const s =
      v === null || v === undefined
        ? ""
        : String(v);

    if (/[\n\r,\"]/g.test(s)) {
      return `"${s.replaceAll('"', '""')}"`;
    }

    return s;
  };

  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(
      headers.map((h) => escape(row[h])).join(",")
    );
  }

  return lines.join("\n");
}
