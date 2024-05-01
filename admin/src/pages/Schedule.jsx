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
import { ISOToTime, TimeToUnix } from '../utils/timeConvert'

const scheduleInitial = {
  _id: '',
  movie_id: '',
  room_id: '',
  start_time: 0,
  end_time: 0,
  reserved_seats: [],
  pending_seats: [],
  price: 0,
  cinema_name: '',
  room_number: [],
  movie_name: '',
  total_seats: 0,
}

export const Schedule = () => {
  const [schedules, setSchedules] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [reRender, setReRender] = useState(0)
  const [cinemas, setCinemas] = useState([])
  const [rooms, setRooms] = useState([])
  const [editingSchedule, setEditingSchedule] = useState(scheduleInitial)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/schedule/all?page=${page}&pageSize=${pageSize}`
      )
      .then((res) => {
        setSchedules(res.data.data.schedules)
        setTotalPages(res.data.data.totalPages)
      })
  }, [reRender, page, pageSize])

  const getCinema = async () => {
    await axios
      .get(`http://localhost:5000/api/cinema/all`)
      .then((res) => {
        setCinemas(res.data.data)
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const handleEdit = (schedule) => {
    getCinema()
    setEditingSchedule(schedule)
    document.getElementById('edit_schdule_modal').showModal()
  }
  const handleCreate = () => {
    getCinema()
    setSearchQuery('')
    setEditingSchedule(scheduleInitial)
    document.getElementById('edit_schdule_modal').showModal()
  }

  useEffect(() => {
    if (editingSchedule.cinema_id) {
      axios
        .get(
          `http://localhost:5000/api/cinema/rooms?cinemaId=${editingSchedule.cinema_id}`
        )
        .then((res) => {
          setRooms(res.data.data)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }
  }, [editingSchedule])

  const handleSave = async () => {
    const updateData = {
      _id: editingSchedule._id,
      movie_id: editingSchedule.movie_id,
      room_id: editingSchedule.room_id,
      start_time: TimeToUnix(editingSchedule.start_time),
      end_time: TimeToUnix(editingSchedule.start_time) + 720000,
      reserved_seats: editingSchedule.reserved_seats,
      pending_seats: editingSchedule.pending_seats,
      price: editingSchedule.price,
    }
    if (editingSchedule._id) {
      await axios
        .put(`http://localhost:5000/api/schedule/update`, updateData)
        .then((res) => {
          toast.success(res.data.message)
          setReRender(reRender + 1)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    } else {
      await axios
        .post(`http://localhost:5000/api/schedule/create`, updateData)
        .then((res) => {
          toast.success(res.data.message)
          setReRender(reRender + 1)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }
  }

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`http://localhost:5000/api/movie/search?query=${searchQuery}`)
        .then((res) => {
          setSearchResults(res.data.data)
        })
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

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
                <th>Phim</th>
                <th>Thời gian chiếu</th>
                <th>Rạp</th>
                <th>Số ghế đã đặt</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule._id}>
                  <th>
                    <label>
                      <input type='checkbox' className='checkbox' />
                    </label>
                  </th>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='font-bold'>{schedule?.movie_name}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>
                        {ISOToTime(schedule?.start_time).split('T').join(' ')}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>{schedule?.cinema_name}</div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div>
                        {schedule?.reserved_seats?.length}
                        {'/'}
                        {schedule?.total_seats}
                      </div>
                    </div>
                  </td>
                  <th>
                    <button
                      className='btn btn-ghost btn-xs'
                      onClick={() => handleEdit(schedule)}
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
        <dialog id='edit_schdule_modal' className='modal w-100'>
          <div className='modal-box w-11/12 max-w-xl'>
            <form method='dialog'>
              <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
                ✕
              </button>
            </form>

            <div className='flex flex-row gap-2'>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Chọn rạp</span>
                </div>
                <select
                  className='select select-bordered'
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      cinema_id: e.target.value,
                    })
                  }
                >
                  <option value=''>Vui lòng chọn rạp</option>
                  {cinemas.map((cinema) => (
                    <option
                      key={cinema._id}
                      selected={cinema._id === editingSchedule.cinema_id}
                      value={cinema._id}
                    >
                      {cinema.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Chọn phòng</span>
                </div>
                <select
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      room_id: e.target.value,
                    })
                  }
                  className='select select-bordered'
                >
                  {rooms.map((room) => (
                    <option
                      key={room._id}
                      value={room._id}
                      selected={room._id === editingSchedule.room_id}
                    >
                      {room.room_number}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Phim</span>
              </div>
              {editingSchedule.movie_id ? (
                <p>{editingSchedule.movie_name}</p>
              ) : (
                <input
                  type='text'
                  // value={}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='input input-bordered w-full'
                />
              )}
            </label>
            <ul className='flex flex-col gap-2 absolute'>
              {!editingSchedule.movie_id &&
                searchResults.map((movie) => (
                  <button
                    onClick={() =>
                      setEditingSchedule({
                        ...editingSchedule,
                        movie_id: movie._id,
                        movie_name: movie.title,
                      })
                    }
                    className='btn'
                    key={movie._id}
                  >
                    {movie.title}
                  </button>
                ))}
            </ul>
            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Thời gian bắt đầu</span>
              </div>
              <input
                type='datetime-local'
                value={ISOToTime(editingSchedule.start_time)}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    start_time: TimeToUnix(e.target.value),
                  })
                }
                className='input input-bordered w-full'
              />
            </label>

            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Giá vé</span>
              </div>
              <input
                type='number'
                value={editingSchedule.price}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    price: e.target.value,
                  })
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
