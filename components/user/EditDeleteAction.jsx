"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteQuestion } from "@/lib/actions/question.action";

const EditDeleteAction = ({ type, itemId }) => {
  const router = useRouter();

  const handleEdit = async () => {
    router.push(`/questions/${itemId}/edit`);
  };

  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: itemId });

      toast.success("Question deleted successfully");
    } else if (type === "Answer") {
      toast.success("Answer deleted successfully");
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}
    >
      {type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-cover mr-1.5"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer mr-1">
          <Image src="/icons/trash.svg" alt="trash" width={22} height={22} />
        </AlertDialogTrigger>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "Question" ? "question" : "answer"} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-orange-500 !text-white"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
