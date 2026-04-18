"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, WifiOff, Wifi, User, Home, CheckCircle2, RefreshCw, Bed } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { SyncIndicator } from "@/components/SyncIndicator";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.requiresNewPassword && pathname !== "/auth/new-password") {
      router.push("/auth/new-password");
    }
  }, [session, status, pathname, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 pb-24">
      {/* Top Navbar: Hospitality Elite Style */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border/50 z-40 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-serif font-black text-foreground tracking-tighter leading-none">CheckHotel</span>
            <span className="text-[8px] font-bold text-accent uppercase tracking-widest leading-none">Elite Service</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <SyncIndicator />
          <div className="h-4 w-px bg-border/50" />
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area with Entry Animation */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation: Premium Mobile Experience */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/90 backdrop-blur-xl border-t border-border/50 z-40 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex h-full max-w-md mx-auto items-center px-4">
          <Link 
            href="/app"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
              pathname === "/app" || pathname.startsWith("/app/vistoria") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              (pathname === "/app" || pathname.startsWith("/app/vistoria")) ? "bg-primary/10" : ""
            )}>
              <Bed className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Unidades</span>
            {(pathname === "/app" || pathname.startsWith("/app/vistoria")) && (
              <motion.div layoutId="nav-pill" className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
          
          <Link 
            href="/app/sync"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
              pathname === "/app/sync" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              pathname === "/app/sync" ? "bg-primary/10" : ""
            )}>
              <RefreshCw className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Sincronia</span>
            {pathname === "/app/sync" && (
              <motion.div layoutId="nav-pill" className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link 
              href="/admin"
              className="flex-1 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <div className="p-1.5 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
