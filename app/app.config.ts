import type { SidebarItems } from "@/shared/types/appconfig";
import {
  Terminal,
  User,
  LogOut,
  Settings,
  User2,
} from "lucide-vue-next";

export default defineAppConfig({
  application: {
    name: "SongGuess.app",
    header: {
      title: "SongGuess",
      description: "Join, pick and guess the songs. It's that simple.",
    },
    description: "A fun game to guess songs with your friends.",
    company: "Codekuu",
    version: "1.0.0",
    to: "https://songguess.app",
    logo: "/assets/logo.svg",
    sidebar: [
      {
        header: "Platform",
        items: [
          {
            title: "AI Playground",
            to: "/playground",
            icon: Terminal,
            isActive: true,
            items: [
              {
                title: "Chatbot",
                to: "/playground/chat",
              },
            ],
          },
        ],
      } as SidebarItems,
    ],
    siderbarUserLinks: [
      {
        title: "Profile",
        to:'/admin/profile',
        icon: User2,
        separator: false,
      },
      {
        title: "Logout",
        action: "logout",
        icon: LogOut,
        separator: true,
      },
    ],
  },
});