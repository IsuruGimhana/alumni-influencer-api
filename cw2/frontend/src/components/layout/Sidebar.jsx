import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

import {
  User,
  TrendingUp,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";


export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const role = user?.role;
  const hasProfile = !!profile;

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-50 text-blue-700 font-medium"
      : "text-gray-700 hover:bg-gray-100";

  const linkClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition";

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed w-full z-50">
        <h1 className="font-bold text-gray-800">Alumni System</h1>

        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:sticky md:top-0 z-50
          w-64 h-screen
          bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Alumni System
          </h1>

          {/* CLOSE BTN (mobile only) */}
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* NAV */}
        <div className="flex-1 p-4 space-y-2">

          {/* ALUMNI */}
          {role === "alumni" && (
            <>
              {!hasProfile && (
                <Link
                  to="/alumni/setup"
                  onClick={() => setOpen(false)}
                  className={`${linkClass} ${isActive("/alumni/setup")}`}
                >
                  <Settings size={18} />
                  Setup Profile
                </Link>
              )}

              {hasProfile && (
                <>
                  <Link
                    to="/alumni/profile"
                    onClick={() => setOpen(false)}
                    className={`${linkClass} ${isActive("/alumni/profile")}`}
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  <Link
                    to="/alumni/bidding"
                    onClick={() => setOpen(false)}
                    className={`${linkClass} ${isActive("/alumni/bidding")}`}
                  >
                    <TrendingUp size={18} />
                    Bidding
                  </Link>
                </>
              )}
            </>
          )}

          {/* DEVELOPER */}
          {role === "developer" && (
            <Link
              to="/developer/api-keys"
              onClick={() => setOpen(false)}
              className={`${linkClass} ${isActive("/developer/api-keys")}`}
            >
              <Settings size={18} />
              API Keys
            </Link>
          )}

          {/* DASHBOARD */}
          {role === "dashboard" && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={`${linkClass} ${isActive("/dashboard")}`}
              >
                <LayoutDashboard size={18} />
                Analytics
              </Link>

              <Link
                to="/dashboard/directory"
                onClick={() => setOpen(false)}
                className={`${linkClass} ${isActive("/dashboard/directory")}`}
              >
                <User size={18} />
                Alumni Directory
              </Link>
            </>
          )}
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}