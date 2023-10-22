import { test, expect} from 'vitest'

function sum(a: number, b: number) {
  return a + b
}

test("Add 2 numbers", () => {
  expect(sum(2,3)).toEqual(5)
})