import type { IStorage } from "@/core/interfaces/client/IStorage";
import { STORAGE_KEY_PREFIX } from "@/config/constants";

type StorageArea = "local" | "session";

/**
 * Envoltorio seguro de Web Storage: no falla en SSR, en modo privado ni con
 * JSON corrupto. Solo para preferencias del visitante, nunca datos críticos.
 */
export class BrowserStorage implements IStorage {
  constructor(
    private readonly area: StorageArea = "local",
    private readonly prefix: string = STORAGE_KEY_PREFIX,
  ) {}

  get<TValue>(key: string): TValue | null {
    try {
      const raw = this.store?.getItem(this.prefix + key);
      return raw == null ? null : (JSON.parse(raw) as TValue);
    } catch {
      return null;
    }
  }

  set<TValue>(key: string, value: TValue): void {
    try {
      this.store?.setItem(this.prefix + key, JSON.stringify(value));
    } catch {
      // Cuota excedida o almacenamiento bloqueado: se ignora.
    }
  }

  remove(key: string): void {
    try {
      this.store?.removeItem(this.prefix + key);
    } catch {
      // Almacenamiento bloqueado: se ignora.
    }
  }

  private get store(): Storage | null {
    if (typeof window === "undefined") return null;

    try {
      return this.area === "local" ? window.localStorage : window.sessionStorage;
    } catch {
      return null;
    }
  }
}

export const localStore: IStorage = new BrowserStorage("local");
export const sessionStore: IStorage = new BrowserStorage("session");
