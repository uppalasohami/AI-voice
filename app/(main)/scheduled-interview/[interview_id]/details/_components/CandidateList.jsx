import { Button } from "@/components/ui/button";
import moment from "moment/moment";
import React from "react";

function CandidateList({ candidateList = [] }) {
  const uniqueCandidates = Object.values(
    candidateList.reduce((acc, candidate) => {
      acc[candidate.userEmail] = candidate;
      return acc;
    }, {})
  );

  return (
    <div>
      {uniqueCandidates.map((candidate) => (
        <div
          key={candidate.userEmail}
          className="flex items-center gap-3 p-4"
        >
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {candidate.userName?.charAt(0).toUpperCase()}
          </div> 
          <div>
          <h2 className="font-bold" >{candidate.userName}</h2>
          <h2 className="text-sm text-gray-500">Completed On:{moment(candidate?.created_at).format('MMM DD,YYYY')}</h2>
          </div>
          <div>
            <h2 className="text-green-500">6/10</h2>
          <Button variant="outline" className="text-primary">View Report</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidateList;
