import { ResourceStatus } from '../types';
import { ClassificationResource } from './classification-resource.model';

/**
 * Recurso utilizable en las actividades del proyecto.
 *
 * Tipos via ClassificationResource:
 *   - LABOR: mano de obra (albañil, carpintero, electricista)
 *   - EQUIPMENT: maquinaria y herramienta (excavadora, andamio, grúa)
 *   - MATERIAL: insumos consumibles (cemento, varilla, pintura)
 *
 * El inventario solo aplica para recursos tipo MATERIAL.
 * Para LABOR y EQUIPMENT el inventario es irrelevante.
 */
export interface Resource {
  id: string;
  tenantId: string;

  identification: {
    sku: string;          // Código interno de control. Ej: 'MAT-CEM-001'
    name: string;
    description?: string;
  };

  classification: ClassificationResource;
  classificationId: string;

  costing: {
    unitCost: number;
    currency: string; // ISO 4217. Ej: 'MXN', 'USD', 'COP'
  };

  inventory?: {
    currentStock: number;  // Stock actual (solo MATERIAL)
    minimumStock?: number; // Alerta de reabastecimiento cuando currentStock < minimumStock
  };

  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}
