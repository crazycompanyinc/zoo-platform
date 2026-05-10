import { Navbar } from "./Navbar";

export function AppLayout({ children, userName, userImage }: { children: React.ReactNode; userName?: string | null; userImage?: string | null }) {
  return (
    <div className="min-h-screen bg-[#06060a]">
      <Navbar userName={userName} userImage={userImage} />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
