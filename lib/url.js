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
