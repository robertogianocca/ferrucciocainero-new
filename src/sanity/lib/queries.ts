import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    footerText,
    email,
    phone,
    socialLinks[]{ label, url },
    navigation[]{
      label,
      linkType,
      href,
      page->{
        "slug": slug.current,
        parent->{ "slug": slug.current }
      }
    }
  }
`);

const pageBodyProjection = /* groq */ `
  body[]{
    ...,
    _type == "pageImage" => {
      ...,
      image
    },
    _type == "pageGallery" => {
      ...,
      images[]{ ..., asset }
    },
    _type == "image" => {
      ...,
      asset
    }
  }
`;

export const allPagesQuery = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current != "home"]{
    _id,
    title,
    "slug": slug.current,
    parent->{ "slug": slug.current }
  }
`);

export const pageByPathQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    parent->{
      title,
      "slug": slug.current
    },
    ${pageBodyProjection}
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "page" && slug.current == "home"][0]{
    _id,
    title,
    ${pageBodyProjection}
  }
`);

export const latestPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage,
    body[]{ ..., asset }
  }
`);

export const allEventsQuery = defineQuery(`
  *[_type == "event" && defined(start)] | order(start asc){
    _id,
    title,
    "slug": slug.current,
    start,
    end,
    venue,
    city,
    infoUrl,
    image,
    eventType->{ title, "slug": slug.current },
    description
  }
`);

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    start,
    end,
    venue,
    city,
    infoUrl,
    image,
    eventType->{ title, "slug": slug.current },
    description
  }
`);
