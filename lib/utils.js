import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const techDescriptionMap = {
  // JavaScript
  javascript:
    "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  js: "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",

  // TypeScript
  typescript:
    "TypeScript adds strong typing to JavaScript, making it ideal for scalable and maintainable applications.",
  ts: "TypeScript adds strong typing to JavaScript, making it ideal for scalable and maintainable applications.",

  // React
  react:
    "React is a popular JavaScript library for building fast, interactive, and component-based user interfaces.",

  // Next.js
  nextjs:
    "Next.js is a React framework that provides server-side rendering, routing, API routes, and performance optimizations.",
  next: "Next.js is a React framework that provides server-side rendering, routing, API routes, and performance optimizations.",

  // Node.js
  nodejs:
    "Node.js is a JavaScript runtime that allows developers to build fast and scalable backend applications.",
  node: "Node.js is a JavaScript runtime that allows developers to build fast and scalable backend applications.",

  // Python
  python:
    "Python is a versatile programming language widely used in web development, automation, data science, and AI.",

  // Java
  java: "Java is a robust, object-oriented programming language commonly used for enterprise, Android, and backend development.",

  // C++
  "c++":
    "C++ is a high-performance programming language commonly used in game development, operating systems, and competitive programming.",
  cpp: "C++ is a high-performance programming language commonly used in game development, operating systems, and competitive programming.",

  // Git
  git: "Git is a distributed version control system used to track changes and collaborate efficiently on software projects.",

  // Docker
  docker:
    "Docker is a containerization platform that helps developers build, ship, and run applications consistently across environments.",

  // MongoDB
  mongodb:
    "MongoDB is a NoSQL document database designed for scalability, flexibility, and high-performance applications.",
  mongo:
    "MongoDB is a NoSQL document database designed for scalability, flexibility, and high-performance applications.",

  // MySQL
  mysql:
    "MySQL is a widely used open-source relational database management system known for reliability and performance.",

  // PostgreSQL
  postgresql:
    "PostgreSQL is an advanced open-source relational database known for its reliability, extensibility, and SQL compliance.",
  postgres:
    "PostgreSQL is an advanced open-source relational database known for its reliability, extensibility, and SQL compliance.",

  // AWS
  aws: "Amazon Web Services (AWS) is a leading cloud computing platform offering infrastructure, storage, databases, AI, and deployment services.",
  amazonwebservices:
    "Amazon Web Services (AWS) is a leading cloud computing platform offering infrastructure, storage, databases, AI, and deployment services.",
};

export const getTechDescription = (techName) => {
  if (!techName) {
    console.log("techName is undefined:", techName);

    return "Technology information is currently unavailable.";
  }

  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return (
    techDescriptionMap[normalizedTechName] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
};

export const getDevIconClassName = (techName) => {
  if (!techName) {
    console.log("techName is undefined:", techName);
    return "devicon-devicon-plain";
  }

  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};
