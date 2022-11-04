import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";

import { UPLOADED_BUCKET } from "~/constants/buckets";
import { ImportProductsQueryParamsType } from "~/shared/types";
import envelop from "~/utils/envelop";

export async function handler(event: APIGatewayProxyEvent) {
  try {
    const s3 = new AWS.S3();
    console.log(
      "GET",
      "importProductsFile.handler",
      `query params: ${
        event.queryStringParameters as ImportProductsQueryParamsType
      }`
    );
    const name = decodeURIComponent(event.queryStringParameters?.name || "");
    if (!name) {
      return envelop("passed query params are wrong", 400);
    }
    const params = {
      Bucket: UPLOADED_BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: "text/csv",
    };
    const url = await s3.getSignedUrlPromise("putObject", params);
    return envelop(url);
  } catch (error) {
    return envelop("something went wrong", 500);
  }
}
