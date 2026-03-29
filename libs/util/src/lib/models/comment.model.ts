/**
 * Comentario en una actividad del proyecto.
 *
 * Los comentarios son notas informales —retroalimentación, observaciones de campo,
 * preguntas— que construyen un timeline narrativo en la actividad sin contaminar
 * el DailyLog, que es el registro oficial estructurado.
 *
 * Por ahora solo se asocian a actividades, pero el modelo puede extenderse a otros
 * objetos añadiendo más campos entityType/entityId si fuera necesario.
 */
export interface Comment {
  id: string;
  activityId: string;
  tenantId: string;
  projectId: string;

  author: {
    userId: string;
    name: string;
    avatarBg?: string; // Color de fondo del avatar generado
  };

  content: string;

  createdAt: Date;
  updatedAt: Date;
}
