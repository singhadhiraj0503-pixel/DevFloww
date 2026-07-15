import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";
import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = async ({ params }) => {
  const { id } = await params;

  // if (!id) notFound();

  const loggedInUser = await auth();
  const { success, data, error } = await getUser({ userId: id });

  if (!success) {
    return (
      <div className="">
        <div className="text-2xl font-bold">{error.message}</div>
      </div>
    );
  }

  const { user, totalQuestions, totalAnswers } = data;
  const { _id, name, image, portfolio, location, createdAt, username, bio } =
    user;

  console.log({
    loggedInUser: loggedInUser?.user?.id,
    id,
  });

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassname="text-6xl font-bold"
          />

          <div className="mt-3">
            <h2 className="font-bold text-3xl">{name}</h2>
            <p className="opacity-55">@{username}</p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={portfolio}
                  title="Portfolio"
                />
              )}

              {location && (
                <ProfileLink imgUrl="/icons/location.svg" title="Location" />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>

            {bio && <p className="mt-8"></p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href="/profile/edit">
              <Button className="rounded active:scale-95 cursor-pointer font-bold bg-gray-700 text-white text-md">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 w-full flex flex-col gap-6"
          >
            List of Questions
          </TabsContent>
          <TabsContent value="answers" className="w-full flex flex-col gap-6">
            List of Answers
          </TabsContent>
        </Tabs>

        <div className="w-full min-w-[250px] flex flex-1 flex-col max-lg:hidden">
          <h3 className="font-bold text-xl">Top Tags</h3>
          <div className="mt-7 flex flex-col gap-4">
            <p>List of Tags</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
