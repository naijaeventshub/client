import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  calculateDateRange,
  DateFilterOption,
  DateRange,
  CustomDateRange,
} from '@/lib/date-utils';

interface DashboardFiltersState {
  selectedFilter: DateFilterOption;
  dateRange: DateRange;
  customDateRange: CustomDateRange;
}

const initialFilter: DateFilterOption = 'This week';
const initialState: DashboardFiltersState = {
  selectedFilter: initialFilter,
  dateRange: calculateDateRange(initialFilter),
  customDateRange: {},
};

export const dashboardFiltersSlice = createSlice({
  name: 'dashboardFilters',
  initialState,
  reducers: {
    setSelectedFilter: (state, action: PayloadAction<DateFilterOption>) => {
      state.selectedFilter = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    setCustomDateRange: (state, action: PayloadAction<CustomDateRange>) => {
      state.customDateRange = action.payload;
    },
  },
});

export const { setSelectedFilter, setDateRange, setCustomDateRange } =
  dashboardFiltersSlice.actions;

export default dashboardFiltersSlice.reducer;
