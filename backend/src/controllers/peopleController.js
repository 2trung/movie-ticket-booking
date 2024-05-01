import { peopleService } from '~/services/peopleService'
import { StatusCodes } from 'http-status-codes'

const getAll = async (req, res, next) => {
  try {
    const people = await peopleService.getAll(req.query)
    res.status(StatusCodes.OK).send(people)
  } catch (error) {
    next(error)
  }
}
const search = async (req, res, next) => {
  try {
    const people = await peopleService.search(req.query)
    res.status(StatusCodes.OK).send(people)
  } catch (error) {
    next(error)
  }
}
const getDetail = async (req, res, next) => {
  try {
    const person = await peopleService.getDetail(req.params)
    res.status(StatusCodes.OK).send(person)
  } catch (error) {
    next(error)
  }
}
const update = async (req, res, next) => {
  try {
    const updatedPerson = await peopleService.update(req.body)
    res.status(StatusCodes.OK).send(updatedPerson)
  } catch (error) {
    next(error)
  }
}
const create = async (req, res, next) => {
  try {
    const newPerson = await peopleService.create(req.body)
    res.status(StatusCodes.CREATED).send(newPerson)
  } catch (error) {
    next(error)
  }
}

export const peopleController = { getAll, search, getDetail, create, update }
