import { SQSEvent } from "aws-lambda";
import { mockedProduct, mockedProductsList } from "~/mocks/productListData";
import { productsListStorage } from "~/storage";
import * as catalogBatchProcess from "./catalogBatchProcess";
import publishProducts from "./publishProducts";

const mockedProductsWithoutIdList = mockedProductsList.map((product) => {
  const { id, ...rest } = product;
  return rest;
})

const Records = mockedProductsWithoutIdList.map((product) => {
  return {
    body: JSON.stringify(product),
  };
});

const InvalidRecords = mockedProductsList.map((product) => {
  const { id, title, ...rest } = product;
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

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should not create and publish products when provided events were invalid', async () => {
    await catalogBatchProcess.handler({
      Records: InvalidRecords,
    } as SQSEvent);

    expect(productsListStorage.create).toBeCalledTimes(0);
    expect(publishProducts).toBeCalledTimes(0);
  });

  it('should create and publish only valid products coming from SQS event', async () => {
    await catalogBatchProcess.handler({
      Records: [...InvalidRecords, ...Records],
    } as SQSEvent);

    expect(productsListStorage.create).toBeCalledTimes(
      mockedProductsList.length
    );
    expect(publishProducts).toBeCalledWith(mockedProductsWithoutIdList);
  });
});
