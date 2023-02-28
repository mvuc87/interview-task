Task duration: 1 hour

Tags: Electron, RxJS, Typescript, (Angular)

## Task:

1.  Create a simple Electron application that displays a list of items in a table. The items should be loaded from a JSON file employees.json and displayed in the table containing columns for id, name of an employee, email and sum of daily earnings. Daily earnings should be calculated combining hourly rate and shift length, contained in file employee-shifts.json

2.  Add a search input field that allows the user to search for the items by name or email. The search results should be displayed in the same table as the user types. Add a functionality that allows users to edit the name and hourly rate of an item in the table by clicking on the corresponding row. The edits should be updated in the corresponding JSON file.

3.  Each employee should have a Clock-in/Clock-out button depending on whether the user has an active shift(Clock-out) or not(Clock-in).

    1. Note: Shift is considered active when the Clock-out time is 0.
    
4.  When the user clicks on the Clock-in button the timer starts counting the time spent on that shift and the text on the button changes to Clock-out. Once the user clicks the Clock-out button, the shift is closed and the clock-out time is recorded with the time the button was pressed.

5.  If the user clicks on the Clock-in button for another employee, the currently working employee's shift should automatically close and the shift for the selected employee should start.

    1.  Two employees cannot work on a shift at the same time.

    2.  When selected, each employee should list their shifts and their clock-in and clock-out time, including the currently working shift with clock-out time 0.

5.  Bonus: Add unit tests to cover the main features of the application.

## Requirements:

-   Implement the search and filtering functionality using RxJS operators such as mergeMap, switchMap, combineLatest, concat, map, throttle or debounce time, filter, tap.

-   Use RxJS Observables to manage different states of the application.

**Note: The focus should be on implementing search, filtering, editing and adding functionality using RxJS operators and managing the state of the application with observables.**