export const ScheduleStatusEnum = {
  DRAFT: 'DRAFT',       // Borrador — aún en edición, no publicado
  APPROVED: 'APPROVED', // Aprobado por el responsable del proyecto
  ACTIVE: 'ACTIVE',     // Vigente y en ejecución
  INACTIVE: 'INACTIVE', // Suspendido temporalmente
  ARCHIVED: 'ARCHIVED', // Histórico, ya no se usa activamente
} as const;
