// Fichier: client/src/utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
// Assure-toi que ce chemin remonte bien jusqu'à "server/routers.ts"
// Si ton dossier client est au même niveau que server, c'est souvent ../../../server/routers
import type { AppRouter } from '../../../server/routers';

export const trpc = createTRPCReact<AppRouter>();
