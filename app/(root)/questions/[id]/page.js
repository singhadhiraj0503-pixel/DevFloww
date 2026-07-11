import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import Routes from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { getTimeStamp } from "@/lib/url";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { Suspense } from "react";

export const sampleQuestion = {
  _id: "64f7b8d9e2c4a9f1b6d8e123",

  title:
    "How can I implement JWT authentication with refresh tokens in a MERN Stack application?",

  content: `
    I'm building a MERN Stack application (MongoDB, Express.js, React, and Node.js) and I'm trying to implement JWT authentication with refresh tokens. While the basic login flow works, I'm facing several issues with token expiration and session management.
    
    Here is what I have implemented so far:
    
    • Users can register and log in successfully.
    • A JWT access token is generated after login.
    • A refresh token is stored in an HTTP-only cookie.
    • Protected routes use middleware to verify the access token.
    
    However, I'm facing the following problems:
    
    1. When the access token expires, users are logged out immediately instead of receiving a new token automatically.
    
    2. I'm unsure whether refresh tokens should be stored in the database or only inside secure cookies.
    
    3. After logging out, I want all refresh tokens associated with the user to become invalid, but I'm not sure about the best implementation strategy.
    
    4. Some API requests fail with a 401 Unauthorized error after refreshing the page, even though the refresh token still exists.
    
    5. I also want to implement role-based authorization for Admin and User accounts without making the authentication logic overly complicated.
    
    My current backend stack includes:
    
    - Node.js
    - Express.js
    - MongoDB with Mongoose
    - JWT
    - bcrypt
    - Cookie Parser
    
    On the frontend I'm using:
    
    - React
    - Axios
    - React Router
    - React Hook Form
    
    Below is a simplified React component where I'm using \`useMemo\` to optimize filtering. I'm wondering if this is the correct approach when working with a large list of items.
    
    \`\`\`jsx
    import React, { useState, useMemo } from "react";
    
    const LargeList = ({ items }) => {
      const [filter, setFilter] = useState("");
    
      // Filtering items dynamically
      const filteredItems = useMemo(() => {
        return items.filter((item) =>
          item.toLowerCase().includes(filter.toLowerCase())
        );
      }, [items, filter]);
    
      return (
        <div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter items"
          />
    
          <ul>
            {filteredItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    };
    
    export default LargeList;
    \`\`\`
    
    I also have a backend route for refreshing the access token:
    
    \`\`\`js
    router.post("/refresh", async (req, res) => {
      const refreshToken = req.cookies.refreshToken;
    
      if (!refreshToken) {
        return res.status(401).json({
          message: "Refresh token missing",
        });
      }
    
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
    
      return res.status(200).json({
        accessToken,
      });
    });
    \`\`\`
    
    Could someone explain whether this overall architecture is correct?
    
    - Is storing refresh tokens in HTTP-only cookies the recommended approach?
    - Should refresh tokens also be stored in MongoDB?
    - How should I invalidate refresh tokens on logout?
    - Is using \`useMemo\` in the React component above actually beneficial, or is it an unnecessary optimization?
    
    A recommended project structure and best practices would be greatly appreciated.
    `,

  createdAt: "2026-01-15T12:34:56.789Z",

  upvotes: 142,
  downvotes: 6,
  views: 3842,
  answers: 12,

  tags: [
    {
      _id: "tag1",
      name: "React",
    },
    {
      _id: "tag2",
      name: "Node.js",
    },
    {
      _id: "tag3",
      name: "JWT",
    },
  ],

  author: {
    _id: "64f7b8d9e2c4a9f1b6d8e301",
    name: "Jane Doe",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
};

const QuestionDetails = async ({ params }) => {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });

  //Approch 1 of views was - View component [ View.jsx ] in /app/(root)/questions/View.jsx

  //Apporach 2 ( views ) - use Promise.all
  // const [_, { success, data: question }] = await Promise.all([
  //   await incrementViews({ questionId: id }),
  //   await getQuestion({ questionId: id }),
  // ]);

  //Approach 3 ( views ) - after() *currently using in the project*
  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) return redirect("/404");

  const {
    success: areAnswersLoaded,
    error: answersError,
    data: answersResult,
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  console.log("ANSWERS", answersResult);

  const { author, createdAt, answers, views, tags, content, title } = question;

  return (
    <>
      <div className="w-full flex-start flex-col">
        <div className="w-full flex flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />

            <Link href={Routes.Profile(author._id)}>
              <p className="font-semibold">{author.name}</p>
            </Link>
          </div>

          <div className="flex justify-end">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={question.upvotes}
                // hasupVoted={true}
                downvotes={question.downvotes}
                // hasdownVotes={false}
                hasVotedPromise={hasVotedPromise}
                targetId={question._id}
                targetType="question"
              />
            </Suspense>
          </div>
        </div>

        <h2 className="w-full mt-3.5 text-xl font-semibold">{title}</h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-2">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={`asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="text-sm"
        />

        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="text-sm"
        />

        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="text-sm"
        />
      </div>

      <Preview content={content} />

      <div className="mt-5 flex  flex-wrap gap-2">
        {tags.map((tag) => {
          return (
            <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
          );
        })}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
