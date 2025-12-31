"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidateList from "./_components/CandidateList";

function InterviewDetail() {
  const { interview_id } = useParams();

  const [user, setUser] = useState(null);
  const [interviewDetail, setInterviewDetail] = useState(null);

  // 1️⃣ Get logged-in user (same as ScheduledInterview)
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("AUTH USER:", data?.user);
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // 2️⃣ Fetch interview only after user + interview_id exist
  useEffect(() => {
    console.log("DETAIL EFFECT TRIGGERED");
  console.log("USER:", user);
  console.log("INTERVIEW ID:", interview_id);
    if (!user || !interview_id) return;

    const getInterviewDetail = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select(`
          jobPosition,
          jobDescription,
          type,
          questionList,
          duration,
          interview_id,
          created_at,
          "interview-feedback" (
            feedback,
            userEmail,
            userName,
            created_at
          )
        `)
        .eq("userEmail", user.email)
        .eq("interview_id", interview_id)
        .single();

      console.log("INTERVIEW DETAIL DATA:", data);
      console.log("ERROR:", error);

      setInterviewDetail(data);
    };

    getInterviewDetail();
  }, [user, interview_id]);

  return (
    <div className=" max-w-5xl">
      <h2 className="font-bold text-2xl">Interview Detail</h2>

      {interviewDetail && (
        <InterviewDetailContainer interviewDetail={interviewDetail} />
      )}
      <CandidateList candidateList={interviewDetail?.['interview-feedback']|| []}/>
    </div>
  );
}

export default InterviewDetail;
