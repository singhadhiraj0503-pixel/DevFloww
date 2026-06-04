"use client";

import React from "react";
import { AskQuestionSchema } from "@/lib/validation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription } from "../ui/form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleCreateQuestion = () => {};

  return (
    <Form {...form}>
      <form
        action=""
        className="w-full flex flex-col gap-5"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
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
                <FormControl>Editor</FormControl>
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

        <FieldGroup className="mb-5">
          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title" className="text-lg">
                  Question Title <span className="text-orange-500">*</span>
                </FieldLabel>
                <FormControl>
                  <div>
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
                    Tags
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
      </form>
    </Form>
  );
};

export default QuestionForm;
