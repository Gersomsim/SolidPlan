import { RoleScope } from '../types';

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
  scope: RoleScope;

  permissions: {
    resource: string; // 'BILLING' | 'USERS' | 'PROJECTS' | 'DAILY_LOGS' | 'SCHEDULE' | 'REPORTS' | 'SYSTEM_CONFIG'
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
  }[];

  isSystemDefault: boolean; // true = no puede eliminarse (ej: SuperAdmin, ADMIN de proyecto)
}
