import { cacheTag } from "next/cache";

import { client } from "./client";
import { siteSettingsQuery } from "./queries";

export type SiteSettings = {
  title?: string;
  footerText?: string;
  email?: string;
  phone?: string;
  socialLinks?: { label: string; url: string }[];
  navigation?: {
    label: string;
    linkType: string;
    href?: string | null;
    page?: {
      slug?: string | null;
      parent?: { slug?: string | null } | null;
    } | null;
  }[];
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheTag("siteSettings");

  try {
    return await client.fetch(siteSettingsQuery);
  } catch (error) {
    console.error("Failed to load siteSettings", error);
    return null;
  }
}
