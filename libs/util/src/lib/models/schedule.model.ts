import { ScheduleStatus } from "../types";

export interface Schedule {
 id: string;
 projectId: string;
 organizationId: string;
 name: string;
 //metadatos
 metadata: {
  version: number;
  status: ScheduleStatus;
 }
 //fechas
 dates: {
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
 }
 //actividades
 activities: string[];
 authorId: string;
 createdAt: Date;
 updatedAt: Date;
} 