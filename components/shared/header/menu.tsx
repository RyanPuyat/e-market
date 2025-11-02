import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import Link from 'next/link';
import { ShoppingCartIcon } from 'lucide-react';
import MobileSheetMenu from './sheet-menu';
import UserButton from './user-button';
import { Session } from 'next-auth';

function Menu({ session }: { session: Session | null }) {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCartIcon /> Cart
          </Link>
        </Button>
        <UserButton session={session} />
      </nav>
      <nav className="md:hidden">
        <MobileSheetMenu session={session} />
      </nav>
    </div>
  );
}

export default Menu;
