/**
 * Alcance de un rol en el sistema.
 *
 * - SYSTEM: Roles de la plataforma SaaS (SuperAdmin, Support).
 *   No pertenecen a ningún tenant. Se implementan en fase posterior al MVP.
 *
 * - TENANT: Roles a nivel de organización (TENANT_ADMIN, MEMBER).
 *   Ver UserTenantRoleEnum.
 *
 * - PROJECT: Roles dentro de un proyecto específico (ADMIN, SUPERVISOR, RESIDENT, VIEWER).
 *   Ver ProjectMemberRoleEnum. Se asignan via ProjectMember.
 */
export const RoleScope = {
  SYSTEM: 'SYSTEM',
  TENANT: 'TENANT',
  PROJECT: 'PROJECT',
} as const;