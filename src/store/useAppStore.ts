import { create } from 'zustand'
import type { CaseFile, AccessLogEntry, SecurityLevel, AccessAction } from '../types'

interface AppState {
  currentView: 'home' | 'cabinet' | 'review' | 'logs'
  files: CaseFile[]
  accessLogs: AccessLogEntry[]
  currentUser: { name: string; role: '合伙人' | '律师助理' | '档案管理员' }
  selectedFileIds: string[]
  reviewResults: Map<string, { status: string; reason: string }>
  filterCaseNumber: string
  filterClientName: string

  setCurrentView: (view: 'home' | 'cabinet' | 'review' | 'logs') => void
  addFile: (file: Omit<CaseFile, 'id' | 'uploadTime' | 'isInHighSecurityZone'>) => void
  updateFileSecurity: (fileId: string, level: SecurityLevel) => void
  deleteFile: (fileId: string) => void
  toggleFileSelection: (fileId: string) => void
  clearSelection: () => void
  addAccessLog: (entry: Omit<AccessLogEntry, 'id' | 'timestamp'>) => void
  setFilterCaseNumber: (value: string) => void
  setFilterClientName: (value: string) => void
  getFilteredFiles: () => CaseFile[]
  getHighSecurityFiles: () => CaseFile[]
  getNormalFiles: () => CaseFile[]
  performReview: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

const mockFiles: CaseFile[] = [
  {
    id: generateId(),
    name: '股权转让协议_最终版.pdf',
    caseNumber: '(2024)京民初字第001号',
    clientName: '北京科技有限公司',
    category: '合同',
    securityLevel: 'core',
    size: 2048000,
    uploadTime: '2024-06-15 10:30:00',
    uploader: '张律师',
    authorizedBy: '李合伙人',
    authorizedAt: '2024-06-15 11:00:00',
    isInHighSecurityZone: true,
  },
  {
    id: generateId(),
    name: '银行流水明细.xlsx',
    caseNumber: '(2024)京民初字第001号',
    clientName: '北京科技有限公司',
    category: '证据',
    securityLevel: 'forbidden',
    size: 512000,
    uploadTime: '2024-06-16 09:15:00',
    uploader: '王助理',
    isInHighSecurityZone: true,
  },
  {
    id: generateId(),
    name: '庭审笔录_第一次.docx',
    caseNumber: '(2024)京民初字第001号',
    clientName: '北京科技有限公司',
    category: '庭审笔录',
    securityLevel: 'internal',
    size: 128000,
    uploadTime: '2024-06-18 14:20:00',
    uploader: '张律师',
    isInHighSecurityZone: false,
  },
  {
    id: generateId(),
    name: '客户授权委托书.pdf',
    caseNumber: '(2024)沪民初字第023号',
    clientName: '上海贸易集团',
    category: '合同',
    securityLevel: 'normal',
    size: 256000,
    uploadTime: '2024-06-10 16:45:00',
    uploader: '刘助理',
    isInHighSecurityZone: false,
  },
  {
    id: generateId(),
    name: '专利侵权鉴定报告.pdf',
    caseNumber: '(2024)沪民初字第023号',
    clientName: '上海贸易集团',
    category: '证据',
    securityLevel: 'core',
    size: 3072000,
    uploadTime: '2024-06-12 08:30:00',
    uploader: '陈合伙人',
    authorizedBy: '陈合伙人',
    authorizedAt: '2024-06-12 09:00:00',
    isInHighSecurityZone: true,
  },
  {
    id: generateId(),
    name: '劳动合同模板.docx',
    caseNumber: '(2024)穗民初字第045号',
    clientName: '广州制造企业',
    category: '合同',
    securityLevel: 'normal',
    size: 64000,
    uploadTime: '2024-06-08 11:00:00',
    uploader: '赵助理',
    isInHighSecurityZone: false,
  },
]

const mockLogs: AccessLogEntry[] = [
  {
    id: generateId(),
    fileId: mockFiles[0].id,
    fileName: mockFiles[0].name,
    caseNumber: mockFiles[0].caseNumber,
    clientName: mockFiles[0].clientName,
    action: 'view',
    operator: '张律师',
    operatorRole: '合伙人',
    timestamp: '2024-06-20 10:30:00',
    remark: '案件审查',
  },
  {
    id: generateId(),
    fileId: mockFiles[1].id,
    fileName: mockFiles[1].name,
    caseNumber: mockFiles[1].caseNumber,
    clientName: mockFiles[1].clientName,
    action: 'download',
    operator: '王助理',
    operatorRole: '律师助理',
    timestamp: '2024-06-20 14:20:00',
    remark: '准备庭审材料',
  },
  {
    id: generateId(),
    fileId: mockFiles[1].id,
    fileName: mockFiles[1].name,
    caseNumber: mockFiles[1].caseNumber,
    clientName: mockFiles[1].clientName,
    action: 'unlock_request',
    operator: '王助理',
    operatorRole: '律师助理',
    timestamp: '2024-06-20 14:25:00',
    remark: '需要外发给会计师事务所',
  },
  {
    id: generateId(),
    fileId: mockFiles[2].id,
    fileName: mockFiles[2].name,
    caseNumber: mockFiles[2].caseNumber,
    clientName: mockFiles[2].clientName,
    action: 'view',
    operator: '李档案员',
    operatorRole: '档案管理员',
    timestamp: '2024-06-21 09:00:00',
    remark: '档案归档检查',
  },
  {
    id: generateId(),
    fileId: mockFiles[4].id,
    fileName: mockFiles[4].name,
    caseNumber: mockFiles[4].caseNumber,
    clientName: mockFiles[4].clientName,
    action: 'unlock_approve',
    operator: '陈合伙人',
    operatorRole: '合伙人',
    timestamp: '2024-06-21 11:30:00',
    remark: '同意外发给客户',
  },
]

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'home',
  files: mockFiles,
  accessLogs: mockLogs,
  currentUser: { name: '王助理', role: '律师助理' },
  selectedFileIds: [],
  reviewResults: new Map(),
  filterCaseNumber: '',
  filterClientName: '',

