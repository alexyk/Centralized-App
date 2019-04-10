import type {
  GeneratedFilterOptions,
  OptionsForGeneratingFilters
} from "./filter-options-generating-function/filter-options-generating";
import type { Filters } from "./filtering-function/filtering-function";
import type { Flight } from "./flights.type.flow";
import { makeFiltersObjectFromResults } from "./filter-options-generating-function/filter-options-generating";
import { makeDefaultOptionsForFilterGenaration } from "./filter-options-generating-function/default-options";

export type {
  GeneratedFilterOptions,
  OptionsForGeneratingFilters,
  Filters,
  Flight
};
export { makeFiltersObjectFromResults, makeDefaultOptionsForFilterGenaration };
