import React from 'react'
import ReactDOM from 'react-dom/client'
import Menu from './components/menu/menu'
import Home from './components/Home/Home'
import Footer from './components/footer/footer'
import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import MeusPedidos from './components/pedidos/meus-pedidos'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Menu></Menu>
      <Routes>
        <Route path="/" element={<Home></Home>}/>
        <Route path="/pedidos" element={<MeusPedidos></MeusPedidos>}/>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  ,
)
