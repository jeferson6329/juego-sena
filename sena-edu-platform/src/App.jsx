import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import AppLayout from './components/layout/AppLayout'
import RequireAuth from './components/RequireAuth'

// Entrada
import EntradaPage from './pages/EntradaPage'

// Páginas principales
import HomePage        from './pages/HomePage'
import PlaygroundPage  from './pages/PlaygroundPage'
import PerfilPage      from './pages/PerfilPage'
import LeaderboardPage from './pages/LeaderboardPage'
import JuegoPage       from './pages/JuegoPage'

// Organizador
import RankingPage          from './pages/organizador/RankingPage'
import EstadisticasPage     from './pages/organizador/EstadisticasPage'
import GestionJugadoresPage from './pages/organizador/GestionJugadoresPage'

// Guía 1
import Guia1IndexPage   from './pages/guia1/Guia1IndexPage'
import IntroBackendPage from './pages/guia1/IntroBackendPage'
import HttpPage         from './pages/guia1/HttpPage'
import ServidoresPage   from './pages/guia1/ServidoresPage'
import LenguajesPage    from './pages/guia1/LenguajesPage'
import AlgoritmosPage   from './pages/guia1/AlgoritmosPage'
import QuizGuia1Page    from './pages/guia1/QuizGuia1Page'

// Guía 3
import Guia3IndexPage        from './pages/guia3/Guia3IndexPage'
import IntroArquitecturaPage from './pages/guia3/IntroArquitecturaPage'
import MVCPage               from './pages/guia3/MVCPage'
import CapasPage             from './pages/guia3/CapasPage'
import MicroserviciosPage    from './pages/guia3/MicroserviciosPage'
import SolidPage             from './pages/guia3/SolidPage'
import PatronesPage          from './pages/guia3/PatronesPage'
import QuizGuia3Page         from './pages/guia3/QuizGuia3Page'

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          {/* ── Sin layout ── */}
          <Route path="/entrada" element={<EntradaPage />} />

          {/* Compatibilidad con rutas viejas */}
          <Route path="/login"    element={<Navigate to="/entrada" replace />} />
          <Route path="/register" element={<Navigate to="/entrada" replace />} />

          {/* ── Con layout + guard de nombre ── */}
          <Route element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }>
            <Route index element={<HomePage />} />
            <Route path="/playground"  element={<PlaygroundPage />} />
            <Route path="/perfil"      element={<PerfilPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/juego"       element={<JuegoPage />} />

            {/* Organizador */}
            <Route path="/organizador/ranking"      element={<RankingPage />} />
            <Route path="/organizador/estadisticas" element={<EstadisticasPage />} />
            <Route path="/organizador/jugadores"    element={<GestionJugadoresPage />} />

            {/* Guía 1 */}
            <Route path="/guia1"            element={<Guia1IndexPage />} />
            <Route path="/guia1/intro"      element={<IntroBackendPage />} />
            <Route path="/guia1/http"       element={<HttpPage />} />
            <Route path="/guia1/servidores" element={<ServidoresPage />} />
            <Route path="/guia1/lenguajes"  element={<LenguajesPage />} />
            <Route path="/guia1/algoritmos" element={<AlgoritmosPage />} />
            <Route path="/guia1/quiz"       element={<QuizGuia1Page />} />

            {/* Guía 3 */}
            <Route path="/guia3"                 element={<Guia3IndexPage />} />
            <Route path="/guia3/intro"           element={<IntroArquitecturaPage />} />
            <Route path="/guia3/mvc"             element={<MVCPage />} />
            <Route path="/guia3/capas"           element={<CapasPage />} />
            <Route path="/guia3/microservicios"  element={<MicroserviciosPage />} />
            <Route path="/guia3/solid"           element={<SolidPage />} />
            <Route path="/guia3/patrones"        element={<PatronesPage />} />
            <Route path="/guia3/quiz"            element={<QuizGuia3Page />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  )
}
