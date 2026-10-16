import { defineArrayMember, defineField, defineType } from "sanity";

const portableTextBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          {
            name: "href",
            type: "url",
            title: "URL",
            validation: (rule) =>
              rule.uri({
                allowRelative: true,
                scheme: ["http", "https", "mailto", "tel"],
              }),
          },
        ],
      },
    ],
  },
});

export const pageImage = defineType({
  name: "pageImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "caption", alt: "alt", media: "image" },
    prepare({ title, alt, media }) {
      return { title: title || alt || "Image", media };
    },
  },
});

export const pageGallery = defineType({
  name: "pageGallery",
  title: "Gallery",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { images: "images" },
    prepare({ images }) {
      const count = Array.isArray(images) ? images.length : 0;
      return {
        title: "Gallery",
        subtitle: `${count} image${count === 1 ? "" : "s"}`,
        media: images?.[0],
      };
    },
  },
});

export const pageVideo = defineType({
  name: "pageVideo",
  title: "Video embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "YouTube or Vimeo URL",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare({ title, subtitle }) {
      return { title: title || "Video", subtitle };
    },
  },
});

export const pageBodyMembers = [
  portableTextBlock,
  defineArrayMember({ type: "pageImage" }),
  defineArrayMember({ type: "pageGallery" }),
  defineArrayMember({ type: "pageVideo" }),
];
