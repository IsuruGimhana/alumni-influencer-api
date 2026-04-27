import Sidebar from "./Sidebar";

export default function ArAppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="ar_app" />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}