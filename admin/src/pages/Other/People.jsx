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

export const People = () => {
  const [people, setPeople] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [person, setPerson] = useState(personInitial)
  const [reRender, setReRender] = useState(0)

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/people/all?page=${page}&pageSize=${pageSize}`
      )
      .then((res) => {
        setPeople(res.data.data.people)
        setTotalPages(res.data.data.totalPages)
      })
  }, [reRender, page, pageSize])

  const handleEdit = (person) => {
    setPerson(person)
    document.getElementById('add_person_modal').showModal()
  }
  const handleCreate = () => {
    setPerson(personInitial)
    document.getElementById('add_person_modal').showModal()
  }

  const handleSave = async () => {
    if (person._id) {
      await axios
        .put(`http://localhost:5000/api/people/update`, person)
        .then((res) => {
          toast.success(res.data.message)
          setReRender(reRender + 1)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    } else {
      await axios
        .post(`http://localhost:5000/api/people/create`, person)
        .then((res) => {
          toast.success(res.data.message)
          setReRender(reRender + 1)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }
  }

  return (
    <div className='items-center'>
      <div className='card p-6 m-4 bg-base-100 rounded-lg overflow-hidden'>
        <div className='text-xl font-semibold inline-block'>
          Phim
          <div className='inline-block float-right'>
            <button
              onClick={() => handleCreate()}
              className='btn px-6 btn-sm normal-case btn-primary'
            >
              Thêm mới
            </button>
          </div>
        </div>
        <div className='divider mt-2'></div>

        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Tên</th>
                <th>Ảnh</th>
                <th>Tuỳ chọn</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={person._id}>
                  <th>
                    <label>
                      <input type='checkbox' className='checkbox' />
                    </label>
                  </th>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='font-bold'>{person?._id}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{person?.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{person?.photo}</div>
                    </div>
                  </td>
                  <th>
                    <button
                      className='btn btn-ghost btn-xs'
                      onClick={() => handleEdit(person)}
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
      <div>
        <dialog id='add_person_modal' className='modal w-100'>
          <div className='modal-box w-11/12 max-w-xl'>
            <form method='dialog'>
              <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
                ✕
              </button>
            </form>

            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Tên</span>
              </div>
              <input
                type='text'
                value={person?.name}
                onChange={(e) => setPerson({ ...person, name: e.target.value })}
                className='input input-bordered w-full'
              />
            </label>

            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Link ảnh</span>
              </div>
              <input
                type='text'
                value={person?.photo}
                onChange={(e) =>
                  setPerson({ ...person, photo: e.target.value })
                }
                className='input input-bordered w-full'
              />
            </label>

            <div className='flex justify-end mt-5'>
              <button onClick={() => handleSave()} className='btn btn-primary'>
                Lưu
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}
