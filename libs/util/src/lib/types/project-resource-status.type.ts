/**
 * Estado de un recurso dentro del contexto de un proyecto específico.
 *
 * Flujo típico:
 *   PLANNED → ORDERED → IN_USE → COMPLETED
 *                  ↘ CANCELLED (en cualquier punto)
 */
export type ProjectResourceStatus =
  | 'PLANNED'    // En el plan de obra; aún no solicitado al almacén
  | 'ORDERED'    // Solicitud enviada; pendiente de entrega en obra
  | 'IN_USE'     // Recibido y activo en el proyecto
  | 'COMPLETED'  // Uso terminado; cantidad final registrada
  | 'CANCELLED'  // Cancelado antes de usarse
