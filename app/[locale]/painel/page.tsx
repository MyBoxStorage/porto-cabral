import { redirect } from 'next/navigation'

// O painel agora vive em /painel (sem locale)
// Esta rota redireciona qualquer acesso com locale para a rota limpa
export default function PainelLocaleRedirect() {
  redirect('/painel')
}
