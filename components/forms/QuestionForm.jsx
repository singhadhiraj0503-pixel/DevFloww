"use client";

import React, { useRef, useTransition } from "react";
import { AskQuestionSchema, EditQuestionSchema } from "@/lib/validation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription } from "../ui/form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import TagCard from "../cards/TagCard";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Routes from "@/constants/routes";
import { ReloadIcon } from "@radix-ui/react-icons";

const Editor = dynamic(() => import("@/components/editor/index"), {
  // Make sure we turn SSR off
  ssr: false,
});

const QuestionForm = ({ question, isEdit = false }) => {
  const router = useRouter();
  const editorRef = useRef();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    // resolver: zodResolver(isEdit ? EditQuestionSchema : AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleInputKeyDown = (e, field) => {
    // console.log(field, e);
    if (e.key === "Enter") {
      e.preventDefault();

      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleTagRemove = (tag, field) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleCreateQuestion = async (data) => {
    // startTransition(async () => {
    //   if (isEdit && question) {
    //     const result = await editQuestion({
    //       questionId: question?._id,
    //       ...data,
    //     });

    //     console.log(result);

    //     // const result = await getQuestion({ questionId: id });

    //     // console.log("GET QUESTION:", result);

    //     if (result.success) {
    //       toast.success("Question updated successfully");

    //       console.log(result);
    //       if (result.data) router.push(Routes.Question(result.data?._id));
    //     } else {
    //       toast.error(result.error?.message || "Something went wrong");
    //     }
    //     return;
    //   }

    //   const result = await createQuestion(data);

    //   if (result.success) {
    //     toast.success("Question created successfully");

    //     // console.log(result);
    //     if (result.data) router.push(Routes.Question(result.data?._id));
    //   } else {
    //     toast.error(result.error?.message || "Something went wrong");
    //   }
    // });

    // const result = await createQuestion(data);

    // console.log(result);

    startTransition(async () => {
      let result;

      if (isEdit) {
        result = await editQuestion({
          questionId: question._id,
          ...data,
        });

        if (!result.success) {
          toast.error(result.error?.message);
          return;
        }

        toast.success("Question updated successfully");

        router.push(Routes.Question(result.data._id));

        return;
      }

      result = await createQuestion(data);

      if (!result.success) {
        toast.error(result.error?.message);
        return;
      }

      toast.success("Question created successfully");

      router.push(Routes.Question(result.data._id));
    });
  };

  return (
    <Form {...form}>
      <form
        action=""
        className="w-full flex flex-col gap-5"
        // onSubmit={form.handleSubmit(handleCreateQuestion)}
        onSubmit={(e) => {
          e.preventDefault();
          console.log("FORM SUBMIT");
          console.log(form.getValues());
          console.log(form.formState.errors);

          form.handleSubmit((data) => {
            console.log("INSIDE CALLBACK");
            console.log(data);

            handleCreateQuestion(data);
          })(e);
        }}
      >
        <FieldGroup className="mb-5">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title" className="text-lg">
                  Question Title <span className="text-orange-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  className="rounded outline-none p-4"
                  // aria-invalid={fieldState.invalid}
                  placeholder={
                    field.name === "password" ? "password" : field.name
                  }
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FormDescription className="opacity-70 text-xsm">
                  Be specific and imagine that you're asking a question to
                  another person
                </FormDescription>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="mb-5">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title" className="text-lg">
                  Detailed explaination of your problem{" "}
                  <span className="text-orange-500">*</span>
                </FieldLabel>
                <FormControl>
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FormDescription className="opacity-70 text-xsm">
                  Introduce the problem and expand on what you've put in the
                  title.
                </FormDescription>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="mb-1">
          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title" className="text-lg">
                  Tags <span className="text-orange-500">*</span>
                </FieldLabel>
                <FormControl>
                  <div>
                    <Input
                      // {...field}
                      id="form-rhf-demo-title"
                      className="rounded outline-none p-4"
                      // aria-invalid={fieldState.invalid}
                      placeholder={
                        field.name === "password" ? "password" : field.name
                      }
                      autoComplete="off"
                      onKeyDown={(e) => {
                        handleInputKeyDown(e, field);
                      }}
                    />
                    {field.value.length > 0 && (
                      <div className="flex">
                        {field?.value?.map((tag, index) => {
                          // console.log("Question Tags:", question?.tags);
                          // console.log("Form Tags:", form.getValues("tags"));
                          return (
                            <TagCard
                              // key={tag}
                              key={`${tag}-${index}`}
                              _id={tag}
                              name={tag}
                              compact
                              remove
                              isButton
                              handleRemove={() => {
                                handleTagRemove(tag, field);
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormControl>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FormDescription className="opacity-70 text-xsm">
                  Add upto 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
              </Field>
            )}
          />
        </FieldGroup>

        <div className="">
          <Button
            type="submit"
            disabled={isPending}
            className="text-md font-bold bg-orange-500 text-white rounded active:scale-95 cursor-pointer hover:text-orange-500 hover:bg-white hover:font-bold"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>{isEdit ? "Edit" : "Submit Question"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
