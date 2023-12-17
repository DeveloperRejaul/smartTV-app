/**
 * @description this function use for use selector, checking for selected data change
 * @param {object} oldState
 * @param {object} newState
 * @returns boolean
 */
export function checkEqual(oldState, newState) {
  return JSON.stringify(oldState) === JSON.stringify(newState);
}
