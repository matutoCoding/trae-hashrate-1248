import { useState } from 'react'
import {
  History,
  ArrowLeft,
  Search,
  Eye,
  Download,
  Unlock,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  File,
  Filter,
  User,
  Clock,
  FileQuestion,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { AccessAction } from '../types'
import { ACCESS_ACTION_LABELS } from '../types'

const getActionIcon = (action: AccessAction) => {
  switch (action) {
    case 'view':
      return <Eye className="w-4 h-4" />
    case 'download':
      return <Download className="w-4 h-4" />
    case 'unlock_request':
      return <Unlock className="w-4 h-4" />
    case 'unlock_approve':
      return <ShieldCheck className="w-4 h-4" />
  }
}

const getActionColor = (action: AccessAction) => {
  switch (action) {
    case 'view':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'download':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200'
    case 'unlock_request':
      return 'bg-amber-50 text-amber-600 border-amber-200'
    case 'unlock_approve':
      return 'bg-purple-50 text-purple-600 border-purple-200'
  }
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['pdf'].includes(ext || '')) return <FileText className="w-4 h-4" />
  if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-4 h-4" />
  if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="w-4 h-4" />
  return <File className="w-4 h-4" />
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case '合伙人':
      return 'bg-purple-50 text-purple-600'
    case '律师助理':
      return 'bg-blue-50 text-blue-600'
    case '档案管理员':
      return 'bg-emerald-50 text-emerald-600'
    default:
      return 'bg-slate-50 text-slate-600'
  }
}

const AccessLogs = () => {
  const { setCurrentView, accessLogs } = useAppStore()
  const [filterCaseNumber, setFilterCaseNumber] = useState('')
  const [filterAction, setFilterAction] = useState<AccessAction | ''>('')
  const [filterOperator, setFilterOperator] = useState('')

  const filteredLogs = accessLogs.filter((log) => {
    const matchCase = !filterCaseNumber || log.caseNumber.includes(filterCaseNumber)
    const matchAction = !filterAction || log.action === filterAction
    const matchOperator = !filterOperator || log.operator.includes(filterOperator)
    return matchCase && matchAction && matchOperator
  })

  const viewCount = filteredLogs.filter((l) => l.action === 'view').length
  const downloadCount = filteredLogs.filter((l) => l.action === 'download').length
  const unlockRequestCount = filteredLogs.filter((l) => l.action === 'unlock_request').length
  const unlockApproveCount = filteredLogs.filter((l) => l.action === 'unlock_approve').length

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
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800">借阅记录</h1>
                <p className="text-xs text-slate-500">文件操作历史追溯</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              共 <span className="font-medium text-slate-700">{filteredLogs.length}</span> 条记录
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{viewCount}</p>
                <p className="text-xs text-slate-500">查看操作</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{downloadCount}</p>
                <p className="text-xs text-slate-500">下载操作</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Unlock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{unlockRequestCount}</p>
                <p className="text-xs text-slate-500">解锁申请</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{unlockApproveCount}</p>
                <p className="text-xs text-slate-500">解锁审批</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">筛选条件</span>
              </div>
              <div className="flex-1 min-w-[180px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={filterCaseNumber}
                  onChange={(e) => setFilterCaseNumber(e.target.value)}
                  placeholder="按案号筛选..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="w-40 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  placeholder="按操作人筛选..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as AccessAction | '')}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部操作</option>
                <option value="view">查看</option>
                <option value="download">下载</option>
                <option value="unlock_request">申请解锁</option>
                <option value="unlock_approve">解锁审批</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="py-16 text-center">
                <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无符合条件的记录</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      操作时间
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      文件名
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      案号/客户
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      操作类型
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      操作人
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      备注
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {log.timestamp}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                            {getFileIcon(log.fileName)}
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            {log.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">{log.caseNumber}</p>
                        <p className="text-xs text-slate-500">{log.clientName}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {getActionIcon(log.action)}
                          {ACCESS_ACTION_LABELS[log.action]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{log.operator}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getRoleBadgeClass(log.operatorRole)}`}>
                              {log.operatorRole}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-500 max-w-[200px] truncate">
                          {log.remark || '-'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <p className="text-xs text-slate-500">
              显示 <span className="font-medium text-slate-700">{filteredLogs.length}</span> 条记录
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded border border-slate-300">
                上一页
              </button>
              <button className="px-3 py-1 text-xs bg-emerald-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded border border-slate-300">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessLogs
