import Routes from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";

const RightSidebar = () => {
  const hotQuestions = [
    {
      _id: "1",
      title: "How do I implement authentication in Next.js using Auth.js?",
    },
    {
      _id: "2",
      title:
        "What is the difference between Server Components and Client Components in Next.js?",
    },
    {
      _id: "3",
      title: "How can I optimize React application performance?",
    },
    {
      _id: "4",
      title: "What are the best practices for using MongoDB with Node.js?",
    },
    {
      _id: "5",
      title: "How does React Hook Form work with Zod validation?",
    },
  ];

  const popularTags = [
    {
      _id: "1",
      name: "javaScript",
      question: 1250,
    },
    {
      _id: "2",
      name: "react",
      question: 980,
    },
    {
      _id: "3",
      name: "next.js",
      question: 875,
    },
    {
      _id: "4",
      name: "typeScript",
      question: 1120,
    },
    {
      _id: "5",
      name: "node.js",
      question: 760,
    },
  ];

  return (
    <section className="pt-18 w-100 h-screen bg-gray-900 flex flex-col overflow-y-auto border-l max-lg:hidden">
      <div className="px-4">
        <h3 className="text-center mb-5 py-2 rounded text-xl bg-orange-500 text-white font-bold">
          Top Questions
        </h3>
        <div className="w-full flex flex-col gap-5">
          {hotQuestions.map(({ _id, title }) => {
            return (
              <Link
                key={_id}
                href={Routes.Profile(_id)}
                className="flex items-center gap-5 justify-between"
              >
                <p>{title}</p>
                <Image
                  src="/icons/chevron-right.svg"
                  width={20}
                  height={20}
                  alt="Chevron"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-4 border-t pt-2">
        <h3 className="text-lg text-center">Popular Tags</h3>
        <div className="flex flex-col gap-4 px-4 mt-2">
          {popularTags.map(({ _id, name, question }) => {
            return (
              <TagCard
                key={_id}
                _id={_id}
                name={name}
                question={question}
                showCount
                compact
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
