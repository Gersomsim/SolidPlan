import { RoleScope } from "../types";

export interface Role {
  id: string;
  organizationId?: string; // Null si es SYSTEM, Obligatorio si es TENANT
  
  name: string;
  scope: RoleScope; 
  
  permissions: {
    resource: string; // 'BILLING', 'USERS', 'PROJECTS', 'SYSTEM_CONFIG'
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
  }[];

  isSystemDefault: boolean; // Roles que no se pueden borrar (ej: 'SuperAdmin')
}