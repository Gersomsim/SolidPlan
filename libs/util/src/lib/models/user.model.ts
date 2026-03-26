export interface User {
  id: string;
  organizationId: string; // Tenant al que pertenece
  
  auth: {
    email: string;
    passwordHash: string;
    mfaEnabled: boolean;
  };

  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    jobTitle: string; // Ej: 'Residente de Obra'
  };

  roleId: string; // FK al modelo Role
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITE';
  
  createdAt: Date;
  updatedAt: Date;
}