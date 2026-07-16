export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country");
  const location = await response.json();
  return location.country;
};

// export const fetchCountries = async () => {
//   try {
//     const response = await fetch(
//       "https://restcountries.com/v3.1/all?fields=name",
//     );
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

const REST_COUNTRIES = process.env.REST_COUNTRIES_API_KEY;
const JOB_FETCH = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export const fetchCountries = async () => {
  try {
    console.log("FETCH COUNTRIES CALLED");

    // Fires a real request against the demo API key.
    // Click the button below to run it. The response opens in the Explorer panel.
    const response = await fetch(
      "https://api.restcountries.com/countries/v5/codes.alpha_2/ca?pretty=1",
      { headers: { Authorization: REST_COUNTRIES } },
    );
    const result = await response.json();
  } catch (error) {
    console.log("Countries Error:", error);
  }
};

export const fetchJobs = async (filters) => {
  const { query, page } = filters;

  const url =
    "https://jsearch.p.rapidapi.com/job-details?job_id=qIsPjUMr0Em0hqHoAAAAAA%3D%3D&country=us";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "463147861amsh78834bcd995a2ffp15a49bjsnd8c43bde292d",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  // const headers = {
  //   "X-RapidAPI-Key": JOB_FETCH ?? "",
  //   "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  // };

  // const response = await fetch(
  //   `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
  //   {
  //     headers,
  //   },
  // );

  // const result = await response.json();

  // return result.data;

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
