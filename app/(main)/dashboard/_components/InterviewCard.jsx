"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview,viewDetail=false }) {
  const url=process.env.NEXT_PUBLIC_HOST_URL+"/"+interview?.interview_id
     const copyLink=()=>{
           navigator.clipboard.writeText(url);
           toast('Copied')
     }
     const onSend=()=>{
          window.location.href="mailto:account@.com?subject=AiCruiter Interview Link & body= Interview Link:"+url
     }
  return (
    <div className="p-5 bg-white rounded-lg border">
      
      {/* Top row: circle + date */}
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 bg-primary rounded-full"></div>
        <h2 className="text-sm text-gray-500">
          {moment(interview?.created_at).format("DD MMM YYYY")}
        </h2>
      </div>

      {/* Job title */}
      <h2 className="mt-3 font-bold text-lg">
        {interview?.jobPosition}
      </h2>

      {/* Duration */}
      <h2 className="mt-2 flex justify-between text-gray-500">
        {interview?.duration}
        <span className="text-green-700">{interview['interview-feedback']?.length}Candidates</span>
      </h2>


      {/* Buttons */}
      {!viewDetail?<div className="flex gap-3 mt-5">
        <Button variant="outline" onClick={copyLink}>
          <Copy className="h-4 w-4 mr-2"/>
          Copy Link
        </Button>

        <Button  onClick={onSend}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
      :
      <Link href={'/scheduled-interview/'+interview?.interview_id+"/details"}>
      <Button className="mt-5 w-full"variant="outline">View Detail<ArrowRight/></Button>
      </Link>
      }

    </div>
  );
}

export default InterviewCard;
