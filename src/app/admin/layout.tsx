"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Bed, 
  CheckSquare, 
  LayoutDashboard, 
  LogOut,
  ChevronLeft,
  Settings,
  Bell,
  Search,
  Menu,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Colaboradores", href: "/admin/usuarios" },
  { icon: Bed, label: "Unidades", href: "/admin/quartos" },
  { icon: CheckSquare, label: "Checklist", href: "/admin/checklist" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar: Clean Modern Design */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                   <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                   <span className="font-black text-slate-800 text-lg tracking-tighter">CheckHotel</span>
                )}
             </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-3 border-t border-slate-100 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
               <Settings className="w-5 h-5" />
               {!collapsed && <span>Configurações</span>}
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Sair do Sistema</span>}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
        >
          <ChevronLeft className={cn("w-4 h-4 text-slate-400 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        collapsed ? "ml-20" : "ml-64"
      )}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Buscar em todo o sistema..." 
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                 />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-slate-100 mx-2" />
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">Admin</p>
                    <Badge variant="outline" className="text-[9px] h-4 font-black bg-blue-50 text-blue-600 border-none">GESTOR</Badge>
                 </div>
                 <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-white shadow-sm" />
              </div>
           </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
