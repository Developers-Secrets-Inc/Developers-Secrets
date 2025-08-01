'use client'

import { create } from 'zustand'

type SidebarDialogType = 
  | 'support'
  | 'feedback'
  | 'settings'
  | 'profile'
  | 'notifications'
  | 'achievements'
  | 'inventory'
  | 'leaderboard'
  | 'leagues'
  | 'marketplace'
  | 'quests'
  | null

interface DialogParams {
  [key: string]: any
}

interface SidebarDialogsStore {
  activeDialog: SidebarDialogType
  dialogParams: DialogParams
  openDialog: (dialogType: SidebarDialogType, params?: DialogParams) => void
  closeDialog: () => void
  updateDialogParams: (params: DialogParams) => void
  getActiveDialog: () => SidebarDialogType
  getDialogParams: () => DialogParams
  isDialogOpen: (dialogType: SidebarDialogType) => boolean
}

export const useSidebarDialogsStore = create<SidebarDialogsStore>((set, get) => ({
  activeDialog: null,
  dialogParams: {},

  openDialog: (dialogType: SidebarDialogType, params: DialogParams = {}) => {
    set({
      activeDialog: dialogType,
      dialogParams: params
    })
  },

  closeDialog: () => {
    set({
      activeDialog: null,
      dialogParams: {}
    })
  },

  updateDialogParams: (params: DialogParams) => {
    set((state) => ({
      dialogParams: { ...state.dialogParams, ...params }
    }))
  },

  getActiveDialog: () => get().activeDialog,
  getDialogParams: () => get().dialogParams,
  
  isDialogOpen: (dialogType: SidebarDialogType) => {
    return get().activeDialog === dialogType
  }
}))

export const useSidebarDialog = () => {
  const store = useSidebarDialogsStore()
  
  return {
    openDialog: store.openDialog,
    closeDialog: store.closeDialog,
    activeDialog: store.activeDialog,
    dialogParams: store.dialogParams,
    isDialogOpen: store.isDialogOpen
  }
}

export const useSpecificDialog = (dialogType: Exclude<SidebarDialogType, null>) => {
  const store = useSidebarDialogsStore()
  
  return {
    open: (params?: DialogParams) => store.openDialog(dialogType, params),
    close: store.closeDialog,
    isOpen: store.isDialogOpen(dialogType),
    params: store.isDialogOpen(dialogType) ? store.dialogParams : {}
  }
}