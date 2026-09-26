import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Dashboard</p>
        <h1 className="text-[28px] font-bold tracking-tight text-neutral-950 mb-2">Welcome back</h1>
        <p className="text-sm text-neutral-500 mb-8">You are logged in to Fydaa.</p>
        <Link
          href="/"
          className="inline-flex items-center h-12 px-6 rounded-xl bg-[#0C4A3E] text-white text-[15px] font-bold"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}
