'use strict';

export function success(data, callback) {
  return response(data, callback, 200);
}

export function failure(data, callback) {
  return response(data, callback, 500);
}

function response(data, callback, statusCode) {
  return callback(null, {
    statusCode,
    body: data,
  });
}