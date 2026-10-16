import type { SchemaTypeDefinition } from "sanity";

import { pageGallery, pageImage, pageVideo } from "./blocks";
import { event } from "./event";
import { eventType } from "./eventType";
import { page } from "./page";
import { post } from "./post";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  event,
  eventType,
  post,
  page,
  siteSettings,
  pageImage,
  pageGallery,
  pageVideo,
];
