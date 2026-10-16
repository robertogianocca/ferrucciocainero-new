"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

const config = defineConfig({
  name: "ferruccio-cainero",
  title: "Ferruccio Cainero",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
  },
});

export default config;
