'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { EllipsisVertical, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import Link from 'next/link';
import { useMediaQuery } from '@/components/shared/header/useMediaQuery';

export default function MobileSheetMenu() {
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
        <Button asChild className="ml-2">
          <Link href="/signin">
            <UserIcon /> Sign In
          </Link>
        </Button>
        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
}
