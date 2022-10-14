import AWS from "aws-sdk";

import { IProduct } from "~/shared/types";

import { IStorage } from "./IStorage";

const client = new AWS.DynamoDB.DocumentClient();

interface IProductDB {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface IStockDB {
  product_id: string;
  count: number;
}

export class ProductsListStorageDynamoDB implements IStorage<string, IProduct> {
  async findMany(): Promise<IProduct[]> {
    const productsResult = await client
      .scan({
        TableName: "productsTable",
      })
      .promise();
    const stocksResult = await client
      .scan({
        TableName: "stocksTable",
      })
      .promise();
    return this._mergeProductDBListWithStocksDBList(
      productsResult.Items as IProductDB[],
      stocksResult.Items as IStockDB[]
    );
  }

  async findById(id: string): Promise<IProduct | undefined> {
    const productResult = await client
      .query({
        TableName: "productsTable",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
      })
      .promise();
    const stockResult = await client
      .query({
        TableName: "stocksTable",
        KeyConditionExpression: "product_id = :id",
        ExpressionAttributeValues: { ":id": id },
      })
      .promise();
    const productsList = this._mergeProductDBListWithStocksDBList(
      productResult.Items as IProductDB[],
      stockResult.Items as IStockDB[]
    );
    return productsList.length > 0 ? productsList[0] : undefined;
  }

  async create(item: IProduct) {
    const { id, count, ...restItem } = item;

    await client.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: "productsTable",
            Item: { id, ...restItem },
          },
        },
        {
          Put: {
            TableName: "stocksTable",
            Item: { product_id: id, count },
          },
        },
      ],
    }).promise();

    return item;
  }

  _mergeProductDBListWithStocksDBList(
    products: IProductDB[],
    stocks: IStockDB[]
  ): IProduct[] {
    // TODO can be optimized by storing stocks in Map
    // to not iterate the array every time
    return products.map((p) => {
      const stock = stocks.find((s) => s.product_id === p.id);
      return { ...p, count: stock?.count || 0 };
    });
  }
}
