// src/components/MatchInfo.tsx
import Typography from "@/styles/common/Typography";
import React from "react";
import {
  MdOutlineSportsSoccer,
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
} from "react-icons/md";

interface MatchInfoProps {
  date: string;
  opponent: string;
  stadium: string;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ date, opponent, stadium }) => {
  return (
    <div className="inline-block bg-background p-6 rounded-xl border border-background shadow-sm w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-red-50 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-100">
          K LEAGUE 1
        </span>
      </div>

      <div className="space-y-2">
        <Typography
          variant="h4"
          color="text-textMain"
          className="flex items-center gap-3 font-bold!"
        >
          <MdOutlineCalendarToday className="text-primary text-xl" />
          {date}
        </Typography>

        <Typography
          variant="h4"
          color="text-textMain"
          className="flex items-center gap-3 font-bold!"
        >
          <MdOutlineSportsSoccer className="text-primary text-xl" />
          FC서울 VS {opponent}
        </Typography>

        <Typography
          variant="body-sm"
          color="text-textSub"
          className="flex items-center gap-3 font-medium!"
        >
          <MdOutlineLocationOn className="text-primary text-xl" />
          {stadium}
        </Typography>
      </div>
    </div>
  );
};

export default MatchInfo;
