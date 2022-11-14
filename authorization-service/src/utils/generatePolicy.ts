export function generatePolicy(
  principalId: string,
  Resource: string,
  Effect: string
) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect,
          Resource,
        },
      ],
    },
  };
}
