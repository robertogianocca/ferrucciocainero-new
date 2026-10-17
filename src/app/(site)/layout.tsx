import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const title = settings?.title || "Ferruccio Cainero";
  const navigation = settings?.navigation ?? [];

  return (
    <>
      <SiteHeader title={title} navigation={navigation} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        title={title}
        footerText={settings?.footerText}
        email={settings?.email}
        phone={settings?.phone}
        socialLinks={settings?.socialLinks}
      />
    </>
  );
}
