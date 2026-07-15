import React, { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import Routes from "@/constants/routes";
import { getTimeStamp } from "@/lib/url";
import Preview from "../editor/Preview";
import Votes from "../votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn } from "@/lib/utils";
import EditDeleteAction from "../user/EditDeleteAction";

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
}) => {
  const hasVotedPromise = hasVoted({ targetId: _id, targetType: "answer" });

  return (
    <article
      className={cn("light-border border-b py-10 relative", containerClasses)}
    >
      <span id={`answer-${_id}`} className="" />

      {showActionBtns && (
        <div className="flex items-center justify-center absolute -right-2 -top-5 size-9 rounded-full">
          <EditDeleteAction type="Answer" itemId={_id} />
        </div>
      )}

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-2 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-0.5"
          />

          <Link
            href={Routes.Question(author._id)}
            className="flex flex-col sm:flex-row sm:items-center"
          >
            <p className="font-semibold">{author.name ?? "Anonymous"}</p>

            <p className="ml-0.5 mt-0.5 line-clamp-1 opacity-60">
              <span className="max-sm:hidden mr-3">.</span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upvotes={upvotes}
              // hasupVoted={true}
              downvotes={downvotes}
              // hasdownVotes={false}
              hasVotedPromise={hasVotedPromise}
              targetId={_id}
              targetType="answer"
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="font-semibold relative z-10 text-orange-500"
        >
          <p className="mt-1">Read More...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
