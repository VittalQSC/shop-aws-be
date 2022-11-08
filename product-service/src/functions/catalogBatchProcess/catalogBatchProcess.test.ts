import { SQSEvent } from "aws-lambda";
import { mockedProduct, mockedProductsList } from "~/mocks/productListData";
import { productsListStorage } from "~/storage";
import * as catalogBatchProcess from "./catalogBatchProcess";
import publishProducts from "./publishProducts";

const Records = mockedProductsList.map((product) => {
  const { id, ...rest } = product;
  return {
    body: JSON.stringify(rest),
  };
});

jest.mock("./publishProducts", function () {
  return jest.fn();
});

describe("#catalogBatchProcess", () => {
  beforeAll(() => {
    jest.spyOn(productsListStorage, "create");
  });

  beforeEach(() => {
    jest
      .mocked(productsListStorage.create)
      .mockImplementation(() => Promise.resolve(mockedProduct));
  });

  it("should create products coming from SQS event", async () => {
    await catalogBatchProcess.handler({
      Records,
    } as SQSEvent);

    expect(productsListStorage.create).toBeCalledTimes(
      mockedProductsList.length
    );
    expect(publishProducts).toBeCalledTimes(1);
  });
});
