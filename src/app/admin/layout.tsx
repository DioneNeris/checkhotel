"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  CheckSquare,
  LogOut,
  Hotel,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.requiresNewPassword && pathname !== "/auth/new-password") {
      router.push("/auth/new-password");
    }
  }, [session, status, pathname, router]);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
    { name: "Camareiras", href: "/admin/camareiras", icon: ShieldCheck },
    { name: "Quartos", href: "/admin/quartos", icon: Hotel },
    { name: "Checklist", href: "/admin/checklist", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar flex flex-col transition-all duration-300 lg:static lg:translate-x-0 border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-24 shrink-0 items-center gap-x-3 px-8 border-b border-white/5 relative group">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent shadow-[0_0_20px_rgba(var(--accent),0.3)] transition-transform group-hover:scale-105 duration-500">
            <Building className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold text-sidebar-foreground tracking-tight leading-none">
              CheckHotel
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mt-1">
              Elite Management
            </span>
          </div>
          {/* Accent Gold Line */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>

        <nav className="flex flex-1 flex-col px-4 pt-8 pb-4 overflow-y-auto">
          <div className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const isExactActive = pathname === "/admin" && item.href === "/admin";
              const isReallyActive = item.href === "/admin" ? isExactActive : isActive;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300",
                    isReallyActive
                      ? "bg-sidebar-accent text-sidebar-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/5"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-300",
                      isReallyActive 
                        ? "text-sidebar-primary scale-110" 
                        : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isReallyActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-x-4 px-4 py-4 mb-6 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-all duration-300">
              <Avatar className="h-10 w-10 border border-accent/20">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-primary font-bold">
                  {session?.user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {session?.user?.name}
                </span>
                <span className="text-[11px] text-sidebar-foreground/40 truncate">
                  {session?.user?.email}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full justify-start gap-x-3 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-x-4 border-b border-border bg-background/80 backdrop-blur-xl px-6 lg:hidden">
          <button
            type="button"
            className="p-2 text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="font-serif font-bold text-lg tracking-tight">CheckHotel</div>
          <div className="w-10" />
        </div>

        <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-12">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
