import { Component, OnInit } from '@angular/core';
import { combineLatest, debounceTime, map, startWith } from 'rxjs';
import { Employee } from '../../services/employee.model';
import { EmployeeService } from '../../services/employees.service';
import { SearchService } from '../../services/search.service';

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

  ngOnInit(): void {
    combineLatest([
      this.searchService.text.pipe(
        debounceTime(500), // we don't really want to update table as some is typing fast
        startWith('') // initially do not wait for 500ms before showing table results
      ),
      this.employeeService.all,
    ]).pipe(
      map(([searchText, employees]) => {
        if (searchText) {
          const search = searchText.toLowerCase();
          return employees.filter(({ name, email }) => name.toLowerCase().includes(search) || email.includes(search));
        } else {
          return employees;
        }
      })
    ).subscribe((employees) => {
      this.employees = employees;
    });
  }

  /**
   * @returns `true` if `employee` has active shift, `false` otherwise
   */
  hasActiveShift(employee: Employee) {
    for (const shift of employee.shifts) {
      if (shift.clockOut === '0') {
        return true;
      }
    }
    return false;
  }
}
