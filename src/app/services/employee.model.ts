// Application Shift model
export interface Shift {
  id: number;
  clockIn: string;
  clockOut: string;
}

// Application Employee model
export interface Employee {
  id: number;
  name: string;
  username: string;
  email: string;
  hourlyRate: number;
  overtimeRate: number;
  shifts: Shift[];
}
