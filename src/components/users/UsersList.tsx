

// // src/components/users/UsersList.tsx
// 'use client'

// import { useState } from 'react'
// import { useGetUsersQuery, useDeleteUserMutation } from '../../store/api/userApi'
// import { useNotification } from '../../hooks/useNotification'
// import { usePagination } from '../../hooks/usePagination'

// export default function UsersList() {
//   const { currentPage, pageSize, sortBy, sortOrder, setPage, setPageSize, setSort } = usePagination('users')
//   const [searchTerm, setSearchTerm] = useState('')

//   const {
//     data: usersData,
//     error,
//     isLoading,
//   } = useGetUsersQuery({
//     page: currentPage,
//     limit: pageSize,
//     search: searchTerm
//   })

//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
//   const { showSuccess, showError } = useNotification()

//   const handleDelete = async (userId, userName) => {
//     if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
//       try {
//         await deleteUser(userId).unwrap()
//         showSuccess(`${userName} deleted successfully`)
//       } catch (error) {
//         showError('Failed to delete user')
//       }
//     }
//   }

//   const handleSort = (field) => {
//     const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc'
//     setSort(field, newOrder)
//   }

//   if (isLoading) return <div className="flex justify-center p-4">Loading...</div>
//   if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>

//   return (
//     <div className="space-y-4">
//       {/* Search and Controls */}
//       <div className="flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-3 py-2 border rounded-md"
//         />
        
//         <div className="flex items-center gap-2">
//           <span>Show:</span>
//           <select 
//             value={pageSize} 
//             onChange={(e) => setPageSize(Number(e.target.value))}
//             className="px-2 py-1 border rounded"
//           >
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('name')}
//               >
//                 Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('email')}
//               >
//                 Email {sortBy === 'email' && (sortOrder === 'desc' ? '↓' : '↑')}
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('createdAt')}
//               >
//                 Created {sortBy === 'createdAt' && (sortOrder === 'desc' ? '↓' : '↑')}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {usersData?.users?.map((user) => (
//               <tr key={user._id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {user.name}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{user.email}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(user._id, user.name)}
//                     disabled={isDeleting}
//                     className="text-red-600 hover:text-red-900 disabled:opacity-50"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {usersData && (
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, usersData.total)} of {usersData.total} results
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
            
//             <span className="px-3 py-1">
//               Page {currentPage} of {Math.ceil(usersData.total / pageSize)}
//             </span>
            
//             <button
//               onClick={() => setPage(currentPage + 1)}
//               disabled={currentPage >= Math.ceil(usersData.total / pageSize)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
