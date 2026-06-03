const Routes = {
  Home: "/",
  Sign_in: "/sign-in",
  Sign_up: "/sign-up",
  Profile: (id) => `/profile/${id}`,
  Tags: (id) => `/tags/${id}`,
  ask_question: "/ask-question",
};

export default Routes;
