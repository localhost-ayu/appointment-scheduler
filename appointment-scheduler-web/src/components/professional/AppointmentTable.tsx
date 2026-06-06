import { useState } from 'react'
import { professionalApi } from '../../services/api'
import { StatusBadge } from './StatusBadge'
import { Button, EmptyState } from '../ui'
import type { Appointment } from '../../types'

interface AppointmentTableProps {
  appointments: Appointment[]
  loading: boolean
  onRefetch: () => void
}

export function AppointmentTable({ appointments, loading, onRefetch }: AppointmentTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', timeZone: 'UTC',
    })

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    })

  const handleComplete = async (appointmentNumber: string) => {
    setActionLoading(appointmentNumber + '-complete')
    try {
      await professionalApi.post(`/appointments/${appointmentNumber}/complete`)
      onRefetch()
    } catch {
      alert('Failed to complete appointment.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (appointmentNumber: string) => {
    if (!confirm('Cancel this appointment?')) return
    setActionLoading(appointmentNumber + '-cancel')
    try {
      await professionalApi.post(`/appointments/${appointmentNumber}/cancel`)
      onRefetch()
    } catch {
      alert('Failed to cancel appointment.')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
        Loading appointments...
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments found"
        description="No appointments match the selected filters."
      />
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border-default)' }}>
            {['Number', 'Customer', 'Service', 'Date', 'Time', 'Status', 'Price', 'Actions'].map((h) => (
              <th key={h} style={{
                padding: '10px 16px',
                textAlign: h === 'Price' || h === 'Actions' ? 'right' : 'left',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                whiteSpace: 'nowrap',
                backgroundColor: 'var(--color-bg-subtle)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr
              key={apt.appointment_number}
              style={{ borderBottom: '1px solid var(--color-border-default)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--color-bg-subtle)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'
              }}
            >
              <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-text-tertiary)',
                }}>
                  {apt.appointment_number}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <p style={{ margin: '0 0 1px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {apt.customer?.name}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {apt.customer?.phone}
                </p>
              </td>
              <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                {apt.service?.name}
              </td>
              <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                {formatDate(apt.starts_at)}
              </td>
              <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                  {formatTime(apt.starts_at)}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <StatusBadge status={apt.status} />
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apt.price)}
                </span>
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                {apt.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComplete(apt.appointment_number)}
                      disabled={!!actionLoading}
                      style={{ color: 'var(--color-success-text)' }}
                    >
                      {actionLoading === apt.appointment_number + '-complete' ? '...' : 'Complete'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(apt.appointment_number)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === apt.appointment_number + '-cancel' ? '...' : 'Cancel'}
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}