
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, LogIn, Bell, Calendar, History, FileText, Home, Loader2, ChevronRight } from 'lucide-react';
import type { RallyFromApi, LastStageFromApi, LiveRallyMenuItem } from '@/lib/types';


export default function NavigationMenu() {
    const [liveRallies, setLiveRallies] = React.useState<LiveRallyMenuItem[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchLiveRallies() {
            try {
                const response = await fetch('https://www.rallylive.net/wp-json/rally/v1/live-results?limit=5');
                const data: RallyFromApi[] = await response.json();

                const rallyPromises = data.map(async (rally) => {
                    let link = `/rally/${rally.rid}`;
                    if (rally.rid) {
                        try {
                            const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rally.rid}`);
                            if (stageResponse.ok) {
                                const stageData: LastStageFromApi = await stageResponse.json();
                                if (stageData?.sonEtap && stageData.sonEtap !== '0') {
                                    link = `/rally/${rally.rid}/${stageData.sonEtap}`;
                                } else {
                                    link = `/rally/${rally.rid}/1`;
                                }
                            }
                        } catch (e) {
                            console.error(`Failed to fetch stage for rally ${rally.rid}`, e);
                        }
                    }
                    return { id: rally.rid, name: rally.title, link };
                });
                
                const rallies = await Promise.all(rallyPromises);
                setLiveRallies(rallies);

            } catch (error) {
                console.error("Failed to fetch live rallies for menu", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLiveRallies();
    }, []);

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
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <History className="mr-2 h-4 w-4" />
                <span>Live Rallies</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {loading ? (
                         <DropdownMenuItem disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                        </DropdownMenuItem>
                    ) : liveRallies.length > 0 ? (
                        liveRallies.map(rally => (
                            <Link href={rally.link} key={rally.id} passHref>
                                <DropdownMenuItem>
                                    <ChevronRight className="mr-2 h-4 w-4" />
                                    {rally.name}
                                </DropdownMenuItem>
                            </Link>
                        ))
                    ) : (
                         <DropdownMenuItem disabled>No live rallies</DropdownMenuItem>
                    )}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
        <Link href="/calendar" passHref>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
        </Link>
         <Link href="/push" passHref>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/impressum" passHref>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Impressum</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
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
