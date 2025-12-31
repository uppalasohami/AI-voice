"use client"
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { Video } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard';

function AllInterview() {
 const [interviewList, setInterviewList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };
    loadUser();
  }, []);

  // ✅ Fetch interviews
  useEffect(() => {
    if (!user) return;

    const GetInterviewList = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user.email) // ⚠️ confirm column name
        .order('id',{ascending:false});
        
        

      console.log("Fetched Interviews:", data, error);
       if (!error) {
    setInterviewList(data || []);
  }
    };
     

    GetInterviewList();
  }, [user]);
  console.log("RENDER interviewList length:", interviewList.length);
  


  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl"> All Previously Created Interviews</h2>

      {/* 🔴 NOT LOGGED IN */}
      {!user && !loading && (
        <div className="p-5 text-center text-gray-500">
          Please login to see your interviews
        </div>
      )}

      {/* 🟡 LOADING */}
      {loading && (
        <div className="p-5 text-gray-500">Loading interviews...</div>
      )}

      {/* 🟢 EMPTY STATE */}
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
          {interviewList.map((interview, index) => (
          <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}


export default AllInterview