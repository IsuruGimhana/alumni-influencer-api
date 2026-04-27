import Sidebar from "./Sidebar";

export default function DeveloperLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 bg-[#F3F2EF] min-h-screen">
        {children}
      </main>
    </div>
  );
}