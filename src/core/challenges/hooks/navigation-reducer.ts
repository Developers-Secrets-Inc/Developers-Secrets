export type NavigationState = {
  showConfirmDialog: boolean
  pendingPath: string | null
  unlockedPaths: string[]
}

export type NavigationAction =
  | { type: 'SET_SHOW_CONFIRM_DIALOG'; payload: boolean }
  | { type: 'SET_PENDING_PATH'; payload: string | null }
  | { type: 'UNLOCK_PATHS'; payload: string[] }
  | { type: 'INITIALIZE_UNLOCKED_PATHS'; payload: string[] }

export const initialNavigationState: NavigationState = {
  showConfirmDialog: false,
  pendingPath: null,
  unlockedPaths: [],
}

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case 'SET_SHOW_CONFIRM_DIALOG':
      return {
        ...state,
        showConfirmDialog: action.payload,
      }
    case 'SET_PENDING_PATH':
      return {
        ...state,
        pendingPath: action.payload,
      }
    case 'UNLOCK_PATHS':
      return {
        ...state,
        unlockedPaths: [...new Set([...state.unlockedPaths, ...action.payload])],
      }
    case 'INITIALIZE_UNLOCKED_PATHS':
      return {
        ...state,
        unlockedPaths: action.payload,
      }
    default:
      return state
  }
}
