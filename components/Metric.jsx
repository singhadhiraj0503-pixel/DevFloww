import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Metric = ({ imgUrl, alt, value, title, href, isAuthor, titleStyles }) => {
  const metricContent = (
    <div className="flex items-center gap-2 pr-3">
      <Image
        src={imgUrl}
        width={18}
        height={18}
        alt={alt}
        className="rounded-full object-cover object-center"
      />
      <p>{value}</p>
      {title ? (
        <span className={cn(`opacity-70`, titleStyles)}>{title}</span>
      ) : null}
    </div>
  );

  return href ? (
    <Link className=" max-sm:hidden" href={href}>
      {metricContent}
    </Link>
  ) : (
    <div className="   max-sm:hidden">{metricContent}</div>
  );
};

export default Metric;
