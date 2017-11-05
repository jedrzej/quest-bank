'use strict';

export function success(data, callback, status = 200) {
  return response(data, callback, status);
}

export function failure(data, callback, status = 500) {
  return response(data, callback, status);
}

function response(data, callback, statusCode) {
  return callback(null, {
    statusCode,
    body: data,
  });
}