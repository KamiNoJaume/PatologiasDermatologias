export interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

export function evaluatePasswordStrength(password: string): StrengthResult {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Debil", color: "bg-red-500" };
  if (score === 2) return { score, label: "Aceptable", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Buena", color: "bg-yellow-500" };
  return { score, label: "Fuerte", color: "bg-green-500" };
}
