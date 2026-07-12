import Routes from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the databse is taking a nap. Wake it up with some new entries",
  button: {
    text: "Add data",
    href: Routes.Home,
  },
};

export const DEFAULT_ERROR = {
  title: "Oops! Something went wrong",
  message: "Even out code can have a bad day. Give it another shot",
  button: {
    text: "Try again",
    href: Routes.Home,
  },
};

export const EMPTY_QUESTION = {
  title: "Ahh, No Questions Yet!",
  message:
    "The question board is empty. Maybe its waiting for you to ask something.",
  button: {
    text: "Ask a Question",
    href: Routes.ask_question,
  },
};

export const EMPTY_TAGS = {
  title: "No Tags Found",
  message: "The tag cloud is empty. Add some keywords to make it rain",
  button: {
    text: "Create Tag",
    href: Routes.Tags,
  },
};

export const EMPTY_COLLECTIONS = {
  title: "Collections are Empty",
  message:
    "Looks like you have not created any collection yet. Start creating something extraordinary today.",
  button: {
    text: "Save to Collection",
    href: Routes.Collection,
  },
};

export const EMPTY_ANSWERS = {
  title: "No Answers Found",
  message:
    "The answer board is empty. Make it rain with your brilliant answers",
  // button: {
  //   text: "Answer",
  //   href: Routes.Home,
  // },
};

export const EMPTY_USERS = {
  title: "No Users Found",
  message: "You're ALONE. The only one here. More users are comming soon!",
};
