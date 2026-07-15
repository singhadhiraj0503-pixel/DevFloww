import * as z from "zod";

const nameRegex = /^[A-Za-z\s]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email({ message: "Please provide a valid email address" }),
  description: z.string().optional(),

  password: z
    .string()
    .min(5, { message: "password must be of atleast 5 characters" })
    .max(100, { message: "password cannot exceed 100 characters" }),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" })
      .regex(nameRegex, {
        message: "Name can only contain letters and spaces",
      }),
    username: z.string().min(3).max(30),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please provide a valid email address" }),

    password: z.string().regex(passwordRegex, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    }),

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  content: z.string().min(1, { message: "Body is required" }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required" })
        .max(30, { message: "Tags cannot exceed 30 characters" }),
    )
    .min(1, { message: "Atleast 1 tag is require" })
    .max(3, { message: "Cannot add more than 3 tags" }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  bio: z.string().optional(),
  image: z.string().url({ message: "Please provide a valid url" }).optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid url" })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required",
  }),

  name: z.string().min(1, {
    message: "Name is required",
  }),

  image: z
    .string()
    .url({
      message: "Please provide a valid image URL",
    })
    .optional(),

  password: z
    .string()
    .regex(passwordRegex, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    })
    .optional(),

  provider: z.string().min(1, {
    message: "Provider is required",
  }),

  providerAccountId: z.string().min(1, {
    message: "Provider Account ID is required",
  }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z
      .string()
      .min(3, { message: "Username should be atleast 3 characters long" }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const PaginatedSearchParamsShema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionSchema = PaginatedSearchParamsShema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required" }),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(100, { message: "Answer has to have more than 100 characters." }),
});

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetAnswerSchema = PaginatedSearchParamsShema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question is required" })
    .max(150, { message: "Question cannot exceed 150 characters" }),
  content: z
    .string()
    .min(100, { message: "Answer has to have more than 100 characters" }),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required" }),
  targetType: z.enum(["question", "answer"], {
    message: "Invalid Target Type",
  }),
  voteType: z.enum(["upvote", "downvote"], { message: "Invalid vote type" }),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsShema.extend({
  userId: z.string().min(1, { message: "User ID is required" }),
});

export const GetUsersAnswersSchema = PaginatedSearchParamsShema.extend({
  userId: z.string().min(1, { message: "User ID is required" }),
});
