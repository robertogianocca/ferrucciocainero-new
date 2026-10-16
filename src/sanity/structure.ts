import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Calendar")
        .child(
          S.list()
            .title("Calendar")
            .items([
              S.listItem()
                .title("Events")
                .schemaType("event")
                .child(
                  S.documentTypeList("event")
                    .title("Events")
                    .defaultOrdering([{ field: "start", direction: "desc" }]),
                ),
              S.listItem()
                .title("Event types")
                .schemaType("eventType")
                .child(S.documentTypeList("eventType").title("Event types")),
            ]),
        ),
      S.listItem()
        .title("Blog")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Blog posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages")),
      S.divider(),
      S.listItem()
        .title("Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
    ]);
