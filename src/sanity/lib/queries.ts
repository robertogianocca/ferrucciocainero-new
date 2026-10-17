import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    footerText,
    email,
    phone,
    socialLinks[]{
      label,
      url
    },
    navigation[]{
      label,
      linkType,
      href,
      page->{
        "slug": slug.current,
        parent->{
          "slug": slug.current
        }
      }
    }
  }
`);
