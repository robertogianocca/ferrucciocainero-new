import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "Ferruccio Cainero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navigation",
      title: "Main navigation",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "linkType",
              title: "Link type",
              type: "string",
              options: {
                list: [
                  { title: "Internal page", value: "page" },
                  { title: "Blog", value: "blog" },
                  { title: "Calendar", value: "calendar" },
                  { title: "Contact", value: "contact" },
                  { title: "External URL", value: "external" },
                ],
                layout: "radio",
              },
              initialValue: "page",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "page" }],
              hidden: ({ parent }) => parent?.linkType !== "page",
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              hidden: ({ parent }) => parent?.linkType !== "external",
              validation: (rule) =>
                rule.uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              linkType: "linkType",
              pageTitle: "page.title",
              href: "href",
            },
            prepare({ title, linkType, pageTitle, href }) {
              const subtitle =
                linkType === "page"
                  ? pageTitle || "Page"
                  : linkType === "external"
                    ? href || "External"
                    : linkType;
              return { title, subtitle };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
