import { mockedProductsList } from "~/mocks/productListData";
import { IProduct } from "~/shared/types";

export interface IStorage<
  ID = number | string,
  StoredType extends { id: ID } = { id: ID }
> {
  findMany(): Promise<StoredType[]>;
  findById(id: ID): Promise<StoredType | undefined>;
}

class ProductsListStorageInMemory implements IStorage<string, IProduct> {
  _products: IProduct[] = [];

  constructor(products: IProduct[]) {
    this._products = products;
  }

  async findMany(): Promise<IProduct[]> {
    return this._products;
  }

  async findById(id: string): Promise<IProduct | undefined> {
    return this._products.find((p) => p.id === id);
  }
}

export const productsListStorage = new ProductsListStorageInMemory(
  mockedProductsList
);
