'use client';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import SoftwareHouseButton from "@/components/SoftwareHouseButton";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || 
                      pathname?.startsWith('/admin') || 
                      pathname?.startsWith('/orders') ||
                      pathname === '/login' ||
                      pathname === '/signup';

  return (
    <>
      <TechBackground />
      {!isDashboard && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
      <WhatsAppButton />
      {!isDashboard && <SoftwareHouseButton />}
    </>
  );
}
