'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  X,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Sprout,
  Calendar,
  ShieldCheck,
  UserX,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { users } from '@/lib/mock-data/users'
import { counties } from '@/lib/mock-data/counties'
import { formatDate } from '@/lib/utils/formatters'
import type { User } from '@/lib/types'

const roleBadge: Record<string, string> = {
  farmer: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'extension-officer': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
}

const statusBadge: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

const activityHistory = [
  'Checked rice prices for Montserrado',
  'Read tip: Cassava Yield Guide',
  'Updated farm profile',
  'Queried weather for Bong county',
  'Viewed market prices',
  'Added new crop to farm',
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [countyFilter, setCountyFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !u.name.toLowerCase().includes(q) &&
          !u.phone.includes(q) &&
          !(u.email?.toLowerCase().includes(q))
        ) {
          return false
        }
      }
      if (countyFilter && u.county !== countyFilter) return false
      if (roleFilter && u.role !== roleFilter) return false
      if (statusFilter && u.status !== statusFilter) return false
      return true
    })
  }, [searchQuery, countyFilter, roleFilter, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description={`${users.length} registered users across all counties`}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-agri-muted dark:text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full rounded-xl border border-agri-border bg-white py-2 pl-9 pr-3 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={countyFilter}
          onChange={(e) => setCountyFilter(e.target.value)}
          className="rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Roles</option>
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
          <option value="extension-officer">Extension Officer</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-agri-border bg-white dark:border-border dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-agri-border dark:border-border">
                <th className="py-3 pl-6 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  Name
                </th>
                <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground sm:table-cell">
                  Phone
                </th>
                <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground md:table-cell">
                  County
                </th>
                <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  Role
                </th>
                <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  Status
                </th>
                <th className="hidden py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground lg:table-cell">
                  Farm Size
                </th>
                <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground lg:table-cell">
                  Joined
                </th>
                <th className="py-3 pr-6 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="cursor-pointer border-b border-agri-border/50 transition-colors hover:bg-agri-hover dark:border-border/50 dark:hover:bg-muted"
                >
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary dark:bg-primary-900/30">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-agri-text dark:text-foreground">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-4 text-agri-muted dark:text-muted-foreground sm:table-cell">
                    {user.phone}
                  </td>
                  <td className="hidden py-3 pr-4 text-agri-text dark:text-foreground md:table-cell">
                    {user.county}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadge[user.role]}`}
                    >
                      {user.role.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="hidden py-3 pr-4 text-right text-agri-muted dark:text-muted-foreground lg:table-cell">
                    {user.farmSizeAcres > 0 ? `${user.farmSizeAcres} acres` : '—'}
                  </td>
                  <td className="hidden py-3 pr-4 text-agri-muted dark:text-muted-foreground lg:table-cell">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="py-3 pr-6 text-right">
                    <ChevronRight className="inline-block h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="py-8 text-center text-sm text-agri-muted dark:text-muted-foreground">
              No users found matching your filters.
            </p>
          )}
        </div>
      </div>

      {/* User Detail Side Panel */}
      {selectedUser && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedUser(null)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-agri-border bg-white shadow-2xl dark:border-border dark:bg-card">
            <div className="flex items-center justify-between border-b border-agri-border p-6 dark:border-border">
              <h2 className="text-lg font-bold text-agri-text dark:text-foreground">
                User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-hover dark:text-muted-foreground dark:hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Avatar & Name */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-2xl font-bold text-primary dark:bg-primary-900/30">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-agri-text dark:text-foreground">
                    {selectedUser.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadge[selectedUser.role]}`}>
                      {selectedUser.role.replace('-', ' ')}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[selectedUser.status]}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  <span className="text-agri-text dark:text-foreground">{selectedUser.phone}</span>
                </div>
                {selectedUser.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                    <span className="text-agri-text dark:text-foreground">{selectedUser.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  <span className="text-agri-text dark:text-foreground">{selectedUser.county}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Sprout className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  <span className="text-agri-text dark:text-foreground">
                    {selectedUser.primaryCrops.length > 0
                      ? selectedUser.primaryCrops.join(', ')
                      : 'No crops listed'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserCircle className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  <span className="text-agri-text dark:text-foreground">
                    Farm size: {selectedUser.farmSizeAcres > 0 ? `${selectedUser.farmSizeAcres} acres` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  <span className="text-agri-text dark:text-foreground">
                    Joined {formatDate(selectedUser.joinedAt)}
                  </span>
                </div>
              </div>

              {/* Activity History */}
              <div className="mt-8">
                <h4 className="mb-3 text-sm font-semibold text-agri-text dark:text-foreground">
                  Recent Activity
                </h4>
                <ul className="space-y-2">
                  {activityHistory.map((activity, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-agri-muted dark:text-muted-foreground"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-agri-border p-6 dark:border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`${selectedUser.status === 'active' ? 'Suspend' : 'Activate'} ${selectedUser.name}`)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    selectedUser.status === 'active'
                      ? 'bg-orange-50 text-warning hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900'
                      : 'bg-green-50 text-success hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900'
                  }`}
                >
                  {selectedUser.status === 'active' ? (
                    <>
                      <UserX className="h-4 w-4" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => alert(`Delete user ${selectedUser.name}?`)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
