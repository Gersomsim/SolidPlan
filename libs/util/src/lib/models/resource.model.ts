import { ResourceStatus } from "../types";
import { ClasificationResource } from "./clasification-resource.model";

export interface Resource {
  id: string;
  organizationId: string; // ID de la organización a la que pertenece el recurso 
  
  identification: {
    sku: string; // Código de control interno
    name: string;
    description?: string;
  };

  classification: ClasificationResource;
  clasificationId: string;

  costing: {
    unitCost: number;
    currency: string;
  };

  inventory?: {
    currentStock: number; // Solo relevante si es MATERIAL
    minimumStock?: number; // Para alertas de reabastecimiento
  };

  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}