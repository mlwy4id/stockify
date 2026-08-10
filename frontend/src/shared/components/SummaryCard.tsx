'use client';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader } from './ui/card';

type Props = {
  icon: LucideIcon;
  cardTitle: string;
  cardContent: string;
  stripColor: string;
  cardTitleColor?: string;
  cardContentColor?: string;
  footer?: ReactNode;
};

const SummaryCard = ({
  icon: Icon,
  cardTitle,
  cardContent,
  stripColor,
  cardTitleColor,
  cardContentColor,
  footer,
}: Props) => {
  return (
    <Card className="flex-row items-stretch gap-0 overflow-hidden bg-white p-0 min-h-30">
      <div className={`w-1.5 shrink-0 ${stripColor}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-2 py-4 pl-4 pr-5">
        <CardHeader className="p-0">
          <div className={cn('flex items-center gap-2 font-semibold', cardTitleColor)}>
            <Icon size={22} />
            {cardTitle}
          </div>
        </CardHeader>
        <CardContent className={cn('p-0 text-xl font-medium', cardContentColor)}>
          {cardContent}
        </CardContent>
        {footer && <div className="mt-auto flex flex-col gap-1">{footer}</div>}
      </div>
    </Card>
  );
};

export default SummaryCard;
