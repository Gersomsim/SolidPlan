import { ProjectStatus } from '../types';
import { Budget } from '../value-objects';

/**
 * Proyecto de construcción.
 *
 * Un proyecto pertenece a un tenant y puede tener múltiples proyectos activos.
 *
 * Etapas y estados:
 *   Las etapas (ProjectStage) son configurables por proyecto y se ordenan.
 *   El estado del proyecto puede cambiar automáticamente según la etapa activa.
 *   `currentStageId` indica la etapa en ejecución actualmente.
 *
 * Stakeholders:
 *   ownerId, managerId y teamId son referencias a usuarios del tenant u
 *   entidades externas (clientes/contratistas). Se irán refinando conforme
 *   evolucione el modelo de contactos.
 */
export interface Project {
  id: string;       // UUID
  tenantId: string; // UUID — Tenant dueño del proyecto
  code: string;     // Código único de la obra dentro del tenant. Ej: 'OBR-2024-001'

  // Info general
  name: string;
  description: string;

  address: {
    street: string;
    commune: string;
    city: string;
    country: string;
    postalCode: string;
    latitude?: number;  // Para geolocalización en mapa
    longitude?: number;
  };

  status: ProjectStatus;
  currentStageId?: string; // FK a ProjectStage — etapa actualmente en ejecución

  // Control temporal y financiero
  timeline: {
    estimatedStartDate: Date;
    estimatedEndDate: Date;
    actualStartDate: Date | null;
    actualEndDate: Date | null;
  };

  budget: Budget;

  metadata: {
    totalArea: number; // m² de construcción — clave para métricas de costo/m²
    tags: string[];    // Etiquetas personalizadas para clasificar/filtrar proyectos
  };

  // Stakeholders
  ownerId: string;   // Cliente / propietario del proyecto
  managerId: string; // Arquitecto o director de proyecto
  teamId: string;    // Empresa contratista responsable de la ejecución

  createdAt: Date;
  updatedAt: Date;
}
