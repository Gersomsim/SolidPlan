export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface StepItem {
  key:          string;
  label:        string;
  description?: string;
  status:       StepStatus;
}
