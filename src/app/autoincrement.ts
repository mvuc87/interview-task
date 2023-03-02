/**
 * Simulation of autoincrement for one session.
 *
 * Closure-based implementation.
 */
function autoincrement() {
  let value = 101;
  return () => value++;
}

export const increment = autoincrement();
