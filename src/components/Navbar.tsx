import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const link = (isActive: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`;

  return (
    <header className="border-b border-zinc-800">
      <div className="container mx-auto max-w-6xl flex items-center justify-between p-4">
        <Link to="/" className="font-semibold tracking-wide">
          13th Age Tracker
        </Link>
        <nav className="flex gap-2">
          <NavLink to="/" className={({ isActive }) => link(isActive)}>Home</NavLink>
          <NavLink to="/wizard" className={({ isActive }) => link(isActive)}>New Character</NavLink>
        </nav>
      </div>
    </header>
  );
}