
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Settings, LogOut, ChefHat } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const { isAdminAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">OrderDash</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant={pathname === '/' ? "default" : "ghost"} asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home size={18} /> <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          
          {isAdminAuthenticated ? (
            <>
              <Button variant={pathname === '/admin/dashboard' ? "default" : "ghost"} asChild>
                <Link href="/admin/dashboard" className="flex items-center gap-1">
                  <Settings size={18} /> <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
              <Button variant="ghost" onClick={logout} className="flex items-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button variant={pathname === '/admin/login' ? "default" : "ghost"} asChild>
              <Link href="/admin/login" className="flex items-center gap-1">
                <LogIn size={18} /> <span className="hidden sm:inline">Admin Login</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
