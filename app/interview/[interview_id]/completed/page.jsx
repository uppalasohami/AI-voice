"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

function InterviewComplete() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9422/9422689.png"
            alt="Interview Complete"
            width={200}
            height={200}
            className="rounded-lg mx-auto"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle2 className="text-green-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">Interview Complete!</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Great job completing your interview 🎉 <br />
        </p>

        <Button
          onClick={() => router.push("/")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default InterviewComplete;
