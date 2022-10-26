export interface IStorage<
  ID = number | string,
  StoredType extends { id: ID } = { id: ID }
> {
  findMany(): Promise<StoredType[]>;
  findById(id: ID): Promise<StoredType | undefined>;
  create(item: StoredType): Promise<StoredType | undefined>;
}
