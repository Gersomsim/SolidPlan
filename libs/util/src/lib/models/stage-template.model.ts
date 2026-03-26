/**
 * Plantilla de etapa — catálogo de etapas reutilizables a nivel tenant.
 *
 * El administrador del tenant crea y mantiene este catálogo.
 * Al configurar un proyecto, el usuario puede seleccionar etapas del catálogo
 * para crear ProjectStages, o crear etapas nuevas directamente en el proyecto.
 *
 * Ejemplos típicos para construcción:
 *   - Preliminares
 *   - Cimentación
 *   - Estructura
 *   - Albañilería
 *   - Instalaciones
 *   - Acabados
 *   - Entrega
 *
 * Las plantillas archivadas no aparecen al configurar nuevos proyectos,
 * pero las ProjectStages ya creadas desde esa plantilla no se afectan.
 */
export interface StageTemplate {
  id: string;
  tenantId: string;

  name: string;
  description?: string;
  color?: string; // Hex. Para diferenciación visual en Gantt y UI. Ej: '#F59E0B'

  isArchived: boolean;

  createdAt: Date;
  updatedAt: Date;
}
