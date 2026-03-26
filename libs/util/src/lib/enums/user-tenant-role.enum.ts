/**
 * Rol del usuario a nivel de TENANT (organización).
 *
 * Controla qué puede hacer el usuario dentro de la organización
 * independientemente de los proyectos a los que esté asignado.
 *
 * No confundir con ProjectMemberRoleEnum, que aplica por proyecto.
 *
 * Nota: Los roles de administración del SaaS (SuperAdmin, Support, etc.)
 * se definirán en una fase posterior al MVP y vivirán en un scope separado.
 */
export const UserTenantRoleEnum = {
  /** Administrador del tenant. Puede crear proyectos, invitar usuarios y configurar la organización. */
  TENANT_ADMIN: 'TENANT_ADMIN',
  /** Miembro regular. Solo puede acceder a los proyectos donde tiene asignación explícita. */
  MEMBER: 'MEMBER',
} as const;
