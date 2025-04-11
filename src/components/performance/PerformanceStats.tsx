
import React, { useMemo } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PromotorStats {
  promoterId: string;
  promoterName: string;
  totalGuests: number;
  arrivedGuests: number;
  arrivalRate: number;
}

const PerformanceStats: React.FC<{ date?: Date }> = ({ date }) => {
  const { guestLists } = useGuestLists();
  
  const promoterStats = useMemo(() => {
    let filteredLists = guestLists;
    
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      filteredLists = guestLists.filter(list => 
        new Date(list.eventDate).toISOString().split('T')[0] === dateStr
      );
    }
    
    const promoterMap = new Map<string, PromotorStats>();
    
    filteredLists.forEach(list => {
      const { promoterId, promoterName, guests } = list;
      const totalGuests = guests.length;
      const arrivedGuests = guests.filter(g => g.arrived).length;
      
      if (promoterMap.has(promoterId)) {
        const existing = promoterMap.get(promoterId)!;
        existing.totalGuests += totalGuests;
        existing.arrivedGuests += arrivedGuests;
        existing.arrivalRate = existing.totalGuests > 0 
          ? (existing.arrivedGuests / existing.totalGuests) * 100
          : 0;
      } else {
        promoterMap.set(promoterId, {
          promoterId,
          promoterName,
          totalGuests,
          arrivedGuests,
          arrivalRate: totalGuests > 0 ? (arrivedGuests / totalGuests) * 100 : 0
        });
      }
    });
    
    return Array.from(promoterMap.values())
      .sort((a, b) => b.totalGuests - a.totalGuests);
  }, [guestLists, date]);
  
  const totalStats = useMemo(() => {
    const totalGuests = promoterStats.reduce((sum, p) => sum + p.totalGuests, 0);
    const arrivedGuests = promoterStats.reduce((sum, p) => sum + p.arrivedGuests, 0);
    const arrivalRate = totalGuests > 0 ? (arrivedGuests / totalGuests) * 100 : 0;
    
    return { totalGuests, arrivedGuests, arrivalRate };
  }, [promoterStats]);

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>
            {date 
              ? `Stats for ${date.toLocaleDateString()}`
              : "Stats for all events"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="stats-card flex-1">
              <h3 className="text-lg font-medium">Total Guests</h3>
              <p className="text-3xl font-bold">{totalStats.totalGuests}</p>
            </div>
            <div className="stats-card flex-1">
              <h3 className="text-lg font-medium">Arrived Guests</h3>
              <p className="text-3xl font-bold">{totalStats.arrivedGuests}</p>
            </div>
            <div className="stats-card flex-1">
              <h3 className="text-lg font-medium">Arrival Rate</h3>
              <p className="text-3xl font-bold">{Math.round(totalStats.arrivalRate)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Promoter Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {promoterStats.length > 0 ? (
              promoterStats.map((promoter) => (
                <div key={promoter.promoterId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{promoter.promoterName}</h3>
                    <div className="text-sm text-muted-foreground">
                      {promoter.arrivedGuests} / {promoter.totalGuests} arrived
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Progress
                      value={Math.round(promoter.arrivalRate)}
                      className="h-2 flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {Math.round(promoter.arrivalRate)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No promoter performance data available.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceStats;
