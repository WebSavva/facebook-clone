import { camelCase } from "lodash";

export default function getSearchParams(request, paramNames) {
  const rawSearchParams = new URL(
    request.url,
    `https://${request.headers.host}`
  ).searchParams;
  let searchParamsMap = {};
  for (let name of paramNames) {
    let paramValue = rawSearchParams.get(name);
    if (paramValue !== null) {
      searchParamsMap = {
        ...searchParamsMap,
        [camelCase(name)]: paramValue,
      };
    }
  }
  return searchParamsMap;
}
