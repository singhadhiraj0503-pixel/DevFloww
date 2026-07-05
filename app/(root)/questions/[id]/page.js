import React from "react";

const QuestionDetails = async ({ params }) => {
  const { id } = await params;

  return <div>Question Page: {id}</div>;
};

export default QuestionDetails;
