import './App.css'
import Layout from './layout'
import AppRoutes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        richColors
        theme="light"
      />
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App