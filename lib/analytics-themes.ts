import { 
  Sparkles, 
} from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export interface PlatformTheme {
  id: string;
  name: string;
  icon: any;
  logo?: any;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  border: string;
  vibe: "visual" | "minimal" | "corporate" | "energetic" | "creative" | "default";
}

export const PLATFORM_THEMES: Record<string, PlatformTheme> = {
  "All Platforms": {
    id: "All Platforms",
    name: "Overview",
    icon: FaXTwitter,
    logo: FaXTwitter,
    primary: "#000000",
    secondary: "#1a1f36",
    accent: "#635bff",
    bg: "#f8fafc",
    border: "#e2e8f0",
    vibe: "minimal",
  },
  "Instagram": {
    id: "Instagram",
    name: "Instagram",
    icon: FaInstagram,
    logo: FaInstagram,
    primary: "#E1306C",
    secondary: "#F77737",
    accent: "#E1306C",
    bg: "#fff5f8",
    border: "#fbcfe8",
    vibe: "visual",
  },
  "Twitter / X": {
    id: "Twitter / X",
    name: "Twitter / X",
    icon: FaXTwitter,
    logo: FaXTwitter,
    primary: "#000000",
    secondary: "#1a1f36",
    accent: "#000000",
    bg: "#fcfcfc",
    border: "#e3e8ef",
    vibe: "minimal",
  },
  "LinkedIn": {
    id: "LinkedIn",
    name: "LinkedIn",
    icon: FaLinkedinIn,
    logo: FaLinkedinIn,
    primary: "#0077B5",
    secondary: "#0a66c2",
    accent: "#0077B5",
    bg: "#f0f7fb",
    border: "#bae6fd",
    vibe: "corporate",
  },
  "Facebook": {
    id: "Facebook",
    name: "Facebook",
    icon: FaFacebook,
    logo: FaFacebook,
    primary: "#1877F2",
    secondary: "#0c63d4",
    accent: "#1877F2",
    bg: "#f0f5ff",
    border: "#bfdbfe",
    vibe: "default",
  },
  "TikTok": {
    id: "TikTok",
    name: "TikTok",
    icon: FaTiktok,
    logo: FaTiktok,
    primary: "#000000",
    secondary: "#ee1d52",
    accent: "#000000",
    bg: "#fcfcfc",
    border: "#e3e8ef",
    vibe: "energetic",
  },
  "YouTube": {
    id: "YouTube",
    name: "YouTube",
    icon: FaYoutube,
    logo: FaYoutube,
    primary: "#FF0000",
    secondary: "#cc0000",
    accent: "#FF0000",
    bg: "#fff5f5",
    border: "#fecaca",
    vibe: "energetic",
  },
  "Pinterest": {
    id: "Pinterest",
    name: "Pinterest",
    icon: FaPinterest,
    logo: FaPinterest,
    primary: "#BD081C",
    secondary: "#e60023",
    accent: "#BD081C",
    bg: "#fff1f1",
    border: "#fecaca",
    vibe: "creative",
  },
};
