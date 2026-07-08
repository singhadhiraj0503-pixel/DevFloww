import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/state";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const StateSkeleton = ({ image, title, message, button }) => {
  return (
    <div className="w-full mt-10 flex flex-col items-center justify-center">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          width={270}
          height={200}
          className="object-contain"
        />
      </>
      <h2 className="text-2xl font-bold pt-3 pb-2">{title}</h2>
      <p className="text-lg max-w-md text-center">{message}</p>
      {button && (
        <Link href={button.href}>
          <Button className="mt-3 text-lg rounded font-semibold px-4 py-3 bg-orange-500 text-white cursor-pointer hover:bg-orange-500 hover:text-black">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
};

const DataRender = ({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alr: "Error State Illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0)
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alr: "Empty State Illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );

  return <div>{render(data)}</div>;
};

export default DataRender;
