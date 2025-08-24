import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="container mx-auto max-w-6xl p-4 flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 py-4 text-xs text-zinc-400 text-center">
        13th Age Character Tracker — v0.1
      </footer>
    </div>
  );
}