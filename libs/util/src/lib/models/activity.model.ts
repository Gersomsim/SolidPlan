import { ActivityStatus } from "../types";
import { ActivityDependency } from "../types/activity-dependency.type";
import { Category } from "./category.model";

export interface Activity {
  id: string;
  projectId: string;
  organizationId: string;
  parentActivityId?: string; // Para sub-tareas
  categoryId: string;
  roleId: string; // ID del rol asignado a la actividad
  userId?: string; // ID del usuario asignado a la actividad (opcional) si llega a existir mas de un usuario con el mismo rol

  info: {
    code: string; // Ej: 'ARQ-01'
    name: string;
    description?: string;
    category: Category; // Ej: 'Albañilería', 'Eléctrico'
  };

  measurement: {
    unit: string; // 'm2', 'm3', 'ton'
    plannedQuantity: number;
    actualQuantity: number;
    unitPrice?: number; // Costo por unidad de medida
  };

  scheduling: {
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    progress: number; // 0 to 100
    durationDays: number; // Calculado o manual
    isCriticalPath: boolean; // ¿Afecta la fecha final del proyecto?
  };

  status: ActivityStatus;
  dependencies: {
    targetActivityId: string;
    type: ActivityDependency;
    lagDays: number; // Días de retraso o adelanto
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}