import { ProjectStageStatus } from '../types';

/**
 * Etapa de un proyecto específico.
 *
 * Las etapas son personalizadas por proyecto — no hay etapas globales predefinidas.
 * Pueden crearse desde el catálogo (StageTemplate) o desde cero.
 *
 * Orden:
 *   `order` determina la secuencia de ejecución. Comienza en 1.
 *   El administrador del proyecto puede reordenarlas mientras el proyecto
 *   esté en estado PLANNING.
 *
 * Relación con estado del proyecto:
 *   Cuando una etapa cambia a IN_PROGRESS, el proyecto puede cambiar a IN_PROGRESS.
 *   Cuando todas las etapas están COMPLETED, el proyecto puede marcarse COMPLETED.
 *   Esta lógica se implementa en el backend (apps/api).
 *
 * Actividades:
 *   Las Activity tienen un `stageId` opcional — permiten asociar actividades
 *   del cronograma a etapas específicas para mejor trazabilidad.
 */
export interface ProjectStage {
  id: string;
  tenantId: string;
  projectId: string;
  templateId?: string; // FK a StageTemplate si fue creada desde el catálogo

  info: {
    name: string;
    description?: string;
    color?: string; // Hex — para visualización en Gantt. Ej: '#2F855A'
  };

  order: number; // Posición en la secuencia del proyecto. Empieza en 1.
  status: ProjectStageStatus;

  dates: {
    plannedStartDate?: Date;
    plannedEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}
