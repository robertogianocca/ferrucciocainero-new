import { DocumentIcon } from "@sanity/icons/Document";
import { defineField, defineType } from "sanity";

import { pageBodyMembers } from "./blocks";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      description:
        "URL segment for this page (e.g. biography). Nested pages use the parent path too.",
    }),
    defineField({
      name: "parent",
      title: "Parent page",
      type: "reference",
      to: [{ type: "page" }],
      description: "Optional. Use for URLs like /attivita/teatro.",
      // Avoid selecting self as parent in the UI later via filter if needed.
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: pageBodyMembers,
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      parentSlug: "parent.slug.current",
    },
    prepare({ title, slug, parentSlug }) {
      const path = [parentSlug, slug].filter(Boolean).join("/");
      return {
        title,
        subtitle: path ? `/${path}` : "No slug",
      };
    },
  },
});
