import { Component, OnInit } from '@angular/core';
import { combineLatest, debounceTime, map } from 'rxjs';
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
      this.searchService.text.pipe(debounceTime(200)),
      this.employeeService.all,
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
}
