import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookBody = {
  _type?: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ revalidated: false, reason: "No _type" });
    }

    const type = body._type;
    const slug = body.slug?.current;
    const tags = new Set<string>(["sanity"]);

    if (type === "siteSettings") tags.add("siteSettings");
    if (type === "page") {
      tags.add("pages");
      if (slug) tags.add(`page:${slug}`);
    }
    if (type === "post") {
      tags.add("posts");
      if (slug) tags.add(`post:${slug}`);
    }
    if (type === "event" || type === "eventType") {
      tags.add("events");
      if (slug) tags.add(`event:${slug}`);
    }

    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({
      revalidated: true,
      tags: [...tags],
      now: Date.now(),
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error revalidating", { status: 500 });
  }
}
