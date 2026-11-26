import type { Sport } from "@/types";

/** Demo session data for the venue page (no backend endpoint yet). */
export interface GameSession {
  sport: Sport;
  title: string;
  level: string;
  joined: number;
  total: number;
  fee: number;
  prize: number;
  dayOffset: number; // 0 = today
  start: string;
  end: string;
}

export const LIVE_SESSIONS: Record<Sport, GameSession> = {
  Football: { sport: "Football", title: "8v8 Turf Showdown", level: "Intermediate", joined: 14, total: 16, fee: 150, prize: 3000, dayOffset: 0, start: "6:00 PM", end: "7:00 PM" },
  "Box Cricket": { sport: "Box Cricket", title: "Box Cricket Blast", level: "All levels", joined: 12, total: 16, fee: 200, prize: 4000, dayOffset: 0, start: "6:00 PM", end: "7:00 PM" },
  Pickleball: { sport: "Pickleball", title: "Doubles Open", level: "Beginner friendly", joined: 6, total: 8, fee: 120, prize: 1500, dayOffset: 0, start: "7:00 PM", end: "8:00 PM" },
  Padel: { sport: "Padel", title: "Padel Pairs Clash", level: "Intermediate", joined: 4, total: 8, fee: 300, prize: 3000, dayOffset: 0, start: "7:00 PM", end: "8:00 PM" },
};

export const UPCOMING_SESSIONS: Record<Sport, GameSession> = {
  Football: { sport: "Football", title: "Weekend Turf League", level: "Competitive", joined: 9, total: 16, fee: 200, prize: 5000, dayOffset: 1, start: "7:00 PM", end: "8:00 PM" },
  "Box Cricket": { sport: "Box Cricket", title: "Night Cricket Cup", level: "All levels", joined: 5, total: 16, fee: 250, prize: 6000, dayOffset: 2, start: "8:00 PM", end: "9:00 PM" },
  Pickleball: { sport: "Pickleball", title: "Mixed Doubles Meet", level: "Beginner friendly", joined: 3, total: 8, fee: 150, prize: 2000, dayOffset: 2, start: "6:00 PM", end: "7:00 PM" },
  Padel: { sport: "Padel", title: "Padel Open Night", level: "Intermediate", joined: 2, total: 8, fee: 350, prize: 4000, dayOffset: 3, start: "9:00 PM", end: "10:00 PM" },
};

/** Flat fee added once per booking, no matter how many players join. */
export const PLATFORM_FEE = 50;
