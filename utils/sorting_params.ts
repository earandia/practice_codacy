type SortingOrder = "asc" | "desc" | any;

interface SortingParams {
  sorting_column?: string | undefined;
  sorting_order?: SortingOrder;
}

interface DefaultSort {
  [key: string]: 1 | -1;
}

interface SortingResult {
  sort: { [key: string]: 1 | -1 };
}

/**
 * Creates a MongoDB sort object based on the given parameters.
 *
 * If the parameters have both a sorting column and order, it will use those.
 * Otherwise, it will use the given default sort.
 *
 * If the resulting sort object is empty, it will return an object with a sort
 * property set to an empty object. Otherwise, it will return an empty object.
 *
 * @param {SortingParams} params
 * @param {DefaultSort} [defaultSort={}]
 * @return {SortingResult|object}
 */
export const sorting_params = (
  params: SortingParams,
  defaultSort: DefaultSort = {}
): SortingResult | object => {
  let sorting: { [key: string]: 1 | -1 } = {};

  if (params.sorting_column && params.sorting_order) {
    sorting[params.sorting_column] = params.sorting_order === "asc" ? 1 : -1;
  } else {
    sorting = defaultSort;
  }
  if (Object.keys(sorting).length > 0) {
    return { sort: sorting };
  } else {
    return {};
  }
};
