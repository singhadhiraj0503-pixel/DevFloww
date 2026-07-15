// export const themes = [
//   { value: "light", label: "Light", icon: "/icons/sun.svg" },
//   { value: "dark", label: "Dark", icon: "/icons/moon.svg" },
//   { value: "system", label: "System", icon: "/icons/computer.svg" },
// ];

export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    label: "Home",
    route: "/",
  },
  {
    imgURL: "/icons/users.svg",
    label: "Community",
    route: "/community",
  },
  {
    imgURL: "/icons/star.svg",
    label: "Collections",
    route: "/collection",
  },
  {
    imgURL: "/icons/suitcase.svg",
    label: "Find Jobs",
    route: "/jobs",
  },
  {
    imgURL: "/icons/tag.svg",
    label: "Tags",
    route: "/tags",
  },
  {
    imgURL: "/icons/user.svg",
    label: "Profile",
    route: "/profile",
  },
  {
    imgURL: "/icons/question.svg",
    label: "Ask a Question",
    route: "/ask-question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
