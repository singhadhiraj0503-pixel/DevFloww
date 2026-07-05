const Routes = {
  Home: "/",
  Sign_in: "/sign-in",
  Sign_up: "/sign-up",
  Profile: (id) => `/profile/${id}`,
  Tags: (id) => `/tags/${id}`,
  ask_question: "/ask-question",
  Question: (id) => `/questions/${id}`,
  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};

export default Routes;
