import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Types",
        icon: Icons.Alphabet, // Replace with your desired icon
        items: [
          { title: "Cyclone", url: "/types/cyclone" },
          { title: "Flood", url: "/types/flood" },
          { title: "Tornado", url: "/types/tornado" },
          { title: "Hurricane", url: "/types/hurricane" },
          { title: "Earthquake", url: "/types/earthquake" },
        ],
      },
    ],
  },
];
