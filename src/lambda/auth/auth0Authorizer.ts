import { CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const auth0secret = process.env.AUTH_0_SECRET
// const secretField = process.env.AUTH_0_SECRET_FIELD

export const handler = async (event: any): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(event.authorizationToken);
    console.log("User was authorized", decodedToken);

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    console.log("User was not authorized", e.message);

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

    return verify(token, auth0secret) as JwtToken;
}

// handler.use(
//   secretsManager({
//     cache: true,
//     cacheExpiryInMillis: 60000,
//     // Throw an error if can't read the secret
//     throwOnFailedCall: true,
//     secrets: {
//       AUTH0_SECRET: secretId,
//     },
//   })
// );
