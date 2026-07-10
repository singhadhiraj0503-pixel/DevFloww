"use client";

import { incrementViews } from "@/lib/actions/question.action";
import React, { useEffect } from "react";
import { toast } from "sonner";

const View = ({ questionId }) => {
  const handleIncrement = async () => {
    const result = await incrementViews({ questionId });

    if (result.success) {
      toast.success("Views Incremented");
    } else {
      toast.error(result.error?.message || "Failed");
    }
  };

  useEffect(() => {
    handleIncrement();
  }, []);

  return null;
};

export default View;
