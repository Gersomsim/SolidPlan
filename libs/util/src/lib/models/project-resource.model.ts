import { ProjectResourceStatus } from '../types/project-resource-status.type';

/**
 * Asignación de un recurso del catálogo del tenant a un proyecto específico.
 *
 * Relación con Resource (tenant):
 *   - `resourceId` apunta al recurso del catálogo global.
 *   - Los datos descriptivos (SKU, nombre, clasificación, unidad) se leen
 *     desde Resource. ProjectResource NO duplica esa información.
 *   - `costingOverride` permite pactar un precio distinto para este proyecto
 *     sin modificar el precio base del catálogo.
 *
 * Lógica de inventario (solo tipo MATERIAL):
 *   - Cuando se pasa a ORDERED/IN_USE, se reserva `allocation.reservedQuantity`
 *     del stock del tenant (`Resource.inventory.currentStock`).
 *   - Al cerrar (COMPLETED), `allocation.usedQuantity` queda como el consumo
 *     real y se descuenta del stock del tenant.
 *   - La suma de `usedQuantity` de todos los ProjectResource de un mismo
 *     resourceId da el consumo total del tenant en todos sus proyectos.
 *
 * Contexto de asignación:
 *   - Puede vincularse a una etapa (`stageId`) o a una actividad específica
 *     (`activityId`) para trazabilidad granular. Ambos son opcionales —
 *     un recurso puede asignarse al proyecto en general.
 */
export interface ProjectResource {
  id: string;
  tenantId: string;
  projectId: string;
  resourceId: string;  // FK → Resource (catálogo del tenant)

  allocation: {
    plannedQuantity: number;   // Cantidad planificada/presupuestada para el proyecto
    usedQuantity: number;      // Cantidad realmente consumida/utilizada hasta ahora
    reservedQuantity: number;  // Separada del inventario del tenant; en camino o en obra
  };

  /**
   * Override de costo para este proyecto.
   * Si no se define, se usa Resource.costing como referencia.
   * Útil cuando el precio varía por contrato, proveedor o volumen.
   */
  costingOverride?: {
    unitCost: number;
    currency: string; // ISO 4217
  };

  // Contexto de asignación — ambos opcionales
  stageId?: string;     // FK → ProjectStage  (si el recurso es específico de una etapa)
  activityId?: string;  // FK → Activity       (si el recurso es específico de una actividad)

  notes?: string;

  status: ProjectResourceStatus;

  // Fechas operativas
  requestedAt?: Date;   // Fecha en que se emitió la solicitud al almacén/proveedor
  deliveredAt?: Date;   // Fecha en que llegó físicamente a la obra

  createdAt: Date;
  updatedAt: Date;
}
