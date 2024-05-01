import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline'
import ReactPaginate from 'react-paginate'
import { toast } from 'sonner'

const personInitial = {
  name: '',
  photo: '',
}

export const User = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/user/all?page=${page}&pageSize=${pageSize}`
      )
      .then((res) => {
        setUsers(res.data.data.users)
        setTotalPages(res.data.data.totalPages)
      })
  }, [page, pageSize])

  return (
    <div className='items-center'>
      <div className='card p-6 m-4 bg-base-100 rounded-lg overflow-hidden'>
        <div className='text-xl font-semibold inline-block'>Người dùng</div>
        <div className='divider mt-2'></div>

        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Tuỳ chọn</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user._id}>
                  <th>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={`data:image/png;base64, ${user.avatar}`}
                      alt=''
                    />
                  </th>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='font-bold'>{user?._id}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{user?.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{user?.email}</div>
                    </div>
                  </td>
                  <th>
                    <button
                      className='btn btn-ghost btn-xs'
                      // onClick={() => handleEdit(person)}
                    >
                      <PencilIcon className='w-6 h-6 p-1' />
                    </button>
                    <button className='btn btn-ghost btn-xs'>
                      <TrashIcon className='w-6 h-6 p-1' />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReactPaginate
        breakLabel={'...'}
        breakClassName='bg-transparent hover:btn-neutral border-none w-10 h-10 flex items-center justify-center self-center'
        nextLabel={
          <button class='btn m-2'>
            <ChevronRightIcon className='w-6 h-6 p-1' />
          </button>
        }
        onPageChange={(event) => setPage(event.selected + 1)}
        pageRangeDisplayed={1}
        pageCount={totalPages}
        previousLabel={
          <button class='btn m-2'>
            <ChevronLeftIcon className='w-6 h-6 p-1' />
          </button>
        }
        containerClassName='flex item-center justify-center mt-8 mb-4 self-center'
        pageClassName='bg-transparent hover:btn-neutral border-none w-10 h-10 mx-1 rounded flex items-center justify-center text-xl self-center'
        activeClassName='btn-active bg-[#7480FF] text-[#000] hover:text-[#000]'
      />
    </div>
  )
}
