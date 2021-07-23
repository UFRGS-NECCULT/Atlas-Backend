/**
 * Sends a fail response
 * @param {import('express').Response} res The response object
 * @param {String} error The error message
 * @param {*} status The http status code to send
 */
export function fail(res, error, status = 500) {
    res.status(status).json({
        error,
    });
}

/**
 * Encapsula uma função assíncrona para que o express possa
 * detectar throws dentro dela (ao invés de desligar o servidor)
 */
export const asyncHandler = fn => (...args) => {
  const fnReturn = fn(...args);
  const next = args[args.length-1];
  return Promise.resolve(fnReturn).catch(next);
}

/**
 * Returns the value or in case it is undefined, a default value
 * @param {any} value The value to be returned
 * @param {any} def The default value in case `value` is undefined
 * @param {Function} type The function to cast `value`
 * @example valueOrDefault(req.query.var, 0, Number)
 */
export const valueOrDefault = (value, def, type) => {
    // Use the adequate array function
    if (type === Array) {
        type = Array.from;
    }

    if (value === undefined) {
        return type(def);
    }
    return type(value);
}
