import QuestionCard from "@/components/cards/QuestionCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { CollectionFilters } from "@/constants/filters";
import Routes from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/state";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";

const Collection = async ({ searchParams }) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collection, isNext } = data || {};

  return (
    <>
      <h1 className="text-2xl mt-4">Saved Questions</h1>

      <div className="w-full flex gap-5 mt-5 max-sm:flex max-sm:flex-col">
        <LocalSearch
          route={Routes.Collection}
          imgSrc="/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1"
          iconPosition="left"
        />

        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[20px] sm:min-w-[170px]"
        />
      </div>
      {/* <HomeFilter /> */}

      <DataRender
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTION}
        render={(collection) => (
          <div className="w-full flex flex-col gap-3 mt-4">
            {collection.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />

      {/* {success ? (
        <div className="w-full flex flex-col gap-5 mt-5">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          ) : (
            <div className="w-full mt-10 flex justify-center items-center">
              <p className="font-bold text-4xl">No questions Found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full mt-10 flex justify-center items-center">
          <p className="font-bold italic text-xl">
            {error?.message || "Failed to fetch questions"}
          </p>
        </div>
      )} */}
    </>
  );
};

export default Collection;
