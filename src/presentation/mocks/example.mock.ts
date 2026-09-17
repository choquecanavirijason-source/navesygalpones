import type { ExampleItem } from "@/core/models/Example";

/** Datos ficticios SOLO para maquetar estados visuales. Nunca se importan desde páginas en producción. */
export const exampleItemsMock: ExampleItem[] = [
  { id: "mock-1", name: "Item 1" },
  { id: "mock-2", name: "Item 2" },
  { id: "mock-3", name: "Item 3" },
];
