"use client";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";
import { toast } from "sonner";

const Votes = ({
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasVotedPromise,
  targetId,
  targetType,
}) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { success, data } = use(hasVotedPromise);

  const [isLoading, setisLoading] = useState(false);

  const { hasUpvoted, hasDownvoted } = data || {};

  const handleVote = async (voteType) => {
    if (!userId) {
      return toast.error("Only Logged-in users can vote");
    }

    setisLoading(true);

    try {
      const result = await createVote({ targetId, targetType, voteType });

      if (!result.success) {
        return toast.error(result.error?.message || "Failed to Vote");
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

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
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
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
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
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
