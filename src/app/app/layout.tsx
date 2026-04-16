"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, WifiOff, Wifi, User, Home, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 pb-20">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800">CheckHotel</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Online/Offline status badge */}
          <div className={cn(
             "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 text-xs font-semibold rounded-full border transition-colors",
             isOnline 
               ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
               : "bg-rose-50 text-rose-600 border-rose-200"
          )}>
            {isOnline ? (
              <><Wifi className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Online</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Offline</span></>
            )}
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
         {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 pb-safe">
        <div className="flex h-full max-w-md mx-auto relative">
          <Link 
            href="/app"
            className="flex-1 flex flex-col items-center justify-center gap-1 text-indigo-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Quartos</span>
          </Link>
          
          {session?.user?.role === "ADMIN" && (
            <Link 
              href="/admin"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Painel Admin</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
