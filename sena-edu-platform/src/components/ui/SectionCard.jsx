import { CheckCircle2 } from 'lucide-react'

export default function SectionCard({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
        {title}
      </h2>
      {children}
    </section>
  )
}
