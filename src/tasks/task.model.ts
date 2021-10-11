export enum TaskStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
