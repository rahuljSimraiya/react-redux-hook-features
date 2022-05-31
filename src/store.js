const initialState = {
   searchkeyType: "jobs",
   searchkeyValue: "",
   jobSearchValue: "",
   skillSearchValue: "",
   saasSearchValue: "",
   jobTableData: [],
   skillTableData: [],
   saasTableData: [],
   suggestionsList: [],
   watchlist: [],
   watchlistUpdated: false,
   jobsFilterParams: {companyName: '', ticker: '', filter: 'all', type: 'jobs', showChild:'false'},
   jobTrends: {},
   skillTrends: [],
};
export const reducer = (state = initialState, action) => {
   switch (action.type) {
      case 'SEARCH_KEY':
         return Object.assign({}, state, {
            searchkeyType: action.searchkeyType
         })
      case 'SEARCH_VALUE':
         return Object.assign({}, state, {
            searchkeyValue: action.searchkeyValue
         })
      case 'JOB_SEARCH_VALUE':
         return Object.assign({}, state, {
            jobSearchValue: action.jobSearchValue
         })
      case 'SKILL_SEARCH_VALUE':
         return Object.assign({}, state, {
            skillSearchValue: action.skillSearchValue
         })
      case 'SAAS_SEARCH_VALUE':
         return Object.assign({}, state, {
            saasSearchValue: action.saasSearchValue
         })
      case 'JOB_TABLE_DATA':
         return Object.assign({}, state, {
            jobTableData: action.jobTableData
         })
      case 'SKILL_TABLE_DATA':
         return Object.assign({}, state, {
            skillTableData: action.skillTableData
         })
      case 'SAAS_TABLE_DATA':
         return Object.assign({}, state, {
            saasTableData: action.saasTableData
         })
      case 'SUGGESTIONS_LIST':
         return Object.assign({}, state, {
            suggestionsList: action.suggestionsList
         })
      case 'WATCHLIST':
         return Object.assign({}, state, {
            watchlist: action.watchlist
         })
      case 'WATCHLIST_UPDATED':
         return Object.assign({}, state, {
            watchlistUpdated: action.watchlistUpdated
         })
      case 'JOBS_FILTER_PARAMS':
         return Object.assign({}, state, {
            jobsFilterParams: action.jobsFilterParams
         })
      case 'JOB_TRENDS':
         return Object.assign({}, state, {
            jobTrends: action.jobTrends
         })
      case 'SKILL_TRENDS':
         return Object.assign({}, state, {
            skillTrends: action.skillTrends
         })
      default:
         return state;
   }
}