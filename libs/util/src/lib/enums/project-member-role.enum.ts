/**
 * Roles a nivel de PROYECTO.
 *
 * Los roles no son globales; un usuario puede tener roles distintos
 * en distintos proyectos. La asignación se gestiona mediante ProjectMember.
 *
 * Jerarquía de acceso (de mayor a menor):
 *   ADMIN > SUPERVISOR > RESIDENT > VIEWER
 */
export const ProjectMemberRoleEnum = {
  /** Administrador del proyecto. Control total: editar, asignar, configurar etapas y actividades. */
  ADMIN: 'ADMIN',
  /** Supervisor de obra. Puede gestionar actividades, aprobar bitácoras y ver reportes. */
  SUPERVISOR: 'SUPERVISOR',
  /** Residente de obra. Crea bitácoras, registra avances y sube evidencias. */
  RESIDENT: 'RESIDENT',
  /** Solo lectura. Puede ver el estado del proyecto pero no modificar nada. */
  VIEWER: 'VIEWER',
} as const;
