import { APIGatewayAuthorizerEvent } from "aws-lambda/trigger/api-gateway-authorizer";

import { generatePolicy } from "~/utils/generatePolicy";

export async function handler(event: APIGatewayAuthorizerEvent) {
  if (event["type"] !== "TOKEN") {
    throw new Error("Unauthorized");
  }

  try {
    const authToken = event.authorizationToken;

    const [, encodedCreds] = authToken.split(" ");
    const buff = Buffer.from(encodedCreds, "base64");
    const [username, password] = buff.toString("utf-8").split(":");

    console.log("username: ", username, " password: ", password);

    const storedPassword = process.env[username];

    const effect =
      !storedPassword || storedPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    console.log(`policy: ${JSON.stringify(policy)}`);
    return policy;
  } catch (error) {
    throw new Error(`Something went wrong: ${error}`);
  }
}
