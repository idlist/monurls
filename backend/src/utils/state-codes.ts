interface StateType {
  [property: number]: string
}

const StateCodes: StateType = {
  100: 'Unknown issue.',
  101: 'Not authorized.',
  102: 'No data sent.',
  103: 'The destination URL is duplicated.',
  104: 'The record is not found',
  105: 'Parameter is invalid.',
  404: 'Not found.',
  418: 'I\'m a teapot.',
  429: 'Too many requests.'
}

interface ServerState {
  code: number
  message?: string
}

class State {
  static success(payload?: Record<string, unknown>): ServerState {
    return {
      code: 0,
      ...payload
    }
  }
  static error(code: keyof StateType): ServerState {
    return {
      code: code,
      message: StateCodes[code]
    }
  }
}

export default State
export type { ServerState }