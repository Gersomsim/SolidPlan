import { ClasificationType } from "../types";

export interface ClasificationResource {
    id: string;
    organizationId: string;
    type: ClasificationType;
    name: string; 
    unitOfMeasure: string; // 'm3', 'hrs', 'unit', 'kg'
}