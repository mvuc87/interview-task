import { Injectable, NgZone } from '@angular/core';
import { Observable, combineLatest, map, shareReplay, tap } from 'rxjs';
import { Employee } from './employee.model';

const ipcRenderer = window.require('electron').ipcRenderer;

// Database Employee model (representation of an emplyee in a file)
interface DBEmployee {
  id: number;
  name: string;
  username: string;
  email: string;
  hourlyRate: number;
  overtimeRate: number;
}

// Database Shift model (representation of a shift in a file)
interface DBShift {
  id: number;
  employeeId: number;
  clockIn: string;
  clockOut: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private ngZone: NgZone) {}

  get all(): Observable<Employee[]> {
    return combineLatest([
      // 1. Observable
      new Observable<DBEmployee[]>(ob => {
        ipcRenderer.send('READ_EMPLOYEES', {});
        ipcRenderer.on('READ_EMPLOYEES', (ev, employees) => {
          this.ngZone.run(() => {
            ob.next(employees);
          });
        });
      }),
      // 2. Observable
      new Observable<DBShift[]>(ob => {
        ipcRenderer.send('READ_EMPLOYEES_SHIFTS', {});
        ipcRenderer.on('READ_EMPLOYEES_SHIFTS', (ev, employeesShifts) => {
          this.ngZone.run(() => {
            ob.next(employeesShifts);
          });
        });
      })
    ]).pipe(
      map(([employees, employeesShifts]) => employees.map((employee) => {
          const shifts = employeesShifts.filter(employeeShift => employeeShift.employeeId === employee.id);
          return { ...employee, shifts } as Employee;
        })
      ),
      tap((employees) => {
        console.log(employees);
      }),
      shareReplay(1),
    );
  }
}
