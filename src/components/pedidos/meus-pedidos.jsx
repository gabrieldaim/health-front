import React, {useEffect, useState} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './meus-pedidos.css'
import Pedido from '../pedido/pedido';

export default (() =>{
    const [pedidos, setPedidos] = useState([])

    useEffect(() => { //importante para não ficar fazendo request em loop
        fetch("http://localhost:5000/pedidos", { //link do backend
            method: "GET",
            headers: {
                "Content-Type": "application/json",}
        })
        .then((resp) => resp.json()) //transformando ele em json
        .then((data) => {setPedidos(data.pedidos)}) //chamando o useState para atualizar o const categories
        .catch((err) => console.error(err))
    },[])

    return (
    <section className='pedidos'>
            {/* <TransitionGroup className="pratos-flex">
            <CSSTransition key={index} timeout={500} classNames="produtos-animacao">
            </CSSTransition>
        </TransitionGroup> */}
        {
        pedidos.map((pedido) => (
            <Pedido produtos={pedido.produtos} criacao={pedido.horario_criacao} conclusao={pedido.horario_conclusao} key={pedido.id}></Pedido>
        ))}
    <img src="../../../images/amarelo 1.svg" alt="" className='fundo-amarelo-pedidos'/>
    </section>
    )
})