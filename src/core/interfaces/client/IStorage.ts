export interface IStorage {
  get<TValue>(key: string): TValue | null;
  set<TValue>(key: string, value: TValue): void;
  remove(key: string): void;
}
