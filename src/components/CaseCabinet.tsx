import { useState, useRef } from 'react'
import {
  FolderKanban,
  ArrowLeft,
  Search,
  Upload,
  Lock,
  Unlock,
  FileText,
  FileSpreadsheet,
  File,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Trash2,
  Tag,
  X,
  Plus,
  ChevronDown,
  FolderUp,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { SecurityLevel, CaseFile } from '../types'
import { SECURITY_LEVEL_LABELS } from '../types'

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['pdf'].includes(ext || '')) return <FileText className="w-5 h-5" />
  if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-5 h-5" />
  if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="w-5 h-5" />
  return <File className="w-5 h-5" />
}

const getSecurityIcon = (level: SecurityLevel) => {
  switch (level) {
    case 'normal':
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />
    case 'internal':
      return <Shield className="w-4 h-4 text-blue-500" />
    case 'core':
      return <ShieldAlert className="w-4 h-4 text-amber-500" />
    case 'forbidden':
      return <ShieldX className="w-4 h-4 text-red-500" />
  }
}

const getSecurityBadgeClass = (level: SecurityLevel) => {
  switch (level) {
    case 'normal':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'internal':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'core':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'forbidden':
      return 'bg-red-50 text-red-700 border-red-200'
  }
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

interface ImportFileItem {
  name: string
  size: number
  securityLevel: SecurityLevel
}

interface ImportModalProps {
  onClose: () => void
}

const ImportModal = ({ onClose }: ImportModalProps) => {
  const { addFile, currentUser } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [caseNumber, setCaseNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [category, setCategory] = useState<CaseFile['category']>('合同')
  const [files, setFiles] = useState<ImportFileItem[]>([])

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const newFiles: ImportFileItem[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      newFiles.push({
        name: f.name,
        size: f.size,
        securityLevel: 'normal',
      })
    }
    setFiles((prev) => {
      const existingNames = new Set(prev.map((p) => p.name))
      const combined = [...prev]
      newFiles.forEach((nf) => {
        if (!existingNames.has(nf.name)) {
          combined.push(nf)
        }
      })
      return combined
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSecurityChange = (index: number, level: SecurityLevel) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, securityLevel: level } : f))
    )
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (files.length > 0 && caseNumber && clientName) {
      setStep(2)
    }
  }

  const handleSubmit = () => {
    files.forEach((f) => {
      addFile({
        name: f.name,
        caseNumber,
        clientName,
        category,
        securityLevel: f.securityLevel,
        size: f.size,
        uploader: currentUser.name,
      })
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">
            {step === 1 ? '导入案件材料' : '设置密级'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    案号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="例如：(2024)京民初字第001号"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    客户名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="例如：北京科技有限公司"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  文件类型
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(['合同', '证据', '庭审笔录', '其他'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        category === c
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  选择文件 <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <button
                  onClick={openFileDialog}
                  className="w-full border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-colors group"
                >
                  <div className="flex flex-col items-center gap-2 text-blue-600">
                    <FolderUp className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">点击选择本机文件</p>
                    <p className="text-xs text-blue-500">
                      支持 PDF、Word、Excel、图片等格式，可多选
                    </p>
                  </div>
                </button>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
                    {files.map((f, index) => (
                      <div
                        key={f.name + index}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                          {getFileIcon(f.name)}
                        </div>
                        <span className="flex-1 text-sm text-slate-700 truncate">{f.name}</span>
                        <span className="text-xs text-slate-400">{formatSize(f.size)}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>案号：</strong>{caseNumber} &nbsp;&nbsp;
                  <strong>客户：</strong>{clientName} &nbsp;&nbsp;
                  <strong>类型：</strong>{category}
                </p>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                为每份文件设置密级，高密级文件（核心、禁止外传）将自动移入安全隔离区
              </p>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {files.map((f, index) => (
                  <div
                    key={f.name + index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      (f.securityLevel === 'core' || f.securityLevel === 'forbidden')
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-slate-500 border border-slate-200">
                      {getFileIcon(f.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{f.name}</p>
                      <p className="text-xs text-slate-400">{formatSize(f.size)}</p>
                    </div>
                    <select
                      value={f.securityLevel}
                      onChange={(e) =>
                        handleSecurityChange(index, e.target.value as SecurityLevel)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getSecurityBadgeClass(
                        f.securityLevel
                      )} focus:outline-none cursor-pointer`}
                    >
                      <option value="normal">普通</option>
                      <option value="internal">内部</option>
                      <option value="core">核心</option>
                      <option value="forbidden">禁止外传</option>
                    </select>
                    {(f.securityLevel === 'core' || f.securityLevel === 'forbidden') && (
                      <Lock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              上一步
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              已选择 <span className="font-medium text-slate-700">{files.length}</span> 份文件
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              取消
            </button>
            {step === 1 ? (
              <button
                onClick={handleNext}
                disabled={files.length === 0 || !caseNumber || !clientName}
                className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                确认导入
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CaseCabinet = () => {
  const {
    setCurrentView,
    filterCaseNumber,
    filterClientName,
    setFilterCaseNumber,
    setFilterClientName,
    getHighSecurityFiles,
    getNormalFiles,
    updateFileSecurity,
    deleteFile,
    addAccessLog,
    currentUser,
  } = useAppStore()

  const [showImportModal, setShowImportModal] = useState(false)
  const [showSecurityMenu, setShowSecurityMenu] = useState<string | null>(null)
  const [activeZone, setActiveZone] = useState<'all' | 'normal' | 'high'>('all')

  const highSecurityFiles = getHighSecurityFiles()
  const normalFiles = getNormalFiles()

  const handleViewFile = (file: CaseFile) => {
    addAccessLog({
      fileId: file.id,
      fileName: file.name,
      caseNumber: file.caseNumber,
      clientName: file.clientName,
      action: 'view',
      operator: currentUser.name,
      operatorRole: currentUser.role,
      remark: '查看文件',
    })
  }

  const handleDownload = (file: CaseFile) => {
    addAccessLog({
      fileId: file.id,
      fileName: file.name,
      caseNumber: file.caseNumber,
      clientName: file.clientName,
      action: 'download',
      operator: currentUser.name,
      operatorRole: currentUser.role,
      remark: '下载文件',
    })
  }

  const handleUnlockRequest = (file: CaseFile) => {
    if (file.isInHighSecurityZone) {
      addAccessLog({
        fileId: file.id,
        fileName: file.name,
        caseNumber: file.caseNumber,
        clientName: file.clientName,
        action: 'unlock_request',
        operator: currentUser.name,
        operatorRole: currentUser.role,
        remark: '申请解锁高密级文件',
      })
      alert('已提交解锁申请，请等待合伙人审批')
    }
  }

  const FileCard = ({ file }: { file: CaseFile }) => (
    <div
      className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${
        file.isInHighSecurityZone
          ? 'border-amber-200 bg-amber-50/30'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            file.isInHighSecurityZone ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {getFileIcon(file.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-medium text-slate-800 truncate cursor-pointer hover:text-blue-600"
            onClick={() => handleViewFile(file)}
            title={file.name}
          >
            {file.name}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5" title={file.caseNumber}>{file.caseNumber}</p>
        </div>
        {file.isInHighSecurityZone && (
          <button
            onClick={() => handleUnlockRequest(file)}
            className="p-1.5 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
            title="申请解锁"
          >
            <Lock className="w-4 h-4 text-amber-600" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getSecurityBadgeClass(
            file.securityLevel
          )}`}
        >
          {getSecurityIcon(file.securityLevel)}
          {SECURITY_LEVEL_LABELS[file.securityLevel]}
        </span>
        <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
      </div>

      <div className="text-xs text-slate-400 mb-3 space-y-0.5">
        <p className="truncate" title={`客户：${file.clientName}`}>客户：{file.clientName}</p>
        <p>上传：{file.uploader} · {file.uploadTime}</p>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <div className="relative flex-1">
          <button
            onClick={() => setShowSecurityMenu(showSecurityMenu === file.id ? null : file.id)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              修改密级
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSecurityMenu === file.id && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
              {(['normal', 'internal', 'core', 'forbidden'] as SecurityLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    updateFileSecurity(file.id, level)
                    setShowSecurityMenu(null)
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center gap-2 ${
                    file.securityLevel === level ? 'font-medium bg-slate-50' : ''
                  }`}
                >
                  {getSecurityIcon(level)}
                  {SECURITY_LEVEL_LABELS[level]}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => handleDownload(file)}
          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
          title="下载"
        >
          <Upload className="w-4 h-4 rotate-180" />
        </button>
        <button
          onClick={() => deleteFile(file.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          title="删除"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800">案件文件柜</h1>
                <p className="text-xs text-slate-500">案件材料密级管理</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            导入文件
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filterCaseNumber}
                onChange={(e) => setFilterCaseNumber(e.target.value)}
                placeholder="按案号搜索..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filterClientName}
                onChange={(e) => setFilterClientName(e.target.value)}
                placeholder="按客户名搜索..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { key: 'all', label: '全部' },
                { key: 'normal', label: '普通区' },
                { key: 'high', label: '高密区' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveZone(tab.key as 'all' | 'normal' | 'high')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeZone === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(activeZone === 'all' || activeZone === 'high') && highSecurityFiles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">高安全隔离区</h2>
                <p className="text-xs text-slate-500">核心及禁止外传文件独立存储，需授权访问</p>
              </div>
              <span className="ml-auto px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                {highSecurityFiles.length} 份文件
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {highSecurityFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          </div>
        )}

        {(activeZone === 'all' || activeZone === 'normal') && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Unlock className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">普通文件区</h2>
                <p className="text-xs text-slate-500">普通及内部文件，可正常访问</p>
              </div>
              <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                {normalFiles.length} 份文件
              </span>
            </div>
            {normalFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {normalFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无普通文件</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
    </div>
  )
}

export default CaseCabinet
