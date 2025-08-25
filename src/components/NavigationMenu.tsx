
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, LogIn, Bell, Calendar, History, FileText } from 'lucide-react';

export default function NavigationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/" passHref>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            <span>Live Rallies</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/calendar" passHref>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/impressum" passHref>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Impressum</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/push" passHref>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/login" passHref>
          <DropdownMenuItem>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
