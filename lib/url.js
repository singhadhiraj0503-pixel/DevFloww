import queryString from "query-string";

export const formUrlQuery = ({ params, key, value }) => {
  const currentUrl = queryString.parse(params);
  currentUrl[key] = value;

  return queryString.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  });
};

export const removeKeysFromQuery = ({ params, keysToRemove, value }) => {
  const currentUrl = queryString.parse(params);
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    },
  );
};

export const getTimeStamp = (createdAt) => {
  const now = new Date();
  const past = new Date(createdAt);

  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);

  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
};
