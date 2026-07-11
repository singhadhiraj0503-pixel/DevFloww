"use client";

import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const Votes = ({ upvotes, downvotes, hasupVoted, hasdownVoted }) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setisLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (!userId) {
      return toast.error("Only Logged-in users can vote");
    }

    setisLoading(true);

    try {
      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasupVoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasdownVoted ? "added" : "removed"} successfully`;

      toast.success(successMessage);
    } catch (error) {
      return toast.error("Failed to Vote");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex flex-center gap-2.5">
      <div className="flex flex-center gap-1.5">
        <Image
          src={hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center min-w-5 rounded-sm p-1">
          <p className="text-sm">{formatNumber(upvotes)}</p>
        </div>
      </div>

      <div className="flex flex-center gap-1.5">
        <Image
          src={hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center min-w-5 rounded-sm p-1">
          <p className="text-sm">{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
