'use client'

import { useState } from 'react'
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Filter, DollarSign, Archive } from 'lucide-react'
import { inventoryItems, inventoryTransactions } from '@/lib/mock-data/inventory'
import { toast } from 'sonner'
import type { InventorySummary } from '@/lib/types/inventory'

export default function InventoryPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)

  // Calculate summary
  const summary: InventorySummary = inventoryItems.reduce((acc, item) => {
    const transactions = inventoryTransactions.filter(t => t.inventoryItemId === item.id)
    const harvest = transactions.find(t => t.type === 'harvest')
    const sales = transactions.filter(t => t.type === 'sale')
    const losses = transactions.filter(t => t.type === 'loss')

    if (harvest) {
      acc.totalHarvested += harvest.quantityKg
    }

    sales.forEach(sale => {
      acc.totalSold += sale.quantityKg
      if (sale.totalPriceLRD) {
        acc.totalRevenueLRD += sale.totalPriceLRD
      }
    })

    losses.forEach(loss => {
      acc.totalLost += loss.quantityKg
    })

    if (item.status === 'in-stock') {
      acc.totalInStock += item.quantityKg
    }

    return acc
  }, {
    totalHarvested: 0,
    totalSold: 0,
    totalLost: 0,
    totalInStock: 0,
    totalRevenueLRD: 0,
    averagePriceLRD: 0,
    lossPercentage: 0,
  })

  summary.lossPercentage = summary.totalHarvested > 0 
    ? (summary.totalLost / summary.totalHarvested) * 100 
    : 0

  summary.averagePriceLRD = summary.totalSold > 0
    ? summary.totalRevenueLRD / summary.totalSold
    : 0

  // Filter items
  const filteredItems = selectedStatus === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.status === selectedStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your harvest, sales, and post-harvest losses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Harvest
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Package}
          label="Total Harvested"
          value={`${summary.totalHarvested.toLocaleString()} kg`}
          color="blue"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Total Sold"
          value={`${summary.totalSold.toLocaleString()} kg`}
          subValue={`L$${summary.totalRevenueLRD.toLocaleString()}`}
          color="green"
        />
        <SummaryCard
          icon={Archive}
          label="In Stock"
          value={`${summary.totalInStock.toLocaleString()} kg`}
          color="purple"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Post-Harvest Loss"
          value={`${summary.totalLost.toLocaleString()} kg`}
          subValue={`${summary.lossPercentage.toFixed(1)}% of harvest`}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex gap-2">
          <FilterButton
            active={selectedStatus === 'all'}
            onClick={() => setSelectedStatus('all')}
            label="All"
            count={inventoryItems.length}
          />
          <FilterButton
            active={selectedStatus === 'in-stock'}
            onClick={() => setSelectedStatus('in-stock')}
            label="In Stock"
            count={inventoryItems.filter(i => i.status === 'in-stock').length}
          />
          <FilterButton
            active={selectedStatus === 'sold'}
            onClick={() => setSelectedStatus('sold')}
            label="Sold"
            count={inventoryItems.filter(i => i.status === 'sold').length}
          />
          <FilterButton
            active={selectedStatus === 'lost'}
            onClick={() => setSelectedStatus('lost')}
            label="Lost"
            count={inventoryItems.filter(i => i.status === 'lost').length}
          />
        </div>
      </div>

      {/* Inventory Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No inventory items</h3>
          <p className="text-gray-600 dark:text-gray-400">Add your first harvest to start tracking</p>
        </div>
      )}

      {/* Add Form Modal - Simplified for demo */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Harvest</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This feature is coming soon. For now, harvest tracking is done through the My Farm section.
            </p>
            <button
              onClick={() => setShowAddForm(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, subValue, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subValue && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  )
}

function FilterButton({ active, onClick, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label} ({count})
    </button>
  )
}

function InventoryCard({ item }: any) {
  const transactions = inventoryTransactions.filter(t => t.inventoryItemId === item.id)
  const saleTransaction = transactions.find(t => t.type === 'sale')
  const lossTransaction = transactions.find(t => t.type === 'loss')

  const statusColors = {
    'in-stock': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'sold': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'lost': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    'personal-use': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{item.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.cropName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Harvested: {new Date(item.harvestDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[item.status as keyof typeof statusColors]}`}>
          {item.status.replace('-', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {item.quantityKg} {item.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Quality</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {item.qualityGrade}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Storage</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {item.storageLocation}
          </p>
        </div>
        {saleTransaction && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sold For</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              L${saleTransaction.totalPriceLRD?.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {saleTransaction && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buyer</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{saleTransaction.buyerName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{saleTransaction.buyerPhone}</p>
        </div>
      )}

      {lossTransaction && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-red-600 dark:text-red-400 mb-1 font-medium">Loss Reason: {lossTransaction.lossReason}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{lossTransaction.lossDetails}</p>
        </div>
      )}

      {item.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{item.notes}</p>
        </div>
      )}
    </div>
  )
}
