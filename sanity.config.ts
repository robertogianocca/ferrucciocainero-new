"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const config = defineConfig({
  name: "ferruccio-cainero",
  title: "Ferruccio Cainero",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: "/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});

export default config;
