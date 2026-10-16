export { metadata, viewport } from "next-sanity/studio";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh", maxHeight: "100dvh", overflow: "auto" }}>
      {children}
    </div>
  );
}
