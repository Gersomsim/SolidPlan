/**
 * Estado personalizado de una actividad.
 *
 * Solo aplica cuando Activity.progressType = 'STATE'.
 *
 * Scope:
 *   - Tenant (projectId = null): estado reutilizable en cualquier proyecto del tenant.
 *     Lo gestiona el TENANT_ADMIN.
 *   - Proyecto (projectId definido): estado local solo para ese proyecto.
 *     Lo gestiona el ADMIN del proyecto.
 *
 * Ejemplos de estados para un flujo de aprobación de planos:
 *   order:1  PENDIENTE     (isDefault: true)
 *   order:2  EN_REVISIÓN
 *   order:3  OBSERVADO
 *   order:4  APROBADO      (isFinal: true)
 *
 * Ejemplos para actividad de ejecución simple:
 *   order:1  POR_INICIAR   (isDefault: true)
 *   order:2  EN_PROCESO
 *   order:3  TERMINADO     (isFinal: true)
 */
export interface ActivityState {
  id: string;
  tenantId: string;
  projectId?: string; // null = scope tenant (reutilizable); definido = scope proyecto (local)

  name: string;
  color: string;    // Hex — color del badge en la UI. Ej: '#F59E0B'
  order: number;    // Orden de visualización en selectores y flujos

  isFinal: boolean;   // true = marcar la actividad como completada al asignar este estado
  isDefault: boolean; // true = estado asignado automáticamente a actividades nuevas

  createdAt: Date;
  updatedAt: Date;
}
