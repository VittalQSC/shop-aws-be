"use strict";

import { productsListStorage } from "~/storage";
import { mockedProduct } from "~/mocks/productListData";

import * as getProductById from "./getProductById";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";

describe("#getProductById", () => {
  beforeAll(() => {
    jest.spyOn(productsListStorage, "findById");
  });

  it("should return 400 response when product id was not provided", async () => {
    const mockedEvent = {
      pathParameters: {},
    };

    const result = await getProductById.handler(
      mockedEvent as APIGatewayProxyEvent
    );

    expect(result.statusCode).toBe(400);
  });

  it("should return 404 response when product was not found", async () => {
    const mockedEvent = {
      pathParameters: {
        id: "test",
      },
    };
    jest
      .mocked(productsListStorage.findById)
      .mockImplementation(() => Promise.resolve(undefined));

    const result = await getProductById.handler(
      mockedEvent as APIGatewayProxyEvent & { pathParameters: { id: string } }
    );

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 response when something went wrong", async () => {
    const mockedEvent = {
      pathParameters: {
        id: "test",
      },
    };
    jest
      .mocked(productsListStorage.findById)
      .mockImplementation(() => Promise.reject());

    const result = await getProductById.handler(
      mockedEvent as APIGatewayProxyEvent & { pathParameters: { id: string } }
    );

    expect(result.statusCode).toBe(500);
  });

  it("should return 200 response when succeeds", async () => {
    const mockedEvent = {
      pathParameters: {
        id: "test",
      },
    };
    jest
      .mocked(productsListStorage.findById)
      .mockImplementation(() => Promise.resolve(mockedProduct));

    const result = await getProductById.handler(
      mockedEvent as APIGatewayProxyEvent & { pathParameters: { id: string } }
    );

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockedProduct);
  });
});
