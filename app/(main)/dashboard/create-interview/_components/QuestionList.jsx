"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/services/supabaseClient";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      const Content = result?.data?.content || "";
      const FINAL_CONTENT = Content.replace("```json", "")
        .replace("```", "")
        .trim();

      setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions || []);
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast("Server Error, Try Again!");
      setLoading(false);
    }
  };

  // 🔥 FINAL FIX IS HERE
  const onFinish = async () => {
    setSaveLoading(true);

    // ✅ ALWAYS get logged-in user directly from Supabase
    const { data: authData, error: authError } =
      await supabase.auth.getUser();
    const authUser = authData?.user;

    if (!authUser?.email) {
      toast("User not logged in. Please login again.");
      setSaveLoading(false);
      return;
    }

    const interview_id = uuidv4();

    const { error } = await supabase.from("Interviews").insert([
      {
        ...formData,
        questionList: questionList,
        interview_id: interview_id,
        userEmail: authUser.email, // ✅ GUARANTEED EMAIL
      },
    ]);

    setSaveLoading(false);

    if (error) {
      console.error(error);
      toast("Failed to save interview");
      return;
    }

    onCreateLink(interview_id);
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions based on your job
              position
            </p>
          </div>
        </div>
      )}

      {questionList.length > 0 && (
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}

      <div className="flex justify-end mt-10">
        <Button onClick={onFinish} disabled={saveLoading}>
          {saveLoading && <Loader2 className="animate-spin mr-2" />}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
