/**
 * Acciones disponibles sobre un recurso del sistema.
 *
 * MANAGE = acceso total (CREATE + READ + UPDATE + DELETE + acciones admin).
 */
export const PermissionAction = {
  CREATE: 'CREATE',
  READ:   'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  MANAGE: 'MANAGE',
} as const;
