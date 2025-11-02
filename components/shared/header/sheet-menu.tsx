'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { EllipsisVertical, ShoppingCartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import Link from 'next/link';
import { useMediaQuery } from '@/components/shared/header/useMediaQuery';
import UserButton from './user-button';
import { Session } from 'next-auth';

export default function MobileSheetMenu({
  session,
}: {
  session: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const isMdUp = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (isMdUp) setOpen(false);
  }, [isMdUp]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="align-middle">
        <EllipsisVertical />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-start">
        <SheetTitle className="p-2">Menu</SheetTitle>
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCartIcon /> Cart
          </Link>
        </Button>
        <UserButton session={session} />
        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
}
