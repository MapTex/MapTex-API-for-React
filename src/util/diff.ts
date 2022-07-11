/**
 * const obj1 = {
 *   'line-color': '#ffffff',
 *   'line-opacity': 0.5
 *   'line-gap': 3
 * }
 * const obj2 = {
 *   'line-color': ['rbg', 255, 0, 0],
 *   'line-width': 4,
 *   'line-opacity': 0.5
 * }
 * @param obj1 {
 *   'line-color': '#ffffff',
 *   'line-opacity': 0.5,
 *   'line-gap': 3
 * }
 * @param obj2 {
 *   'line-color': ['rbg', 255, 0, 0],
 *   'line-width': 4,
 *   'line-opacity': 0.5
 * }
 * @returns  {
 *   'line-color': ['rbg', 255, 0, 0],
 *   'line-width': 4,
 *   'line-opacity': 0.5
 *   'line-gap': undefined
 * }
 *
 */
// tslint:disable-next-line:no-any
export const diff = (obj1: any, obj2: any) => {
  const toMutate = {};
  Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)])).map(
    (key) => {
      if (obj1[key] !== obj2[key]) {
        toMutate[key] = obj2[key];
      }
    },
  );
  return toMutate;
};

export default diff;
