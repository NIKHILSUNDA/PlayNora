export type Sport = "Football" | "Box Cricket" | "Pickleball" | "Padel";
export interface Venue { id: string; name: string; location: string; pricePerHour: number; rating: number; reviews: number; sports: Sport[]; image: string; images?: string[]; prices?: Partial<Record<Sport, number>>; geo?: { lat: number; lng: number; mapUrl?: string; placeName?: string } }
export interface BookingSession { title: string; level: string; fee: number; start: string; end: string }
export interface Booking {
  venue: Venue; date: string; slot: string; total: number; sport?: Sport; price?: number;
  /** Set when the person joins a game session: who is playing and who to contact. */
  session?: BookingSession; players?: string[]; contact?: { name: string; phone: string };
}
export interface ApiResponse<T> { data: T | null; error: string | null }
