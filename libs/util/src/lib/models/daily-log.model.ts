import { Weather } from '../types';

/**
 * Bitácora de obra (Daily Log).
 *
 * Registro de actividades, incidentes y avances en obra.
 * Puede haber múltiples registros por día y por proyecto — no hay límite.
 * Cualquier miembro asignado al proyecto puede crear una bitácora.
 *
 * Evidencias:
 *   `evidence.mediaIds` son IDs del modelo File. Los archivos se almacenan
 *   en S3 y se gestionan centralizadamente — ver File model.
 *
 * Bloqueo:
 *   `isLocked` evita ediciones una vez firmada o pasado el período de gracia.
 *   Un log bloqueado es legalmente válido para muchos clientes constructores.
 */
export interface DailyLog {
  id: string;
  tenantId: string;  // Tenant ID — aislamiento de datos
  projectId: string;
  activityIds?: string[]; // Actividades relacionadas (opcionales — un log puede ser general)
  authorId: string;  // Usuario que crea el registro (cualquier miembro del proyecto)

  reportDate: Date;  // Fecha a la que corresponde el registro (no necesariamente hoy)

  content: {
    title: string;
    description: string;   // Detalle de las actividades realizadas
    incidents?: string;    // Problemas: accidentes, retrasos de proveedores, huelgas
    observations?: string; // Notas para el día siguiente o recordatorios
  };

  metrics: {
    headcount: number;        // Personas trabajando ese día (cuadrillas)
    workingHours: number;     // Horas trabajadas en total
    machineryInUse: string[]; // Maquinaria pesada activa. Ej: 'Excavadora CAT 320'
  };

  evidence: {
    mediaIds: string[];   // IDs de File (fotos de obra subidas a S3)
    documentIds?: string[]; // IDs de File (documentos adjuntos)
  };

  environment: {
    weather: Weather;
    temperature?: number; // Celsius
  };

  isLocked: boolean; // true = no editable (firmado o período de gracia vencido)

  createdAt: Date;
  updatedAt: Date;
}
