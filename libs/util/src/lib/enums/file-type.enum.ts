/**
 * Tipo de archivo subido al sistema.
 *
 * Se usa para categorizar los archivos almacenados en S3 y
 * permitir filtrado/visualización diferenciada en la UI.
 *
 * Extensible: a medida que el sistema crezca se pueden agregar
 * nuevos tipos sin romper los registros existentes.
 */
export const FileTypeEnum = {
  PHOTO: 'PHOTO',         // Foto de la obra (evidencia de avance)
  DOCUMENT: 'DOCUMENT',   // Documento general (actas, contratos, etc.)
  PLAN: 'PLAN',           // Plano arquitectónico o estructural
  REPORT: 'REPORT',       // Reporte generado (PDF de bitácora, etc.)
  OTHER: 'OTHER',         // Cualquier otro tipo no categorizado
} as const;
