'use client';

import Link from 'next/link';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { Session } from 'next-auth';

export default function UserButton({ session }: { session: Session | null }) {
  const userEmail = session?.user?.email ?? '';
  const userName = session?.user?.name ?? '';

  if (!session || !session.user) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon className="mr-2" /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toLocaleUpperCase() ?? '';

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-md"
          >
            {/* <UserIcon className="mr-2" /> */}
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium leading-none">{userName}</div>
              <div className="text-sm text-muted-foreground leading-none">
                {userEmail}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/user/orders" className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => signOutUser()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
  {
    /* // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="ghost">
    //       <UserIcon className="mr-2" />
    //       {firstInitial}
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent>
    //     <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
    //     <DropdownMenuItem asChild>
    //       <Link href="/profile">Profile</Link>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => signOutUser()}>
    //       Sign Out
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu> */
  }
}
