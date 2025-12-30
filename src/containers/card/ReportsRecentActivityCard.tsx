import ActivityCard from '@/components/card/ActivityCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ReportsRecentActivityCard = () => {
  return (
    <Card className="h-screen">
      <CardHeader className="font-semibold font-xl flex items-end border-b">
        Recent Activity
      </CardHeader>
      <CardContent className="h-full">
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
      </CardContent>
    </Card>
  );
};

export default ReportsRecentActivityCard;
