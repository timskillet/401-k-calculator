function Header() {
  return (
    <header className="border-b border-slate-200 bg-slate-500">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <h1 className="font-bold text-2xl text-slate-900">
            401(k) Contribution Planner
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
