interface MetricCardProps {
  label: string
  value: string | number
  sublabel?: string
  accent?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}

const accents = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  gray: 'bg-gray-50 text-gray-700 border-gray-100',
}

export function MetricCard({ label, value, sublabel, accent = 'gray' }: MetricCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${accents[accent]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sublabel && <p className="text-xs mt-1 opacity-60">{sublabel}</p>}
    </div>
  )
}