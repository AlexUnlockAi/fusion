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
  pickup: {
    venue: "Frisco Fresh Market",
    city: "Frisco, TX",
    schedule: "Weekends",
  },
};
