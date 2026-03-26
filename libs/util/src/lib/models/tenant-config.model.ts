/**
 * Configuración del tenant.
 *
 * Cada tenant tiene exactamente una fila de configuración (1:1 con Tenant).
 * El administrador del tenant puede ajustar estos parámetros desde
 * la sección de configuración de la organización.
 *
 * autoAssignViewerOnProjectCreate:
 *   Si es true, al crear un proyecto se agrega automáticamente a TODOS
 *   los usuarios del tenant con rol VIEWER en ese proyecto.
 *   Útil para organizaciones donde todos deben poder ver todos los proyectos.
 *   Por defecto: false (acceso solo por asignación explícita).
 */
export interface TenantConfig {
  id: string;
  tenantId: string; // 1:1 con Tenant

  projects: {
    autoAssignViewerOnProjectCreate: boolean; // Default: false
    requireApprovalForDailyLog: boolean;       // Si los logs deben ser aprobados por supervisor
    allowGuestAccess: boolean;                 // Acceso de lectura sin cuenta (futuro)
  };

  schedule: {
    defaultWorkingDays: number[]; // Días laborables. 0=Dom … 6=Sáb. Ej: [1,2,3,4,5]
    defaultWorkingHours: {
      start: string; // Formato HH:mm. Ej: '08:00'
      end: string;   // Formato HH:mm. Ej: '17:00'
    };
  };

  notifications: {
    emailOnDailyLog: boolean;           // Notificar cuando se crea una bitácora
    emailOnActivityDelay: boolean;      // Notificar cuando una actividad se retrasa
    emailOnProjectStatusChange: boolean; // Notificar cambios de estado del proyecto
  };

  createdAt: Date;
  updatedAt: Date;
}
