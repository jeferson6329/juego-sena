import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'

// Juego standalone (sin layout)
import JuegoStandalonePage from './pages/JuegoStandalonePage'

// Páginas principales
import HomePage       from './pages/HomePage'
import VivoPage       from './pages/VivoPage'
import PlaygroundPage from './pages/PlaygroundPage'
import PerfilPage     from './pages/PerfilPage'

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

// Guía 3
import Guia3IndexPage        from './pages/guia3/Guia3IndexPage'
import IntroArquitecturaPage from './pages/guia3/IntroArquitecturaPage'
import MVCPage               from './pages/guia3/MVCPage'
import CapasPage             from './pages/guia3/CapasPage'
import MicroserviciosPage    from './pages/guia3/MicroserviciosPage'
import SolidPage             from './pages/guia3/SolidPage'
import PatronesPage          from './pages/guia3/PatronesPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Juego público — standalone sin layout ── */}
        <Route path="/juego" element={<JuegoStandalonePage />} />

        {/* ── Con layout ── */}
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/vivo"       element={<VivoPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/perfil"     element={<PerfilPage />} />

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

          {/* Guía 3 */}
          <Route path="/guia3"                element={<Guia3IndexPage />} />
          <Route path="/guia3/intro"          element={<IntroArquitecturaPage />} />
          <Route path="/guia3/mvc"            element={<MVCPage />} />
          <Route path="/guia3/capas"          element={<CapasPage />} />
          <Route path="/guia3/microservicios" element={<MicroserviciosPage />} />
          <Route path="/guia3/solid"          element={<SolidPage />} />
          <Route path="/guia3/patrones"       element={<PatronesPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
