import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  GraduationCap,
  Gavel,
  UserCircle,
  Key,
  Trophy
} from "lucide-react";

const menus = {
  alumni: [
    { path: "/profile", label: "Profile", icon: UserCircle },
    { path: "/bidding", label: "Bidding", icon: Gavel }
  ],
  ar_app: [
    { path: "/alumni-of-day", label: "Alumni of the Day", icon: Trophy },
    { path: "/api-management", label: "API Management", icon: Key }
  ],
  dashboard: [
    { path: "/analytics", label: "System Analytics", icon: BarChart3 },
    { path: "/api-management", label: "API Management", icon: Key }
  ]
};

export default function Sidebar({ role }) {
  const location = useLocation();

  const linkClass = (path) => `
    flex items-center gap-3 p-3 rounded-lg transition
    ${location.pathname === path
      ? "bg-blue-600 text-white"
      : "hover:bg-slate-800 text-slate-300"}
  `;

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 fixed h-full flex flex-col">

      <div className="flex items-center gap-2 text-blue-400 font-bold text-2xl mb-10">
        <GraduationCap size={28} />
        UniStats
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-xs text-slate-500 mb-4 uppercase">Menu</p>

        {menus[role].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}