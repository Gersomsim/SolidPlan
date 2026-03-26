import { ProjectMemberRole } from '../types';

/**
 * Miembro de un proyecto — asignación Usuario↔Proyecto con rol.
 *
 * Es la entidad central del control de acceso a proyectos.
 * Un usuario solo puede ver y actuar en proyectos donde tiene
 * al menos un registro en esta tabla.
 *
 * Un usuario puede tener distintos roles en distintos proyectos:
 *   - SUPERVISOR en Proyecto A
 *   - VIEWER en Proyecto B
 *
 * Auto-asignación:
 *   Si TenantConfig.autoAssignViewerOnProjectCreate = true, al crear
 *   un proyecto se insertan automáticamente registros con rol VIEWER
 *   para todos los usuarios activos del tenant.
 *
 * Ver ProjectMemberRoleEnum para la jerarquía de permisos.
 */
export interface ProjectMember {
  id: string;
  tenantId: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole; // ADMIN | SUPERVISOR | RESIDENT | VIEWER

  assignedAt: Date;    // Fecha de asignación
  assignedBy: string;  // userId del usuario que realizó la asignación

  createdAt: Date;
  updatedAt: Date;
}
