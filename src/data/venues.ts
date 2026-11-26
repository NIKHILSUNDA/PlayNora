import type { Venue } from "@/types";
export const VENUES: Venue[] = [
  {
    id: "1", name: "Dace Athletic Club | RK Puram", location: "Sector 4, Rama Krishna Puram, New Delhi, Delhi 110022, India",
    pricePerHour: 500, rating: 4.8, reviews: 124, sports: ["Football", "Box Cricket", "Pickleball", "Padel"],
    image: "/images/venues/dace-1.webp",
    images: ["/images/venues/dace-1.webp", "/images/venues/dace-2.webp", "/images/venues/dace-3.webp", "/images/venues/dace-4.webp", "/images/venues/dace-5.webp"],
    prices: { Football: 1500, "Box Cricket": 1500, Pickleball: 500, Padel: 1000 },
    geo: {
      lat: 28.5573848, lng: 77.1778427, placeName: "Dace Athletic Club",
      mapUrl: "https://www.google.com/maps/place/Dace+Athletic+Club/@28.5564896,77.1782719,16z/data=!4m6!3m5!1s0x390d1d8776a7d659:0x8c2a0c9ca6aab541!8m2!3d28.5573848!4d77.1778427!16s%2Fg%2F11nr1l7zwf?hl=en_GB",
    },
  },
];
export const SLOTS = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
