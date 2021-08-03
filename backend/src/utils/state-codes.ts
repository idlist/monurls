interface TStateCodes {
  [property: number]: string
}

const StateCodes: TStateCodes = {
  100: 'Unknown issue.',
  101: 'Not authorized.',
  102: 'No data sent.',
  103: 'The destination URL is duplicated.'
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
  static error(code: number): ServerState {
    return {
      code: code,
      message: StateCodes[code]
    }
  }
}

export default State
export type { ServerState }