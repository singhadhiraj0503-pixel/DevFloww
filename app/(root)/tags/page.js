import TagCard from "@/components/cards/TagCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import Routes from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/state";
import { getTags } from "@/lib/actions/tag.action";
import React from "react";

const Tags = async ({ searchParams }) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags } = data || {};

  return (
    <div>
      <h1 className="text-2xl font-bold">Tags</h1>

      {/* <section className="mt-10"> */}
      <section className="w-full flex gap-5 mt-5 max-sm:flex max-sm:flex-col">
        <LocalSearch
          route={Routes.Tags}
          imgSrc={"/icons/search.svg"}
          placeholder="Search tags..."
          iconPosition="left"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[20px] sm:min-w-[170px]"
        />
      </section>

      <DataRender
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="w-full mt-10 flex flex-wrap gap-5">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Tags;
