import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";

import * as importProductsFile from "~/functions/importProductsFile/importProductsFile";
import { ImportProductsQueryParamsType } from "~/shared/types";

const INVALID_EVENT = {
  queryStringParameters: {},
} as APIGatewayProxyEvent & {
  queryStringParameters: ImportProductsQueryParamsType;
};

const VALID_EVENT = {
  queryStringParameters: {
    name: "test.csv",
  },
} as APIGatewayProxyEvent & {
  queryStringParameters: ImportProductsQueryParamsType;
};

describe("#importProductsFile", () => {
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("S3");
  });

  it("should send 400 when query params are wrong", async () => {
    AWSMock.mock("S3", "getSignedUrl", (_: any, __: any, callback: any) =>
      callback(null, "testUrl")
    );

    const result = await importProductsFile.handler(INVALID_EVENT);

    expect(result.statusCode).toBe(400);
  });

  it("should send 500 when creating signed url was performed with error", async () => {
    AWSMock.mock("S3", "getSignedUrl", (_: any, __: any, callback: any) =>
      callback("something went wrong", null)
    );

    const result = await importProductsFile.handler(VALID_EVENT);

    expect(result.statusCode).toBe(500);
  });

  it("should send 200 and return signed url", async () => {
    AWSMock.mock("S3", "getSignedUrl", (_: any, __: any, callback: any) =>
      callback(null, "testUrl")
    );

    const result = await importProductsFile.handler(VALID_EVENT);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual("testUrl");
  });
});
