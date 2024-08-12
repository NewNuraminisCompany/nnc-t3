import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Icon, Skull } from 'lucide-react';
import React from 'react';

import { soccerBall } from '@lucide/lab';


type AvvenimentoType = 'Goal' | 'Espulsione' | 'Ammonizione';

interface Avvenimento {
  idAvvenimento: string;
  tipo: AvvenimentoType;
  minuto: number;
  nomeGiocatore: string;
}

const getEventIcon = (tipo: AvvenimentoType) => {
  switch (tipo) {
    case 'Goal':
      return <Icon iconNode={soccerBall} className="h-4 w-4" />;
    case 'Ammonizione':
      return <AlertTriangle className="h-4 w-4" />;
    case 'Espulsione':
      return <Skull className="h-4 w-4" />;
  }
};

const getEventColor = (tipo: AvvenimentoType) => {
  switch (tipo) {
    case 'Goal':
      return 'bg-green-500';
    case 'Ammonizione':
      return 'bg-yellow-500';
    case 'Espulsione':
      return 'bg-red-500';
  }
};

interface AvvenimentiTimelineProps {
  avvenimenti: Avvenimento[];
}

const AvvenimentiTimeline: React.FC<AvvenimentiTimelineProps> = ({ avvenimenti }) => {
  const sortedAvvenimenti = [...avvenimenti].sort((a, b) => a.minuto - b.minuto);

  return (
    <div className="w-full max-w-md mx-auto pt-8">
        <div className="relative">
          {sortedAvvenimenti.map((evento, index) => (
            <div key={evento.idAvvenimento} className="mb-8 last:mb-0 pl-6 sm:pl-8 relative">
              <div className="absolute left-[1px] top-0 -ml-[5px] sm:-ml-[7px] w-[10px] sm:w-[14px] h-[10px] sm:h-[14px] rounded-full border-2 border-card">
                <div className={`w-full h-full rounded-full ${getEventColor(evento.tipo)}`} />
              </div>
              {index !== sortedAvvenimenti.length - 1 && (
                <div className="absolute left-0 top-[14px] bottom-[-32px] w-[2px] bg-muted-foreground" />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                <span className="text-sm font-semibold mr-2">{evento.minuto}&apos;</span>
                <Badge variant="outline" className="mt-1 sm:mt-0 w-fit">
                  {evento.nomeGiocatore}
                </Badge>
              </div>
              <Card className="w-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(evento.tipo)}
                    <span className="font-semibold">{evento.tipo}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
    </div>
  );
};

export default AvvenimentiTimeline;