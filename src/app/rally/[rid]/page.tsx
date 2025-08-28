
import * as React from 'react';
import type { RallyFromApi, LastStageFromApi } from '@/lib/types';
import RallyClientPage from '@/components/RallyClientPage';

export async function generateStaticParams() {
    try {
        const response = await fetch('https://www.rallylive.net/wp-json/rally/v1/live-results?limit=15');
        if (!response.ok) {
            console.error("Failed to fetch rallies for static generation");
            return [];
        }
        const rallies: RallyFromApi[] = await response.json();
        return rallies.map((rally) => ({
            rid: rally.rid,
        }));
    } catch (error) {
        console.error("Error in generateStaticParams for rallies:", error);
        return [];
    }
}

async function getRallyInfo(rid: string): Promise<{ rally: RallyFromApi | null; rallyDate: string | null }> {
    try {
        const rallyResponse = await fetch(`https://www.rallylive.net/wp-json/rally/v1/live-results?rid=${rid}`);
        if (!rallyResponse.ok) throw new Error('Failed to fetch rally details');
        
        const rallyData: RallyFromApi[] = await rallyResponse.json();
        const rally = rallyData.length > 0 ? rallyData[0] : null;

        let rallyDate = null;
        const stageResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-sonetap.php?rid=${rid}`);
        if (stageResponse.ok) {
            const stageData: LastStageFromApi = await stageResponse.json();
            rallyDate = stageData.tarih;
        }

        return { rally, rallyDate };

    } catch(error) {
        console.error(`Failed to fetch rally info for ${rid}:`, error);
        return { rally: null, rallyDate: null };
    }
}


export default async function RallyPage({ params }: { params: { rid: string } }) {
    const { rally, rallyDate } = await getRallyInfo(params.rid);
    return <RallyClientPage initialRally={rally} initialRallyDate={rallyDate} />;
}
