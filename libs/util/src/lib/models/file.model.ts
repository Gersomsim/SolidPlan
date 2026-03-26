import { FileType } from '../types';

/**
 * Archivo almacenado en S3.
 *
 * Modelo centralizado para TODOS los archivos del sistema.
 * Independientemente de su tipo (foto, plano, documento, reporte),
 * todo archivo pasa por este modelo.
 *
 * Ventajas:
 *   - Un solo lugar para buscar, auditar y gestionar archivos.
 *   - Fácil integración con cualquier proveedor de storage (S3, GCS, Azure Blob).
 *   - Permite implementar políticas de retención, expiración y eliminación centralizadas.
 *
 * Asociación:
 *   `association.entityType` y `association.entityId` indican a qué entidad
 *   pertenece el archivo. Actualmente solo DAILY_LOG está implementado.
 *   A futuro: PROJECT (planos generales), ACTIVITY (evidencias por actividad), etc.
 *
 * Storage:
 *   La URL en `storage.url` puede ser una URL pública o un pre-signed URL de S3.
 *   La decisión de qué tipo de URL retornar se maneja en el servicio de archivos (apps/api).
 *   `storage.key` es el path completo en el bucket. Ej: 'tenants/{tenantId}/projects/{projectId}/photos/uuid.jpg'
 */
export interface File {
  id: string;
  tenantId: string;
  uploadedBy: string; // userId del usuario que subió el archivo

  storage: {
    bucket: string; // Nombre del bucket S3
    key: string;    // Path completo en el bucket
    url: string;    // URL de acceso (pública o pre-signed)
    region: string; // Región AWS. Ej: 'us-east-1', 'us-west-2'
  };

  metadata: {
    originalName: string; // Nombre original del archivo al subirse. Ej: 'foto_losa.jpg'
    mimeType: string;     // MIME type. Ej: 'image/jpeg', 'application/pdf'
    size: number;         // Tamaño en bytes
    extension: string;    // Extensión sin punto. Ej: 'jpg', 'pdf', 'dwg'
  };

  association: {
    entityType: 'DAILY_LOG' | 'PROJECT' | 'ACTIVITY'; // Entidad a la que pertenece
    entityId: string;                                  // ID de esa entidad
  };

  fileType: FileType; // PHOTO | DOCUMENT | PLAN | REPORT | OTHER

  createdAt: Date;
  updatedAt: Date;
}
