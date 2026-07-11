import React, { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import Routes from "@/constants/routes";
import { getTimeStamp } from "@/lib/url";
import Preview from "../editor/Preview";
import Votes from "../votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
}) => {
  const hasVotedPromise = hasVoted({ targetId: _id, targetType: "answer" });

  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="" />

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
    </article>
  );
};

export default AnswerCard;
