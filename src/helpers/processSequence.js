/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  allPass, compose, ifElse,
  partialRight, pipe, prop,
  tap, length, gt, test,
  not, over, lensProp, curry, lt,
  andThen, otherwise, isNil, identity
} from "ramda";
import {pipeAsync} from "ramda-async";

const api = new Api();

const getValue = prop('value')
const getErrorHandler = prop('handleError')
const logValue = tap(({value, writeLog}) => !isNil(value) ? writeLog(value) : null)
const isLowerThan10 = compose(gt(10), length, getValue)
const isGreaterThan2 = compose(lt(2), length, getValue)
const isPositive = compose(lt(0), Number, getValue)
const hasNotInvalidChars = compose(not, test(/[^.\d]/g), getValue)
const throwValidationError = compose(handler => handler('Validation error'), getErrorHandler)
const roundValue = compose(Math.floor, Number)
const validations = allPass([
    isLowerThan10,
    isGreaterThan2,
    isPositive,
    hasNotInvalidChars
])

const request = curry((url, obj) => pipe(
  () => api.get(url, {from: 10, to: 2, number: obj.value})
)(obj))

// Flow functions
const roundValueHandler = compose(logValue, over(lensProp('value'), roundValue))
const requestBinaryHandler = obj => pipe(
  request('https://api.tech/numbers/base'),
  otherwise(compose(
    () => ({result: undefined}),
    obj.handleError
  )),
  andThen(({result}) => ({...obj, value: result})),
  andThen(logValue)
)(obj)

// Empty handlers
const emptyValueHandler = ifElse(compose(isNil, getValue), identity)

const requestAnimalHandler = emptyValueHandler(obj => pipe(
  request(`https://animals.tech/${obj.value}`),
  otherwise(compose(
    obj.handleError
  )),
  andThen(({result}) => result),
  andThen(obj.handleSuccess)
)(obj))

const valueLengthHandler = emptyValueHandler(compose(
  logValue,
  over(lensProp('value'), length),
))

const valuePowHandler = emptyValueHandler(compose(
  logValue,
  over(lensProp('value'), partialRight(Math.pow, [2])),
))

const valueModuloHandler = emptyValueHandler(compose(
  logValue,
  over(lensProp('value'), x => x % 3),
))

const runWorkflow = pipeAsync(
  roundValueHandler,
  requestBinaryHandler,
  valueLengthHandler,
  valuePowHandler,
  valueModuloHandler,
  requestAnimalHandler
)

// Entry point
const processSequence = pipe(
  logValue,
  ifElse(
    validations,
    runWorkflow,
    throwValidationError
  ),
)


export default processSequence;
