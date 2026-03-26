import { Weather } from '../types';

export interface DailyLog {
  id: string; // UUID
  projectId: string; // ID del proyecto al que pertenece.
  organizationId: string; // Tenant ID (para asegurar el aislamiento de datos).
  authorId: string; // ID del usuario que crea el reporte (usualmente el Residente de Obra o Supervisor).
  //Cuerpo del Reporte
  reportDate: Date; // Fecha del reporte
  content: {
    title: string
    description: string //Detalle de las actividades realizadas.
    incidents?: string //Campo específico para problemas (accidentes, retrasos de proveedores, huelgas).
    observations?: string //Notas adicionales o recordatorios para el día siguiente.
  }
  metrics: {
    headcount: number //Cuántas personas trabajaron ese día (cuadrillas).
    workingHours: number //Horas trabajadas ese día.
    machineryInUse: string[] //Lista de maquinaria pesada activa (ej: "Excavadora CAT 320").
  }
  evidence: {
    photos: string[]; //Lista de referencias (IDs) a fotos tomadas en el sitio. Sin fotos, una bitácora de obra no tiene validez para muchos clientes.
    documents?: string[]; //Lista de referencias (IDs) a documentos tomados en el sitio.
  };

  environment: {
    weather: Weather;
    temperature?: number; // Celsius
  };
  isLocked: boolean; // Una vez firmado o pasado cierto tiempo, no debería editarse
  createdAt: Date;
  updatedAt: Date;
}