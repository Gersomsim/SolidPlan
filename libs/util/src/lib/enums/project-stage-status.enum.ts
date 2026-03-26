/**
 * Estado de una etapa dentro de un proyecto.
 *
 * El estado de la etapa activa puede influir en el estado general del proyecto.
 * Ej: si la etapa activa está EN_PROGRESO → el proyecto pasa a IN_PROGRESS.
 */
export const ProjectStageStatusEnum = {
  PENDING: 'PENDING',         // Etapa aún no iniciada
  IN_PROGRESS: 'IN_PROGRESS', // Etapa actualmente en ejecución
  COMPLETED: 'COMPLETED',     // Etapa finalizada
  SKIPPED: 'SKIPPED',         // Etapa omitida (cambio de alcance, etc.)
} as const;
