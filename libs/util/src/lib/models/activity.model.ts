import { ActivityProgressType, ActivityStatus } from '../types';
import { ActivityDependency } from '../types/activity-dependency.type';
import { Category } from './category.model';

/**
 * Actividad del cronograma de un proyecto.
 *
 * Las actividades forman un árbol recursivo mediante `parentActivityId`.
 * No hay límite de niveles de profundidad — una actividad puede tener
 * sub-actividades, y estas a su vez más sub-actividades.
 *
 * Asignación:
 *   La actividad se asigna a un ROL del proyecto (roleId), no a un usuario
 *   directamente. La resolución usuario → rol se hace via ProjectMember.
 *   `resolvedUserId` es el userId resultante en el momento de la asignación.
 *
 * Progreso:
 *   Se configura al crear la actividad (progressType) y no debe cambiarse
 *   después para preservar el historial:
 *   - PERCENTAGE: campo `progress` (0–100)
 *   - STATE: campo `progressStateId` → FK a ActivityState
 */
export interface Activity {
  id: string;
  tenantId: string;
  projectId: string;
  stageId?: string;            // Etapa del proyecto a la que pertenece (opcional)
  parentActivityId?: string;   // FK a Activity padre — null si es raíz del árbol
  categoryId: string;

  // Asignación por rol
  assignedRoleId: string;      // Rol del proyecto responsable de esta actividad
  resolvedUserId?: string;     // Usuario resuelto desde el rol al momento de asignar

  info: {
    code: string;              // Código de referencia. Ej: 'ARQ-01', 'EST-03'
    name: string;
    description?: string;
    category: Category;        // Categoría de trabajo. Ej: 'Albañilería', 'Eléctrico'
  };

  measurement: {
    unit: string;              // Unidad de medida: 'm2', 'm3', 'ton', 'ml'
    plannedQuantity: number;   // Cantidad planificada
    actualQuantity: number;    // Cantidad ejecutada al momento
    unitPrice?: number;        // Costo por unidad (para cálculo de presupuesto ejecutado)
  };

  scheduling: {
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    durationDays: number;      // Calculado (endDate - startDate) o ingresado manualmente
    isCriticalPath: boolean;   // Si esta actividad afecta la fecha de término del proyecto
  };

  // Progreso — configurado al crear la actividad
  progressType: ActivityProgressType; // 'PERCENTAGE' | 'STATE'
  progress: number;                   // 0–100. Usado cuando progressType = PERCENTAGE
  progressStateId?: string;           // FK a ActivityState. Usado cuando progressType = STATE

  status: ActivityStatus;

  dependencies: {
    targetActivityId: string;
    type: ActivityDependency;  // FS | SS | FF | SF
    lagDays: number;           // Días de adelanto (negativo) o retraso (positivo)
  }[];

  createdAt: Date;
  updatedAt: Date;
}
