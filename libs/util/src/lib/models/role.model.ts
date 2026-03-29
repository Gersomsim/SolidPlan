import { PermissionAction } from '../types/permission-action.type';
import { PermissionResource } from '../types/permission-resource.type';
import { RoleScope } from '../types/role-scope.type';

/**
 * Permiso granular: recurso + acción.
 */
export interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
}

/**
 * Rol del sistema (para control de permisos granular).
 *
 * Alcances:
 *   - SYSTEM: Roles de la plataforma SaaS. No pertenecen a ningún tenant.
 *     `tenantId` es null. Se implementan en fase posterior al MVP.
 *   - TENANT: Roles de organización (TENANT_ADMIN, MEMBER).
 *     `tenantId` obligatorio.
 *   - PROJECT: Roles de proyecto (ADMIN, SUPERVISOR, RESIDENT, VIEWER).
 *     `tenantId` obligatorio. La asignación usuario→proyecto se hace en ProjectMember.
 *
 * Los roles de proyecto predefinidos (ADMIN, SUPERVISOR, etc.) son
 * `isSystemDefault = true` y no pueden eliminarse.
 */
export interface Role {
  id: string;
  tenantId?: string; // null para scope SYSTEM; obligatorio para TENANT y PROJECT

  name: string;
  description?: string;
  scope: RoleScope;

  permissions: Permission[];

  isSystemDefault: boolean; // true = no puede eliminarse (ej: SuperAdmin, ADMIN de proyecto)
}
