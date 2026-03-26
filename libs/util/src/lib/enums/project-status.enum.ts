/**
 * Estado general de un proyecto de construcción.
 *
 * DELAYED y HALTED son distintos:
 * - DELAYED: el proyecto sigue activo pero va atrasado respecto al cronograma.
 * - HALTED: el proyecto está detenido (falta de materiales, permiso, etc.).
 */
export const ProjectStatusEnum = {
  PLANNING: 'PLANNING',       // En fase de planificación, aún no inicia obra
  IN_PROGRESS: 'IN_PROGRESS', // Obra en ejecución dentro del cronograma
  DELAYED: 'DELAYED',         // Obra activa pero con atraso respecto al plan
  HALTED: 'HALTED',           // Obra detenida temporalmente
  COMPLETED: 'COMPLETED',     // Obra terminada y entregada
  ARCHIVED: 'ARCHIVED',       // Proyecto archivado (histórico)
} as const;