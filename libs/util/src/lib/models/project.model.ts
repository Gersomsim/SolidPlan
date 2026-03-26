import { ProjectStatus } from "../types";
import { Budget } from "../value-objects";

export interface Project {
  id: string; // UUID
  organizationId: string; // UUID Tenant ID
  code: string; // Código único de la obra
  // info general
  name: string; // Nombre de la obra
  description: string; // Detalle general del alcance
  address: {
    street: string;
    commune: string;
    city: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  }
  status: ProjectStatus;
  // Control Temporal y Financiero
  timeline: {
    estimatedStartDate: Date; // Fecha de inicio estimada
    estimatedEndDate: Date; // Fecha de fin estimada
    actualStartDate: Date | null; // Fecha de inicio real
    actualEndDate: Date | null; // Fecha de fin real
  }
  budget: Budget; // Presupuesto
  metadata: {
    totalArea: number; // Metros cuadrados de construcción (dato clave para métricas de costo/m2).
    tags: string[]; // Etiquetas personalizadas para clasificar el proyecto
  }
  // Stakeholders
  ownerId: string; // UUID del cliente/propietario
  managerId: string; // UUID del arquitecto
  teamId: string; // UUID del contratista
  createdAt: Date;
  updatedAt: Date;
}