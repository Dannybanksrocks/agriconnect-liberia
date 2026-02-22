'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Archive,
  Trash2,
  X,
  Eye,
  BookOpen,
} from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'

type TipStatus = 'published' | 'draft' | 'archived'
type TabFilter = 'all' | TipStatus

interface TipRow {
  id: string
  title: string
  category: string
  status: TipStatus
  publishedAt: string
  views: number
}

const tipsData: TipRow[] = [
  { id: 't1', title: 'How to Maximize Cassava Yield During Rainy Season', category: 'Cassava', status: 'published', publishedAt: '2026-01-15', views: 1247 },
  { id: 't2', title: 'Wet Rice Cultivation: A Complete Guide', category: 'Rice', status: 'published', publishedAt: '2026-01-12', views: 982 },
  { id: 't3', title: 'Natural Pest Control for Vegetable Gardens', category: 'Pest Control', status: 'published', publishedAt: '2026-01-08', views: 756 },
  { id: 't4', title: 'Soil Testing Made Simple for Liberian Farms', category: 'Soil', status: 'published', publishedAt: '2025-12-20', views: 634 },
  { id: 't5', title: 'Cocoa Fermentation Best Practices', category: 'Post-Harvest', status: 'published', publishedAt: '2025-12-15', views: 521 },
  { id: 't6', title: 'Dry Season Vegetable Irrigation Tips', category: 'Vegetables', status: 'draft', publishedAt: '', views: 0 },
  { id: 't7', title: 'Coffee Processing for Export Quality', category: 'Post-Harvest', status: 'draft', publishedAt: '', views: 0 },
  { id: 't8', title: 'Groundnut Planting Calendar 2026', category: 'Rice', status: 'draft', publishedAt: '', views: 0 },
  { id: 't9', title: 'Outdated: 2024 Planting Season Guide', category: 'Cassava', status: 'archived', publishedAt: '2024-04-01', views: 2103 },
  { id: 't10', title: 'Palm Oil Extraction Traditional Methods', category: 'Post-Harvest', status: 'archived', publishedAt: '2024-06-10', views: 1456 },
]

const statusColors: Record<TipStatus, string> = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const categoryOptions = [
  'Rice',
  'Cassava',
  'Vegetables',
  'Soil',
  'Pest Control',
  'Post-Harvest',
]

export default function AdminContentPage() {
  const [tips, setTips] = useState(tipsData)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formSummary, setFormSummary] = useState('')
  const [formBody, setFormBody] = useState('')
  const [formFeatured, setFormFeatured] = useState(false)
  const [formTags, setFormTags] = useState('')

  const tabs: { key: TabFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Draft' },
    { key: 'archived', label: 'Archived' },
  ]

  const filteredTips = useMemo(() => {
    let result = tips
    if (activeTab !== 'all') {
      result = result.filter((t) => t.status === activeTab)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [tips, activeTab, searchQuery])

  const handleCreateTip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle || !formCategory) {
      alert('Please fill in title and category')
      return
    }
    const newTip: TipRow = {
      id: `t${Date.now()}`,
      title: formTitle,
      category: formCategory,
      status: 'draft',
      publishedAt: '',
      views: 0,
    }
    setTips([newTip, ...tips])
    setShowModal(false)
    resetForm()
    alert('Tip created as draft!')
  }

  const resetForm = () => {
    setFormTitle('')
    setFormCategory('')
    setFormSummary('')
    setFormBody('')
    setFormFeatured(false)
    setFormTags('')
  }

  const handleArchive = (id: string) => {
    setTips(tips.map((t) => (t.id === id ? { ...t, status: 'archived' as TipStatus } : t)))
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this tip permanently?')) {
      setTips(tips.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Create and manage agronomy tips for farmers"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Create New Tip
          </button>
        }
      />

      {/* Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-agri-bg p-1 dark:bg-muted">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-agri-text shadow-sm dark:bg-card dark:text-foreground'
                  : 'text-agri-muted hover:text-agri-text dark:text-muted-foreground dark:hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-agri-muted dark:text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tips..."
            className="rounded-xl border border-agri-border bg-white py-2 pl-9 pr-3 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tips Table */}
      <div className="rounded-2xl border border-agri-border bg-white dark:border-border dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-agri-border dark:border-border">
                <th className="py-3 pl-6 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  Title
                </th>
                <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground sm:table-cell">
                  Category
                </th>
                <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  Status
                </th>
                <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground md:table-cell">
                  Published
                </th>
                <th className="hidden py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground sm:table-cell">
                  Views
                </th>
                <th className="py-3 pr-6 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTips.map((tip) => (
                <tr
                  key={tip.id}
                  className="border-b border-agri-border/50 transition-colors hover:bg-agri-hover dark:border-border/50 dark:hover:bg-muted"
                >
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="hidden h-4 w-4 shrink-0 text-primary sm:block" />
                      <span className="font-medium text-agri-text dark:text-foreground line-clamp-1">
                        {tip.title}
                      </span>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-4 text-agri-muted dark:text-muted-foreground sm:table-cell">
                    {tip.category}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[tip.status]}`}
                    >
                      {tip.status.charAt(0).toUpperCase() + tip.status.slice(1)}
                    </span>
                  </td>
                  <td className="hidden py-3 pr-4 text-agri-muted dark:text-muted-foreground md:table-cell">
                    {tip.publishedAt || '—'}
                  </td>
                  <td className="hidden py-3 pr-4 text-right text-agri-muted dark:text-muted-foreground sm:table-cell">
                    <span className="flex items-center justify-end gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {tip.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Edit: ${tip.title}`)}
                        className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-hover hover:text-primary dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-primary"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(tip.id)}
                        className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-orange-50 hover:text-warning dark:text-muted-foreground dark:hover:bg-orange-950 dark:hover:text-warning"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tip.id)}
                        className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-red-50 hover:text-danger dark:text-muted-foreground dark:hover:bg-red-950 dark:hover:text-danger"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTips.length === 0 && (
            <p className="py-8 text-center text-sm text-agri-muted dark:text-muted-foreground">
              No tips found.
            </p>
          )}
        </div>
      </div>

      {/* Create Tip Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-agri-border bg-white p-6 shadow-2xl dark:border-border dark:bg-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-agri-text dark:text-foreground">
                Create New Tip
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-hover dark:text-muted-foreground dark:hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTip} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter tip title..."
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category...</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Summary
                </label>
                <textarea
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  rows={2}
                  placeholder="Brief summary for preview..."
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Body
                </label>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  rows={5}
                  placeholder="Full tip content..."
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-agri-text dark:text-foreground">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-agri-border text-primary focus:ring-primary"
                  />
                  Featured tip
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g. cassava, rainy-season, planting"
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="rounded-xl border border-agri-border px-4 py-2 text-sm font-medium text-agri-text transition-colors hover:bg-agri-hover dark:border-border dark:text-foreground dark:hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
                >
                  Create Tip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