  setCurrentView: (view) => set({ currentView: view }),

  addFile: (fileData) => {
    const newFile: CaseFile = {
      ...fileData,
      id: generateId(),
      uploadTime: new Date().toLocaleString('zh-CN'),
      isInHighSecurityZone: fileData.securityLevel === 'core' || fileData.securityLevel === 'forbidden',
    }
    set((state) => ({ files: [newFile, ...state.files] }))
    get().addAccessLog({
      fileId: newFile.id,
      fileName: newFile.name,
      caseNumber: newFile.caseNumber,
      clientName: newFile.clientName,
      action: 'view',
      operator: get().currentUser.name,
      operatorRole: get().currentUser.role,
      remark: '上传文件',
    })
  },

  updateFileSecurity: (fileId, level) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId
          ? {
              ...f,
              securityLevel: level,
              isInHighSecurityZone: level === 'core' || level === 'forbidden',
            }
          : f
      ),
    }))
  },

  deleteFile: (fileId) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
      selectedFileIds: state.selectedFileIds.filter((id) => id !== fileId),
    }))
  },

  toggleFileSelection: (fileId) => {
    set((state) => ({
      selectedFileIds: state.selectedFileIds.includes(fileId)
        ? state.selectedFileIds.filter((id) => id !== fileId)
        : [...state.selectedFileIds, fileId],
    }))
  },

  clearSelection: () => set({ selectedFileIds: [], reviewResults: new Map() }),

  addAccessLog: (entry) => {
    const newEntry: AccessLogEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toLocaleString('zh-CN'),
    }
    set((state) => ({ accessLogs: [newEntry, ...state.accessLogs] }))
  },

  setFilterCaseNumber: (value) => set({ filterCaseNumber: value }),
  setFilterClientName: (value) => set({ filterClientName: value }),

  getFilteredFiles: () => {
    const { files, filterCaseNumber, filterClientName } = get()
    return files.filter((f) => {
      const matchCase = !filterCaseNumber || f.caseNumber.includes(filterCaseNumber)
      const matchClient = !filterClientName || f.clientName.includes(filterClientName)
      return matchCase && matchClient
    })
  },

  getHighSecurityFiles: () => {
    return get().getFilteredFiles().filter((f) => f.isInHighSecurityZone)
  },

  getNormalFiles: () => {
    return get().getFilteredFiles().filter((f) => !f.isInHighSecurityZone)
  },

  performReview: () => {
    const { files, selectedFileIds } = get()
    const results = new Map<string, { status: string; reason: string }>()

    selectedFileIds.forEach((fileId) => {
      const file = files.find((f) => f.id === fileId)
      if (!file) return

      let status: 'allowed' | 'needs_partner' | 'forbidden'
      let reason: string

      switch (file.securityLevel) {
        case 'normal':
          status = 'allowed'
          reason = '普通密级文件，可直接外发'
          break
        case 'internal':
          if (file.authorizedBy) {
            status = 'allowed'
            reason = `内部文件，已由${file.authorizedBy}授权`
          } else {
            status = 'needs_partner'
            reason = '内部文件，缺少授权人确认，需合伙人审批'
          }
          break
        case 'core':
          if (file.authorizedBy && file.authorizedAt) {
            status = 'needs_partner'
            reason = `核心文件，已由${file.authorizedBy}初步授权，外发需合伙人最终确认`
          } else {
            status = 'needs_partner'
            reason = '核心文件，缺少授权人确认，必须经合伙人审批'
          }
          break
        case 'forbidden':
          status = 'forbidden'
          reason = '禁止外传文件，不得外发给任何外部方'
          break
        default:
          status = 'forbidden'
          reason = '未知密级，禁止外发'
      }

      results.set(fileId, { status, reason })
    })

    set({ reviewResults: results })
  },
}))
