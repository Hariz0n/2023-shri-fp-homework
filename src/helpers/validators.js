/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
  allPass, any, anyPass,
  compose, count, countBy,
  equals, filter, identity,
  length, lte, not, omit,
  pick, prop, props, values
} from "ramda";

const isWhite = equals('white');
const isRed = equals('red');
const isBlue = equals('blue');
const isGreen = equals('green');
const isOrange = equals('orange');
const getCircle = prop('circle')
const getTriangle = prop('triangle')
const getSquare = prop('square')
const getStar = prop('star')
const propsValues = props(['circle', 'triangle', 'square', 'star'])

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  compose(isRed, getStar),
  compose(isGreen, getSquare),
  compose(isWhite, getTriangle),
  compose(isWhite, getCircle)
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
  lte(2),
  count(isGreen),
  propsValues
)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
  ([a, b]) => a === b,
  values,
  countBy(identity),
  filter(anyPass([isRed, isBlue])),
  propsValues
)

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  compose(isBlue, getCircle),
  compose(isRed, getStar),
  compose(isOrange, getSquare),
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  any(lte(3)),
  values,
  omit(['white']),
  countBy(identity),
  propsValues
)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  compose(isGreen, getTriangle),
  compose(
    equals(2),
    length,
    filter(isGreen),
    propsValues
  ),
  compose(
    lte(1),
    length,
    filter(isRed),
    propsValues
  )
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(
  equals(4),
  count(isOrange),
  propsValues
)

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
  not,
  anyPass([
    compose(isRed, getStar),
    compose(isWhite, getStar()),
  ])
)

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
  compose(isGreen, getStar),
  compose(isGreen, getSquare),
  compose(isGreen, getTriangle),
  compose(isGreen, getCircle)
])

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  compose(not, isWhite, getTriangle),
  compose(not, isWhite, getSquare),
  compose(
    ([a, b]) => a === b,
    values,
    pick(['triangle', 'square'])
  )
])
