const Routes = {
  Home: "/",
  Sign_in: "/sign-in",
  Sign_up: "/sign-up",
  Collection: "/collection",
  Community: "/community",
  Tags: "/tags",
  Jobs: "/jobs",
  Profile: (id) => `/profile/${id}`,
  Tag: (id) => `/tags/${id}`,
  ask_question: "/ask-question",
  Question: (id) => `/questions/${id}`,
  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};

export default Routes;
