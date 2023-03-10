import { Shift } from './services/employee.model';

const MINUTES_IN_A_DAY = 24 * 60;

/**
 * @returns `true` if a shift is active, `false` otherwise
 */
export function isShiftActive(shift: Shift) {
  return shift.clockOut === '0';
}

/**
 * @returns Returns minutes elapsed from starting of a day (`00`:`00`) up to (`hours`:`minutes`).
 */
function toMinutes([hours, minutes]: [number, number]) {
  return hours * 60 + minutes;
}

/**
 * @returns a duration of a shift expressiod in hours. Could be decimal.
 */
export function durationInHours(shift: Shift) {
  if (isShiftActive(shift)) {
    return 0;
  } else {

    const [startHours1, startMinutes1] = shift.clockIn.split(':').map(each => +each) as [number, number];
    const [startHours2, startMinutes2] = shift.clockOut.split(':').map(each => +each) as [number, number];

    if (startHours1 <= startHours2) {
      /**
       * clockIn: "08:12"
       * clockOut: "15:20"
       */
      const startMinutes = toMinutes([startHours1, startMinutes1]);
      const endMinutes = toMinutes([startHours2, startMinutes2]);
      const totalHours = (endMinutes - startMinutes) / 60;
      return totalHours;
    } else {
      /**
       * clockIn: 23:12
       * clockOut: 06:23 (tomorrow)
       */
      const start = MINUTES_IN_A_DAY - toMinutes([startHours1, startMinutes1]);
      const end = toMinutes([startHours2, startMinutes2]);
      const totalHours = (start + end) / 60;
      return totalHours;
    }
  }
}
