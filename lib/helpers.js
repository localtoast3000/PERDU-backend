export function caseInsensitiveSearchString(searchString) {
  return new RegExp(`^${searchString}$`, 'i');
}

/**
 * Validates the body of an incoming HTTP request
 *
 * @param {Object} props
 * @param {Object} props.body - The request body to be validated
 * @param {String[]} props.expectedPropertys - The expected propertys to be found in the request body
 * @param {Boolean} props.allowNull - If true allows for undefined values
 * @returns {Boolean} true if all validations pass else false
 */

export function validateReqBody({ body, expectedPropertys, allowNull = false }) {
  if (!body || !expectedPropertys) return false;
  if (Object.keys(body).length !== expectedPropertys.length) return false;
  if (!Object.keys(body).every((key) => expectedPropertys.includes(key))) return false;
  if (allowNull) return true;
  else if (!Object.values(body).every((val) => !isNull(val))) return false;
  return true;
}

export function isNull(data) {
  return (
    [null, 'null', NaN, 'NaN', undefined, 'undefined'].includes(data) ||
    data?.length === 0 ||
    (isObject(data) && Object.keys(data).length === 0)
  );
}

export function isObject(data) {
  return typeof data === 'object' && !Array.isArray(data) ? true : false;
}

export function firstToUpperCase(str) {
  str = str.toLowerCase();
  return str.replace(str[0], str[0].toUpperCase());
}
