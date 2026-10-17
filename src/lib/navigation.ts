export type NavPageRef = {
  slug?: string | null;
  parent?: { slug?: string | null } | null;
};

export type NavItem = {
  label: string;
  linkType: string;
  href?: string | null;
  page?: NavPageRef | null;
};

export function pagePath(page: NavPageRef | null | undefined): string {
  if (!page?.slug) return "/";
  if (page.slug === "home") return "/";
  if (page.parent?.slug && page.parent.slug !== "home") {
    return `/${page.parent.slug}/${page.slug}`;
  }
  return `/${page.slug}`;
}

export function navHref(item: NavItem): string {
  switch (item.linkType) {
    case "calendar":
      return "/calendario";
    case "contact":
      return "/contact";
    case "blog":
      return "/blog";
    case "external":
      return item.href || "/";
    case "page":
    default:
      return pagePath(item.page);
  }
}
