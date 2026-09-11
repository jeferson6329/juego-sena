/**
 * Renderiza diagramas ASCII o texto como un bloque visual tipo diagrama.
 */
export default function DiagramBox({ title, children }) {
  return (
    <div className="my-6 rounded-xl border border-gray-700 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs font-semibold text-sena-green uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="p-5 bg-gray-900/50 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  )
}
