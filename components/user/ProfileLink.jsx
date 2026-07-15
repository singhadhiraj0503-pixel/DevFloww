import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProfileLink = ({ imgUrl, href, title }) => {
  return (
    <div className="flex items-center gap-1.5">
      <Image src={imgUrl} alt={title} width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          {title}
        </Link>
      ) : (
        <p>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
