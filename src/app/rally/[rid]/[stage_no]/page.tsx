
import * as React from 'react';
import type { RallyFromApi, ItineraryItem, RallyData } from '@/lib/types';
import RallyStageClientPage from '@/components/RallyStageClientPage';


export async function generateStaticParams() {
    try {
        const response = await fetch('https://www.rallylive.net/wp-json/rally/v1/live-results?limit=15');
        if (!response.ok) {
            console.error("Failed to fetch rallies for static generation");
            return [];
        }
        const rallies: RallyFromApi[] = await response.json();
        
        const allRallyStages = await Promise.all(rallies.map(async (rally) => {
            try {
                const itineraryResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rally.rid}`);
                 if (!itineraryResponse.ok) {
                    return [];
                }
                const itinerary: ItineraryItem[] = await itineraryResponse.json();

                return itinerary
                    .filter(item => parseInt(item.no, 10) > 0) // Only return actual stages
                    .map(stage => ({
                        rid: rally.rid,
                        stage_no: stage.no,
                    }));

            } catch (error) {
                 console.error(`Failed to fetch itinerary for rally ${rally.rid}`, error);
                 return [];
            }
        }));

        return allRallyStages.flat();

    } catch (error) {
        console.error("Error in generateStaticParams for rally stages:", error);
        return [];
    }
}

async function getRallyData(rid: string, stage_no: string): Promise<RallyData> {
    try {
        const classParam = ''; // Static generation won't have class filter

        const [stageResultsResponse, overallResultsResponse, itineraryResponse, categoriesResponse, rallyNameResponse] = await Promise.all([
          fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}${classParam}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}${classParam}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rid}`),
          fetch(`https://www.rallylive.net/mobileapp/v1/json-categories.php?rid=${rid}`),
          fetch(`https://www.rallylive.net/wp-json/rally/v1/live-results?rid=${rid}`)
        ]);

        const stageResults = stageResultsResponse.ok ? await stageResultsResponse.json() : [];
        const overallResults = overallResultsResponse.ok ? await overallResultsResponse.json() : [];
        const itinerary = itineraryResponse.ok ? await itineraryResponse.json() : [];
        const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
        
        let rallyName = '';
        if(rallyNameResponse.ok) {
            const data = await rallyNameResponse.json();
            if (data.length > 0) {
              rallyName = data[0].title;
            }
        }
        
        const currentStageInfo = itinerary.find((e: ItineraryItem) => e.no === stage_no);
        const stageName = currentStageInfo ? `SS${stage_no} ${currentStageInfo.name}` : `SS${stage_no}`;
        
        return {
            stageResults,
            overallResults,
            stageName,
            rallyName,
            categories,
            initialParams: { rid, stage_no }
        };

    } catch (error) {
        console.error("Failed to fetch rally data:", error);
        return {
            stageResults: [],
            overallResults: [],
            stageName: `SS${stage_no}`,
            rallyName: '',
            categories: [],
            initialParams: { rid, stage_no }
        };
    }
}

export default async function RallyStagePage({ params }: { params: { rid: string, stage_no: string } }) {
    const data = await getRallyData(params.rid, params.stage_no);
    return <RallyStageClientPage initialData={data} />;
}
