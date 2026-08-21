export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Catering", href: "/catering" },
  { label: "Meal Plans", href: "/meal-plans" },
  { label: "Order", href: "/order" },
  { label: "Frisco Market", href: "/frisco-fresh-market" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export const BUSINESS = {
  name: "Adinkra Fusion Kitchen",
  operator: "Unseasoned Yolk, LLC",
  chef: "Chef Eric",
  phone: "(575) 637-5478",
  email: "unseasonedyolk@gmail.com",
  serviceArea: "North Dallas, Fort Worth & the DFW Metroplex",
  instagram: "adinkrafusionkitchen",
  facebook: "adinkrafusionkitchen",
  pickup: {
    venue: "Frisco Fresh Market",
    address: "9200 Dallas Parkway",
    city: "Frisco, TX 75033",
    schedule: "Saturdays & Sundays",
    saturdayHours: "8:00 AM – 4:00 PM",
    sundayHours: "10:00 AM – 4:00 PM",
  },
};

// This coming weekend's market dates — update as needed, or wire to
// settings once the admin can schedule market dates directly.
export const NEXT_MARKET_DATES = {
  saturday: "2026-08-22",
  sunday: "2026-08-23",
};
