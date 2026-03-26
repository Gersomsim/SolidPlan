import { UserTenantRole } from '../types';

/**
 * Usuario del sistema.
 *
 * Un usuario pertenece a UN SOLO tenant (organización).
 *
 * Roles:
 *   - `tenantRole` controla lo que el usuario puede hacer en la organización
 *     (crear proyectos, invitar usuarios, etc.). Ver UserTenantRoleEnum.
 *   - Los roles por proyecto se gestionan en ProjectMember — un usuario puede
 *     tener distintos roles en distintos proyectos.
 *
 * Acceso a proyectos:
 *   El usuario solo puede ver los proyectos donde tiene asignación en ProjectMember,
 *   a menos que TenantConfig.autoAssignViewerOnProjectCreate esté activo.
 */
export interface User {
  id: string;
  tenantId: string; // Tenant al que pertenece. Un usuario → un solo tenant.

  auth: {
    email: string;
    passwordHash: string;
    mfaEnabled: boolean;
  };

  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    jobTitle: string; // Cargo en la empresa. Ej: 'Residente de Obra', 'Arquitecto'
  };

  tenantRole: UserTenantRole; // Rol a nivel de organización (TENANT_ADMIN | MEMBER)
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITE';

  createdAt: Date;
  updatedAt: Date;
}
