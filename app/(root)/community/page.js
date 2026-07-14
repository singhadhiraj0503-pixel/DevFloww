import UserCard from "@/components/cards/UserCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import Routes from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/state";
import { getUsers } from "@/lib/actions/user.action";
import React from "react";

const Community = async ({ searchParams }) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { users } = data || {};
  return (
    <div>
      <h1 className="font-bold text-2xl">All Users:</h1>

      {/* <div className="mt-10"> */}
      <div className="w-full flex gap-5 mt-5 max-sm:flex max-sm:flex-col">
        <LocalSearch
          route={Routes.Community}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[20px] sm:min-w-[170px]"
        />
      </div>

      <DataRender
        success={success}
        data={users}
        error={error}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-10 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
