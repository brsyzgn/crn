import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  MessagesSquare,
  Mic,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { href: "/vocabulary", label: "Vocabulary", short: "Words", icon: BookOpen },
  { href: "/interview", label: "Interview Practice", short: "Interview", icon: Mic },
  { href: "/practice", label: "AI Practice", short: "AI Practice", icon: MessagesSquare },
  { href: "/tests", label: "Mini Tests", short: "Tests", icon: ClipboardCheck },
  { href: "/progress", label: "Progress", short: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", short: "Settings", icon: Settings },
];

/** Items shown directly in the mobile bottom bar. The rest go in the "More" sheet. */
export const MOBILE_PRIMARY_HREFS = ["/dashboard", "/vocabulary", "/interview", "/tests"] as const;

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
