// On remonte de 2 niveaux (../../) pour trouver utils
import { trpc } from "../../utils/trpc";

export function useAuth() {
  const { data, isLoading, isError } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user: data?.user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!data?.user,
  };
}
// Force Fix v5
