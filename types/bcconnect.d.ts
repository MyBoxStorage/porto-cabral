/**
 * Declaração de tipos para o BC Connect Widget
 *
 * O widget é carregado via script externo (https://bc-connect-api-v2.fly.dev/widget.js)
 * e expõe a API global `window.BCConnect` após inicialização.
 *
 * USO (após parceria ativa e data-auto="false"):
 *   if (typeof window !== 'undefined' && window.BCConnect) {
 *     window.BCConnect.show()
 *   }
 *
 * Exemplo no formulário de reserva (ReservationForm.tsx), após submit bem-sucedido:
 *   window.BCConnect?.show()
 */

interface Window {
  BCConnect?: {
    /** Exibe o modal de captura de leads */
    show: () => void
    /** Configurações ativas do widget (readonly) */
    config: Record<string, string>
  }
}
