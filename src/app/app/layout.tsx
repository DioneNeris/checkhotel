"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, RefreshCw, Bed, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
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
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 pb-24 font-sans">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tighter leading-none">CheckHotel</span>
            <span className="text-[7px] font-black text-blue-600 uppercase tracking-widest leading-none mt-0.5">Mobile Access</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <SyncIndicator />
          <div className="h-4 w-px bg-slate-200" />
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-lg mx-auto px-5 py-6">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-40 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex h-full max-w-md mx-auto items-center px-4">
          <Link 
            href="/app"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all",
              pathname === "/app" || pathname.startsWith("/app/vistoria") ? "text-blue-600" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              (pathname === "/app" || pathname.startsWith("/app/vistoria")) ? "bg-blue-50" : ""
            )}>
              <Bed className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Unidades</span>
          </Link>
          
          <Link 
            href="/app/sync"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all",
              pathname === "/app/sync" ? "text-blue-600" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              pathname === "/app/sync" ? "bg-blue-50" : ""
            )}>
              <RefreshCw className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Sincronia</span>
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link 
              href="/admin"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-600 transition-all"
            >
              <div className="p-2 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Painel</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
