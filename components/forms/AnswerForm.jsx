"use client";

import { AnswerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
// import Editor from "../editor";

const Editor = dynamic(() => import("@/components/editor/index"), {
  // Make sure we turn SSR off
  ssr: false,
});

const AnswerForm = () => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isAISubmitting, setisAISubmitting] = useState(false);

  const editorRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values) => {
    console.log(values);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="text-lg font-semibold">Write your answer here</h4>
        <Button
          className="btn rounded active:scale-95 font-semibold bg-gray-800 text-orange-500 text-lg hover:text-black"
          disabled={isAISubmitting}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full mt-6 flex flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => {
              return (
                <FormItem className="w-full flex flex-col gap-3">
                  <FormControl className="mt-3.5">
                    <Editor
                      value={field.value}
                      editorRef={editorRef}
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-fit font-semibold bg-orange-500 text-white rounded active:scale-95 text-lg py-2"
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
