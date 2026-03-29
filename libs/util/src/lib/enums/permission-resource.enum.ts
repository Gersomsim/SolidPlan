/**
 * Recursos del sistema sobre los que se pueden definir permisos.
 *
 * Usado en el modelo Role para construir la matriz de permisos granular.
 */
export const PermissionResource = {
  PROJECTS:         'PROJECTS',
  DAILY_LOGS:       'DAILY_LOGS',
  SCHEDULE:         'SCHEDULE',
  MEMBERS:          'MEMBERS',
  ROLES:            'ROLES',
  STAGE_TEMPLATES:  'STAGE_TEMPLATES',
  CATEGORIES:       'CATEGORIES',
  ACTIVITY_STATES:  'ACTIVITY_STATES',
  RESOURCES:        'RESOURCES',
  SYSTEM_CONFIG:    'SYSTEM_CONFIG',
  BILLING:          'BILLING',
  REPORTS:          'REPORTS',
} as const;
