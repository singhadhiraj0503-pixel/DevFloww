import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filter/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import Routes from "@/constants/routes";
import handleError from "@/lib/error";
import dbConnect from "@/lib/mongoose";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: "1",
    title: "How to learn NextJS ?",
    description: "I want to learn NextJS, can anyone help me ?",
    tags: [
      {
        _id: "1",
        name: "NextJS",
      },
      {
        _id: "2",
        name: "Javascript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
    },
    upvotes: 10,
    answers: 5,
    views: 5,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn React ?",
    description: "I want to learn React, can anyone help me ?",
    tags: [
      {
        _id: "1",
        name: "React",
      },
      {
        _id: "2",
        name: "Javascript",
      },
    ],
    author: {
      _id: "1",
      name: "Johnny Doe",
      image:
        "https://img.magnific.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_hybrid&w=740&q=80",
    },
    upvotes: 15,
    answers: 5,
    views: 105,
    createdAt: new Date(),
  },
];

const test = async () => {
  try {
    await dbConnect();
  } catch (error) {
    return handleError(error);
  }
};

const Home = async ({ searchParams }) => {
  await test();
  const { query = "", filter = "" } = await searchParams;

  // const filteredQuestions = questions.filter((question) => {
  //   return question.title.toLowerCase().includes(query?.toLowerCase());
  // });

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesFilter =
      !filter ||
      question.tags.some(
        (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
      );

    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="w-full flex items-center justify-between">
        <h1 className="text-2xl mt-4">All Questions</h1>
        <Button
          asChild
          className="bg-orange-500 text-white text-lg rounded active:scale-95 cursor-pointer font-bold"
        >
          <Link className="" href={Routes.ask_question}>
            Ask a question
          </Link>
        </Button>
      </section>
      <section className="w-full flex flex-col gap-5 mt-5">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="w-full flex flex-col gap-5 mt-5">
        {filteredQuestions.map((question) => {
          return <QuestionCard key={question._id} question={question} />;
        })}
      </div>
    </>
  );
};

export default Home;
