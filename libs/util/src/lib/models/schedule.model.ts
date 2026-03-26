import { ScheduleStatus } from '../types';

/**
 * Cronograma del proyecto.
 *
 * Un proyecto puede tener múltiples versiones del cronograma (versionado).
 * Solo un cronograma puede estar ACTIVE a la vez por proyecto.
 *
 * Las actividades del cronograma viven en el modelo Activity.
 * `activityIds` es la lista ordenada de actividades raíz que componen este cronograma.
 *
 * Flujo típico de vida:
 *   DRAFT → APPROVED → ACTIVE → (INACTIVE al crear nueva versión) → ARCHIVED
 */
export interface Schedule {
  id: string;
  tenantId: string;
  projectId: string;
  name: string; // Ej: 'Cronograma v1', 'Cronograma aprobado junio 2024'

  metadata: {
    version: number;         // Número de versión incremental por proyecto
    status: ScheduleStatus;
    approvedBy?: string;     // userId que aprobó el cronograma
    approvedAt?: Date;
  };

  dates: {
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
  };

  activityIds: string[]; // IDs de Activity — actividades raíz de este cronograma

  authorId: string; // userId que creó el cronograma
  createdAt: Date;
  updatedAt: Date;
}
