import Routes from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRender from "../DataRender";
import { getTopTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    // <section className="pt-18 w-100 h-screen bg-gray-900 flex flex-col overflow-y-auto border-l max-lg:hidden">
    <section
      className="
    sticky
    top-[80px]
    h-[calc(100vh-80px)]
    w-100
    bg-gray-900
    border-l
    overflow-y-auto
    max-lg:hidden
  "
    >
      <div className="px-4">
        <h3 className="text-center mb-5 py-2 rounded text-xl bg-orange-500 text-white font-bold">
          Top Questions
        </h3>

        {/* <div className="w-full flex flex-col gap-5">
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
        </div> */}

        <DataRender
          data={hotQuestions}
          empty={{
            title: "No questions Found",
            message: "No questions have been asked yet",
          }}
          success={success}
          error={error}
          render={(hotQuestions) => {
            return (
              <div className="w-full flex flex-col gap-5">
                {hotQuestions.map(({ _id, title }) => {
                  return (
                    <Link
                      key={_id}
                      href={Routes.Question(_id)}
                      className="flex items-center gap-5 justify-between"
                    >
                      <p className="line-clamp-2">{title}</p>
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
            );
          }}
        />
      </div>

      <div className="mt-4 border-t pt-2">
        <h3 className="text-lg text-center">Popular Tags</h3>

        <DataRender
          data={tags}
          empty={{
            title: "No tags Found",
            message: "No tags have been craeted yet",
          }}
          success={tagSuccess}
          error={tagError}
          // render={(hotQuestions) => {
          //   return (
          //     <div className="w-full flex flex-col gap-5">
          //       {hotQuestions.map(({ _id, title }) => {
          //         return (
          //           <Link
          //             key={_id}
          //             href={Routes.Question(_id)}
          //             className="flex items-center gap-5 justify-between"
          //           >
          //             <p className="line-clamp-2">{title}</p>
          //             <Image
          //               src="/icons/chevron-right.svg"
          //               width={20}
          //               height={20}
          //               alt="Chevron"
          //             />
          //           </Link>
          //         );
          //       })}
          //     </div>
          //   );
          // }}
          render={(tags) => {
            return (
              <div className="flex flex-col gap-4 px-4 mt-2">
                {tags.map(({ _id, name, question }) => {
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
            );
          }}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
