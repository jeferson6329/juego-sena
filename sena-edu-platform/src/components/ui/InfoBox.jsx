import { Info, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react'

const VARIANTS = {
  info:    { icon: Info,          bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400'    },
  tip:     { icon: Lightbulb,     bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  text: 'text-yellow-400'  },
  warning: { icon: AlertTriangle, bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-400'  },
  success: { icon: CheckCircle2,  bg: 'bg-sena-green/10',  border: 'border-sena-green/30',  text: 'text-sena-green'  },
}

export default function InfoBox({ variant = 'info', title, children }) {
  const { icon: Icon, bg, border, text } = VARIANTS[variant] || VARIANTS.info
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${bg} ${border} my-4`}>
      <Icon size={18} className={`${text} shrink-0 mt-0.5`} />
      <div className="text-sm text-gray-300 leading-relaxed">
        {title && <p className={`font-semibold ${text} mb-1`}>{title}</p>}
        {children}
      </div>
    </div>
  )
}
