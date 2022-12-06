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

export function validateReqBody({ body, expectedPropertys, allowNull }) {
  if (!body) return false;
  if (Object.keys(body).length !== expectedPropertys.length) return false;
  if (!Object.keys(body).every((key) => expectedPropertys.includes(key))) return false;
  if (allowNull) return true;
  else if (
    !Object.values(body).every(
      (val) =>
        ![null, 'null', NaN, 'NaN', undefined, 'undefined', false, 'false'].includes(
          val
        ) || val.length === 0
    )
  )
    return false;
  return true;
}

export function isNull(data) {
  return (
    [null, 'null', NaN, 'NaN', undefined, 'undefined', false, 'false'].includes(data) ||
    data.length === 0
  );
}
