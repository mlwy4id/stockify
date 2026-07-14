'use client';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';

type Props = {
  icon: LucideIcon;
  cardTitle: string;
  cardContent: string;
  cardTitleColor?: string;
  cardContentColor?: string;
  cardBgColor: string;
};

const SummaryCard = ({
  icon: Icon,
  cardTitle,
  cardContent,
  cardTitleColor,
  cardContentColor,
  cardBgColor,
}: Props) => {
  return (
    <Card className={`${cardBgColor}`}>
      <CardHeader className={`font-medium ${cardTitleColor}`}>
        <div className="flex items-center gap-2">
          <Icon size={22} />
          {cardTitle}
        </div>
      </CardHeader>
      <CardContent className={`${cardContentColor} text-xl font-medium`}>{cardContent}</CardContent>
    </Card>
  );
};

export default SummaryCard;
