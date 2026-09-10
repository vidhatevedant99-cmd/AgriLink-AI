export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatWeight(quantity: number, unit: string = "kg"): string {
  if (unit.toLowerCase() === "quintal") {
    return `${quantity.toLocaleString("en-IN")} qtl (${(quantity * 100).toLocaleString("en-IN")} kg)`;
  }
  return `${quantity.toLocaleString("en-IN")} ${unit}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Today";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}
