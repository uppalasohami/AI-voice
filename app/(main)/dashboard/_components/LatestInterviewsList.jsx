"use client";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import InterviewCard from "../_components/InterviewCard";

export default function ScheduledInterview() {
  const [user, setUser] = useState(null);
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("AUTH USER:", data?.user);
      setUser(data?.user || null);
    };
    load();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchInterviews = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user.email)
        .order("id", { ascending: false });

      console.log("FETCHED INTERVIEWS:", data, error);
      setInterviewList(data || []);
    };

    fetchInterviews();
  }, [user]);
  useEffect(() => {
    if (user !== null) return; // only when no user

    const fetchAllInterviews = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .order("id", { ascending: false });

      console.log("FETCHED ALL INTERVIEWS (FALLBACK):", data, error);
      setInterviewList(data || []);
    };

    fetchAllInterviews();
  }, [user]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Scheduled Interviews</h2>

      {interviewList.length === 0 ? (
        <p>No interviews found</p>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {interviewList.map((i) => (
            <InterviewCard key={i.interview_id} interview={i} />
          ))}
        </div>
      )}
    </div>
  );
}
