import { Component, OnInit } from '@angular/core';
import { combineLatest, debounceTime, map } from 'rxjs';
import { Employee, Shift } from '../../services/employee.model';
import { EmployeeService } from '../../services/employees.service';
import { SearchService } from '../../services/search.service';
import { durationInHours, isShiftActive } from '../../utils';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private searchService: SearchService
  ) { }

  get days(): number[] {
    const maxDays = this.employees
      .map(({ shifts }) => shifts.length)
      .reduce((acc, value) => acc >= value ? acc : value, 0);
    return new Array(maxDays).fill(0).map((_, index) => index + 1);
  }

  ngOnInit(): void {
    combineLatest([
      this.searchService.text.pipe(debounceTime(200)),
      this.employeeService.all(),
    ]).pipe(
      map(([searchText, employees]) => {
        if (searchText) {
          const search = searchText.toLowerCase();
          return employees.filter(({ name, email }) => name.toLowerCase().includes(search) || email.toLowerCase().includes(search));
        } else {
          return employees;
        }
      })
    ).subscribe((employees) => {
      this.employees = employees;
    });
  }

  /**
   * @returns daily earnings
   */
  earnings(hourlyRate: number, shift: Shift) {
    return Math.round(hourlyRate * durationInHours(shift) * 100) / 100;
  }

  /**
   * @returns `true` if there is active shift for employee, `false` otherwise
   */
  hasActiveShift({ shifts }: Employee) {
    for (const shift of shifts) {
      if (isShiftActive(shift)) {
        return true;
      }
    }
    return false;
  }

  onClockOut() {
    this.employeeService.clockOut();
  }

  onClockIn(employee: Employee) {
    this.employeeService.clockIn(employee);
  }
}
