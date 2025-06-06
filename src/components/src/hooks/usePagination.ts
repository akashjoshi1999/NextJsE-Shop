

// // src/hooks/usePagination.ts
// import { useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { setPageState, selectPageState } from '../store/slices/uiSlice'

// export const usePagination = (pageName: unknown) => {
//   const dispatch = useDispatch()
//   const pageState = useSelector(selectPageState(pageName))

//   const setPage = useCallback(
//     (page) => dispatch(setPageState({ 
//       page: pageName, 
//       data: { currentPage: page } 
//     })),
//     [dispatch, pageName]
//   )

//   const setPageSize = useCallback(
//     (size) => dispatch(setPageState({ 
//       page: pageName, 
//       data: { pageSize: size, currentPage: 1 } 
//     })),
//     [dispatch, pageName]
//   )

//   const setSort = useCallback(
//     (sortBy, sortOrder = 'desc') => dispatch(setPageState({ 
//       page: pageName, 
//       data: { sortBy, sortOrder } 
//     })),
//     [dispatch, pageName]
//   )

//   const setFilters = useCallback(
//     (filters) => dispatch(setPageState({ 
//       page: pageName, 
//       data: { filters, currentPage: 1 } 
//     })),
//     [dispatch, pageName]
//   )

//   return {
//     ...pageState,
//     setPage,
//     setPageSize,
//     setSort,
//     setFilters,
//   }
// }