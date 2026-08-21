import './App.css'
import Layout from './layout'
import AppRoutes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
