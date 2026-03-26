/**
 * Tenant — Organización/empresa constructora.
 *
 * Es la entidad raíz del sistema multitenant.
 * Todo dato de negocio (proyectos, usuarios, actividades, etc.)
 * pertenece a un tenant y se filtra por `tenantId`.
 *
 * Aislamiento de datos:
 *   MVP: row-level — una sola BD, todas las entidades filtran por `tenantId`.
 *   Futuro: schema-based — un schema/BD por tenant para mayor aislamiento.
 *   El diseño actual permite esta migración sin cambios en los modelos de dominio.
 *
 * Subscription:
 *   Controla el plan de facturación. Se expande en fases posteriores al MVP.
 */
export interface Tenant {
  id: string;

  info: {
    name: string;    // Nombre de la empresa. Ej: 'Constructora Pérez S.A.'
    slug: string;    // Identificador URL-friendly único. Ej: 'constructora-perez'
    logoUrl?: string;
    industry: string; // Por ahora siempre 'CONSTRUCTION', extensible a futuro
  };

  subscription: {
    plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
    status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
    trialEndsAt?: Date; // Solo para planes de prueba
  };

  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

  createdAt: Date;
  updatedAt: Date;
}
