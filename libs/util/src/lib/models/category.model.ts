export interface Category {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}