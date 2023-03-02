import { Injectable, NgZone } from '@angular/core';
import { Observable, combineLatest, map, take, BehaviorSubject } from 'rxjs';
import { increment } from '../autoincrement';
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

  private dbEmployees = new BehaviorSubject<DBEmployee[]>([]);
  private dbEmployeeShifts = new BehaviorSubject<DBShift[]>([]);

  /**
   * A list of employees obtained from underlying storage.
   */
  private employees = combineLatest([
    this.dbEmployees,
    this.dbEmployeeShifts,
  ]).pipe(
    map(([employees, employeesShifts]) => {
      const validShifts = employeesShifts.filter(({ clockIn, clockOut }) => clockIn && clockOut);
      return { employees, employeeShifts: validShifts };
    }),
    map(({employees, employeeShifts}) => employees.map((employee) => {
        const shiftsByEmployee = employeeShifts.filter(employeeShift => employeeShift.employeeId === employee.id);
        return { ...employee, shifts: shiftsByEmployee } as Employee;
      })
    ),
  );

  constructor(private ngZone: NgZone) {
    ipcRenderer.send('READ_EMPLOYEES', {});
    ipcRenderer.on('READ_EMPLOYEES', (ev, employees) => {
      this.ngZone.run(() => {
        this.dbEmployees.next(employees);
      });
    });
    ipcRenderer.send('READ_EMPLOYEES_SHIFTS', {});
    ipcRenderer.on('READ_EMPLOYEES_SHIFTS', (ev, employeesShifts) => {
      this.ngZone.run(() => {
        this.dbEmployeeShifts.next(employeesShifts);
      });
    });
  }

  /**
   * @returns all employees obtained from underlying storage (employees.json and employee-shifts.json)
   */
  all(): Observable<Employee[]> {
    return this.employees;
  }

  /**
   * Clocks in a new shift for a given `employee`
   */
  clockIn(employee: Employee) {
    this.allDBShifts()
      .pipe(take(1)) // ensure to unsubscribe after first event
      .subscribe((shifts) => {
        // Fist, clock out any open shift
        this.clockOutAll(shifts);
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        shifts.push({
          id: increment(),
          employeeId: employee.id,
          clockIn: `${hours}:${minutes}`,
          clockOut: '0',
        });
        // Save to file
        ipcRenderer.send('SAVE_EMPLOYEES_SHIFTS', shifts);
        this.dbEmployeeShifts.next(shifts);
      });
  }

  /**
   * Clocks Out active shift.
   */
  clockOut() {
    this.allDBShifts()
      .pipe(take(1)) // ensure to unsubscribe after first event
      .subscribe((shifts) => {
        this.clockOutAll(shifts);
        // Save to file
        ipcRenderer.send('SAVE_EMPLOYEES_SHIFTS', shifts);
        this.dbEmployeeShifts.next(shifts);
      });
  }

  /**
   * Ensures there is no active shift.
   */
  private clockOutAll(shifts: DBShift[]) {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    for (const shift of shifts) {
      if (shift.clockOut === '0') {
        shift.clockOut = `${hours}:${minutes}`;
      }
    }
  }

  /**
   * Takes all shifts from all employees and concat those shifts in order
   * to prepare them for updating underlying storage (employee-shifts.json)
   *
   * @returns all shifts from all employees
   */
  private allDBShifts(): Observable<DBShift[]> {
    return this.all()
      .pipe(
        map((employees) => {
          const toReturn: DBShift[] = [];
          employees.forEach(({ id, shifts }) => {
            shifts.forEach(shift => {
              toReturn.push({ employeeId: id, ...shift });
            });
          });
          return toReturn;
        })
      );
  }

}
