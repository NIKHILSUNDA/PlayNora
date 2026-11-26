import type { Sport } from "@/types";
export const SPORTS: { name: Sport; slug: string; image: string }[] = [
  { name: "Football", slug: "football", image: "/images/sports/football.jpg" },
  { name: "Box Cricket", slug: "cricket", image: "/images/sports/cricket.jpg" },
  { name: "Pickleball", slug: "pickleball", image: "/images/sports/pickleball.jpg" },
  { name: "Padel", slug: "padel", image: "/images/sports/padel.jpg" },
];
export const SLIDES = [
  { label: "Football", src: "/images/slider/s1.jpg" }, { label: "Box Cricket", src: "/images/slider/s2.jpg" },
  { label: "Pickleball", src: "/images/slider/s3.jpg" }, { label: "Badminton", src: "/images/slider/s4.jpg" },
];
export const slugOf = (s: Sport) => SPORTS.find((x) => x.name === s)!.slug;
export const SPORT_LABEL: Record<Sport, string> = { Football: "8v8 Football (Turf)", "Box Cricket": "8v8 Box Cricket", Pickleball: "Pickleball (Outdoor)", Padel: "Padel (Outdoor)" };
