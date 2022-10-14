import { IProduct } from "~/shared/types";

import { IStorage } from "./IStorage";

// implementation from Task-3
export class ProductsListStorageInMemory implements IStorage<string, IProduct> {
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

  async create(item: IProduct) {
    console.log('NOT IMPLEMENED!');
    return item;
  }
}