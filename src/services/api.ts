import { VENUES } from "@/data/venues";
import type { ApiResponse, Venue } from "@/types";

// MOCK LAYER. Replace bodies with fetch(`${BASE}/...`) once the FastAPI backend exists.
// UI components must only talk to these functions, never to data files directly.
const BASE = process.env.NEXT_PUBLIC_API_URL; // eslint-disable-line @typescript-eslint/no-unused-vars
const mock = async <T,>(data: T, error: string | null = null): Promise<ApiResponse<T>> => ({ data: error ? null : data, error });

export const venueService = {
  list: () => mock<Venue[]>(VENUES),
  get: async (id: string): Promise<ApiResponse<Venue>> => {
    const v = VENUES.find((x) => x.id === id);
    return v ? mock(v) : mock(null as unknown as Venue, "Venue not found");
  },
};
// TODO(auth): authService.login / signup / me -> FastAPI JWT endpoints.
// TODO(payments): paymentService.createIntent -> real gateway. Payment is simulated for now.
