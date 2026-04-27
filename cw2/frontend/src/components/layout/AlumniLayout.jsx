import Sidebar from "./Sidebar";

export default function AlumniLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="alumni" />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}