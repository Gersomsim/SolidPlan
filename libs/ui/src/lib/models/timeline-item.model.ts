export type TimelineStatus = 'pending' | 'active' | 'completed' | 'error';

export interface TimelineItem {
  id:           string;
  label:        string;
  description?: string;
  date?:        Date | string;
  icon?:        string;
  status:       TimelineStatus;
  color?:       string;
}
