"use strict";

const ACCESS_CONTROL_ALLOW = {
  "Access-Control-Allow-Origin": "*",
};

export default function envelop(body: string, statusCode = 200) {
  return {
    statusCode,
    headers: {
      ...ACCESS_CONTROL_ALLOW,
    },
    body,
  };
}
