import { Shift } from './services/employee.model';
import { durationInHours, isShiftActive } from './utils';

describe('isShiftActive', () => {
  it('should return true if shift is active', () => {
    const activeShift: Shift = {
      clockIn: '00:00',
      clockOut: '0',
      id: 0,
    };
    expect(isShiftActive(activeShift)).toEqual(true);
  });
  it('should return false if shift is not active', () => {
    const activeShift: Shift = {
      clockIn: '00:00',
      clockOut: '00:00',
      id: 0,
    };
    expect(isShiftActive(activeShift)).toEqual(false);
  });
});

describe('durationInHours', () => {
  it('should return 0 if shift is active', () => {
    const activeShift: Shift = {
      clockIn: '00:00',
      clockOut: '0',
      id: 0,
    };
    expect(durationInHours(activeShift)).toEqual(0);
  });
  it('should return 0 if clockIn and clockOut represent the same time', () => {
    const shift: Shift = {
      clockIn: '11:12',
      clockOut: '11:12',
      id: 0,
    };
    expect(durationInHours(shift)).toEqual(0);
  });
  it('should return 1 hour if a distance between clockIn and clockOut is exactly one hour', () => {
    const shift: Shift = {
      clockIn: '11:03',
      clockOut: '12:03',
      id: 0,
    };
    expect(durationInHours(shift)).toEqual(1);
  });
  it('should calculte hours correctly if a shift is overnight', () => {
    const shift: Shift = {
      clockIn: '23:00', // shift starts late in the night
      clockOut: '06:00', // shifts end early in the morning (tmorrow)
      id: 0,
    };
    expect(durationInHours(shift)).toEqual(7);
  });
});
