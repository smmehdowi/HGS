// Minimal root admin layout — provides the HTML document shell only.
// Auth checking is handled in app/admin/(dashboard)/layout.tsx
export const metadata = { title: 'HGS Admin' };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
