import UserCard from "@/components/cards/UserCard";
import DataRender from "@/components/DataRender";
import LocalSearch from "@/components/search/LocalSearch";
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

      <div className="mt-10">
        <LocalSearch
          route={Routes.Community}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!..."
          otherClasses="flex-1"
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
