/**
 * Created by micha on 27/01/17.
 */

export function isArray(arr) {
  return arr.constructor.toString().indexOf("Array") > -1;
}
