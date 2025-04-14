
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const Navbar = ({ isLoggedIn, onLogin }: NavbarProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, you'd clear auth state here
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-laundry-500"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 8a2 2 0 0 0-2 2" />
                <circle cx="12" cy="12" r="4" />
                <path d="m16 16-1-1" />
              </svg>
              <span className="ml-2 text-xl font-bold text-laundry-700">WashWise</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
          <Link to="/booking" className="transition-colors hover:text-foreground/80 text-foreground/60">Book a Slot</Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          {!isLoggedIn ? (
            <Button onClick={onLogin} className="bg-laundry-500 hover:bg-laundry-600">
              Log In
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex-1 flex justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <SheetClose asChild>
                  <Link to="/" className="block py-2 text-lg font-medium">Home</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/booking" className="block py-2 text-lg font-medium">Book a Slot</Link>
                </SheetClose>
                {isLoggedIn && (
                  <SheetClose asChild>
                    <Link to="/dashboard" className="block py-2 text-lg font-medium">Dashboard</Link>
                  </SheetClose>
                )}
                {!isLoggedIn ? (
                  <Button onClick={() => { onLogin(); }} className="bg-laundry-500 hover:bg-laundry-600 mt-4">
                    Log In
                  </Button>
                ) : (
                  <Button onClick={handleLogout} variant="destructive" className="mt-4">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
