import { randomInt } from 'crypto'

const dict = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const randomString = (length: number): string => {
  let short = ''
  for (let i = 0; i < length; i++) {
    short += dict[randomInt(0, dict.length)]
  }
  return short
}

export default randomString