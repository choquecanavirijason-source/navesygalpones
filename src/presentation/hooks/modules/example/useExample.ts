import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import type { IExampleService } from "@/core/interfaces/modules/example/IExampleService";
import type { ExampleItem } from "@/core/models/Example";
import type { CreateExampleInput } from "@/core/types/modules/example/example.types";
import type { AppError } from "@/application/errors/AppError";
import { ExampleClientService } from "@/application/services/client/example/ExampleClientService";
import { apiLocal } from "@/infrastructure/http/clients/apiLocal";

/** Composition root del lado cliente para `example`: servicio de navegador + `apiLocal`. */
const exampleService: IExampleService = new ExampleClientService(apiLocal);

export const exampleKeys = {
  list: "example:list",
} as const;

/** Lectura con SWR. Los componentes consumen este hook, nunca el servicio directamente. */
export function useExampleList() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ExampleItem[], AppError>(
    exampleKeys.list,
    () => exampleService.list(),
  );

  return {
    items: data ?? [],
    error,
    isLoading,
    isValidating,
    refresh: mutate,
  };
}

/** Escritura. Al completarse revalida `exampleKeys.list`. */
export function useCreateExample() {
  return useSWRMutation<ExampleItem, AppError, string, CreateExampleInput>(
    exampleKeys.list,
    (_key, { arg }) => exampleService.create(arg),
  );
}
