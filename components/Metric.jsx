import Image from "next/image";
import Link from "next/link";
import React from "react";

const Metric = ({ imgUrl, alt, value, title, href, isAuthor }) => {
  const metricContent = (
    <div className="flex items-center gap-2 pr-3">
      <Image
        src={imgUrl}
        width={18}
        height={18}
        alt={alt}
        className="rounded-full object-cover object-center"
      />
      <p>{value},</p>
      <span className={`opacity-70 ${isAuthor ? "max-sm:hidden" : ""}`}>
        {title}
      </span>
    </div>
  );

  return href ? (
    <Link className="w-full max-sm:hidden" href={href}>
      {metricContent}
    </Link>
  ) : (
    <div className="w-full max-sm:hidden">{metricContent}</div>
  );
};

export default Metric;
