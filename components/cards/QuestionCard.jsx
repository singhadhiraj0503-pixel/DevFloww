import Routes from "@/constants/routes";
import { getTimeStamp } from "@/lib/url";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "../Metric";
import EditDeleteAction from "../user/EditDeleteAction";

const QuestionCard = ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views },
  showActionBtns = false,
}) => {
  return (
    <div className="w-full bg-gray-700 rounded">
      <div className="rounded flex items-center justify-center">
        <div className="w-full px-6 py-3">
          <span className="text-xsm opacity-70 max-sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={Routes.Question(_id)}>
            <h3 className="sm:font-bold hover:text-orange-500 text-lg">
              {title}
            </h3>
          </Link>
        </div>

        {showActionBtns && <EditDeleteAction type="Question" itemId={_id} />}
      </div>

      <div className="px-6 flex items-center">
        {tags.map((tag) => {
          return (
            <TagCard
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              compact
              className="text-white"
            />
          );
        })}
      </div>
      <div className="w-full px-6 mt-3 pb-3 flex items-center justify-between">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`asked ${getTimeStamp(createdAt)}`}
          href={Routes.Profile(author._id)}
          isAuthor
          titleStyles="max-sm:hidden"
        />
        <div className="flex items-center gap-3">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title="Votes"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title="Answers"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title="Views"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
