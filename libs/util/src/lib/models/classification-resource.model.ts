import { ClassificationType } from '../types';

/**
 * Clasificación de un recurso.
 *
 * Define el tipo general del recurso y la unidad de medida base.
 * Se usa para agrupar recursos en reportes y para aplicar
 * lógica diferenciada (ej: inventario solo para MATERIAL).
 *
 * Tipos:
 *   - LABOR: mano de obra — unidad típica: 'hrs', 'jornada'
 *   - EQUIPMENT: maquinaria/herramienta — unidad típica: 'hrs', 'día', 'mes'
 *   - MATERIAL: insumo consumible — unidad típica: 'm3', 'kg', 'pza', 'lt'
 */
export interface ClassificationResource {
  id: string;
  tenantId: string;
  type: ClassificationType;
  name: string;
  unitOfMeasure: string; // Unidad base. Ej: 'm3', 'hrs', 'pza', 'kg'
}
