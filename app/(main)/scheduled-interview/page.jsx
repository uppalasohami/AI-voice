"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterviewCard from "../dashboard/_components/InterviewCard";

function ScheduledInterview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const[interviewList,setInterviewList]=useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("AUTH USER:", data?.user);
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const getInterviewList = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select(`
          jobPosition,
          duration,
          interview_id,
          "interview-feedback" (
            feedback,
            userEmail
          )
        `)
        .eq("userEmail", user.email)
        .order("id", { ascending: false });

      console.log("SCHEDULED INTERVIEWS WITH FEEDBACK:", data);
      console.log("ERROR:", error);
      setInterviewList(data||[]);
    };

    getInterviewList();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold">Interview List with Candidate Feedback</h2>
      {user && interviewList.length === 0 && !loading && (
        <div className="p-5 flex flex-col gap-3 items-center mt-5">
          <Video className="h-10 w-10 text-primary" />
          <h2>You don't have any interviews created!</h2>
          <Button>+ Create New Interview</Button>
        </div>
      )}

      {/* 🔵 LIST */}
      {interviewList.length > 0 && (
        <div className="grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5 ">
          {interviewList?.map((interview, index) => (
          <InterviewCard interview={interview} key={index}
          viewDetail={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
