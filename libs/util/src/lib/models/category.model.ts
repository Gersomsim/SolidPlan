/**
 * Categoría de actividad de obra.
 *
 * Permite agrupar actividades por tipo de trabajo.
 * Ej: 'Albañilería', 'Instalaciones Eléctricas', 'Acabados', 'Estructura'.
 *
 * Las categorías son configurables por tenant.
 * Un administrador del tenant puede crear, editar y archivar categorías.
 */
export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isArchived: boolean; // Categorías archivadas no aparecen al crear actividades
  createdAt: Date;
  updatedAt: Date;
}
