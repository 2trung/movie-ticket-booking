import { peopleModel } from '~/models/peopleModel'

const getAll = async (reqQuery) => {
  try {
    const people = await peopleModel.getAll(
      parseInt(reqQuery.page),
      parseInt(reqQuery.pageSize)
    )
    return { message: 'Lấy dữ liệu thành công', data: people }
  } catch (error) {
    throw new Error(error)
  }
}
const search = async (reqQuery) => {
  try {
    const people = await peopleModel.search(
      reqQuery.keyword,
      parseInt(reqQuery.page),
      parseInt(reqQuery.pageSize)
    )
    return { message: 'Lấy dữ liệu thành công', data: people }
  } catch (error) {
    throw new Error(error)
  }
}
const getDetail = async (reqParams) => {
  try {
    const person = await peopleModel.getById(reqParams.id)
    return { message: 'Lấy dữ liệu thành công', data: person }
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (reqBody) => {
  try {
    const updatedPerson = await peopleModel.update(reqBody)
    return { message: 'Cập nhật thành công', data: updatedPerson }
  } catch (error) {
    throw new Error(error)
  }
}

const create = async (reqBody) => {
  try {
    const newPerson = await peopleModel.create(reqBody)
    return { message: 'Tạo mới thành công', data: newPerson }
  } catch (error) {
    throw new Error(error)
  }
}

export const peopleService = { getAll, search, getDetail, create, update }
