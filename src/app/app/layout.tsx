"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, WifiOff, Wifi, User, Home, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { SyncIndicator } from "@/components/SyncIndicator";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();


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
          <SyncIndicator />
          
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
          
          <Link 
            href="/app/sync"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
              pathname === "/app/sync" ? "text-indigo-600" : "text-slate-400"
            )}
          >
            <RefreshCw className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Sincronia</span>
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
