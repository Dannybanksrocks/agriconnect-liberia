import {
  AlertTriangle,
  CheckCircle,
  Info,
  Sprout,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import type { WeatherForecast } from '@/lib/types'

const alertConfig: Record<
  string,
  { icon: LucideIcon; borderColor: string; iconColor: string; bgColor: string }
> = {
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-l-warning',
    iconColor: 'text-warning',
    bgColor: 'bg-secondary-50 dark:bg-warning/10',
  },
  success: {
    icon: CheckCircle,
    borderColor: 'border-l-success',
    iconColor: 'text-success',
    bgColor: 'bg-primary-50 dark:bg-success/10',
  },
  info: {
    icon: Info,
    borderColor: 'border-l-accent',
    iconColor: 'text-accent dark:text-accent-light',
    bgColor: 'bg-blue-50 dark:bg-accent/10',
  },
}

interface AgriculturalAlertsProps {
  agricultural: WeatherForecast['agricultural']
}

export default function AgriculturalAlerts({
  agricultural,
}: AgriculturalAlertsProps) {
  return (
    <div className="rounded-2xl border border-agri-border bg-white p-4 shadow-sm dark:border-border dark:bg-card md:p-6">
      <h3 className="mb-4 text-lg font-semibold text-agri-text dark:text-foreground">
        Agricultural Advisory
      </h3>

      <div className="mb-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-primary-light" />
          <div>
            <p className="text-xs font-medium text-agri-muted dark:text-muted-foreground">
              Planting Window
            </p>
            <p className="text-sm text-agri-text dark:text-foreground">
              {agricultural.plantingWindow}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Wheat className="mt-0.5 h-4 w-4 shrink-0 text-secondary-dark dark:text-secondary-light" />
          <div>
            <p className="text-xs font-medium text-agri-muted dark:text-muted-foreground">
              Harvest Condition
            </p>
            <p className="text-sm text-agri-text dark:text-foreground">
              {agricultural.harvestCondition}
            </p>
          </div>
        </div>
      </div>

      {agricultural.alerts.length > 0 && (
        <div className="space-y-2.5">
          {agricultural.alerts.map((alert, i) => {
            const config = alertConfig[alert.type] ?? alertConfig.info
            const Icon = config.icon
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 rounded-lg border-l-4 p-3 ${config.borderColor} ${config.bgColor}`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`}
                />
                <p className="text-sm text-agri-text dark:text-foreground">
                  {alert.message}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
