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
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
    { name: "Camareiras", href: "/admin/camareiras", icon: ShieldCheck },
    { name: "Quartos", href: "/admin/quartos", icon: Hotel },
    { name: "Checklist", href: "/admin/checklist", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 border-r border-slate-800",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 shrink-0 items-center gap-x-3 px-6 border-b border-white/5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 shadow-md shadow-emerald-500/20">
            <Building className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-emerald-200">
            Admin Panel
          </span>
        </div>

        <nav className="flex flex-1 flex-col px-4 pt-6 pb-4 overflow-y-auto">
          <div className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              // Fix active state for Dashboard exactly
              const isExactActive = pathname === "/admin" && item.href === "/admin";
              const isReallyActive = item.href === "/admin" ? isExactActive : isActive;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isReallyActive
                      ? "bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/5"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                    "group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-all"
                  )}
                >
                  <item.icon
                    className={cn(
                      isReallyActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white",
                      "h-5 w-5 shrink-0 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-x-4 px-3 py-3 mb-4 rounded-xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-inner">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-semibold text-white truncate">
                  {session?.user?.name}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {session?.user?.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="group flex w-full items-center gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              Sair
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-slate-200 bg-white/50 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="font-semibold text-slate-800">Admin Panel</div>
          <div className="w-6" /> {/* Placeholder for balance */}
        </div>

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
