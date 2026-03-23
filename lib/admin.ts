// lib/admin.ts
// Fonte única de verdade para verificação de acesso admin.
// Usa a env ADMIN_EMAILS (lista separada por vírgula, case-insensitive).

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.trim().toLowerCase())
}
