import React, {useEffect, useState} from 'react';
import './home.css'
import ProdutosHome from '../produtos-home/produtos-home'
import personalizarPedido from '../personalizar-pedido/personalizar-pedido';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PersonalizarPedido from '../personalizar-pedido/personalizar-pedido';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default (() =>{
    const [pratos, setPratos] = useState([])
    const [sucos, setSucos] = useState([])
    const [cincoPratos, setCincoPratos] = useState([])
    const [textoPratos, setTextoPratos] = useState('Ver mais pratos')
    const [classeSeta, setClasseSeta] = useState('')
    const [personalizarCampo, setPersonalizarCampo] = useState(true)
    const [personalizarPedido, setPersonalizarPedido] = useState({})
    const [clear, setClear] = useState(true)

    useEffect(() => { //importante para não ficar fazendo request em loop
        fetch("http://localhost:5000/prato", { //link do backend
            method: "GET",
            headers: {
                "Content-Type": "application/json",}
        })
        .then((resp) => resp.json()) //transformando ele em json
        .then((data) => {atualizaPratos(data.pratos)}) //chamando o useState para atualizar o const categories
        .catch((err) => console.error(err))

        fetch("http://localhost:5000/suco", { //link do backend
        method: "GET",
        headers: {
            "Content-Type": "application/json",}
    })
    .then((resp) => resp.json()) //transformando ele em json
    .then((data) => {setSucos(data.Sucos)}) //chamando o useState para atualizar o const categories
    .catch((err) => console.error(err))
    }, [])  

    async function atualizaPratos(data){
        setPratos(data)
        setCincoPratos(data.slice(0,5))
    }   

    function alteraPratos(){
        if (cincoPratos == pratos){
            setCincoPratos(pratos.slice(0,5))
            setTextoPratos('Ver mais pratos')
            setClasseSeta('')
        }else{
            setCincoPratos(pratos)
            setTextoPratos('Ver menos pratos')
            setClasseSeta('rodar')
        }

    }

    function personalizar(tipo,id){
        if(tipo=="prato"){
        setPersonalizarPedido(pratos.find((prato) =>{
                return prato.id == id
            }))
        }else{
            setPersonalizarPedido(sucos.find((suco) =>{
                return suco.id == id
            }))
        }
        setPersonalizarCampo(false)

        setTimeout(movePage,50)
        sujar()
    }
    
    function movePage(){
        const element = document.getElementById("section-personalizar");
        element.scrollIntoView({ behavior: "smooth" });
    }

    function limpar(){
        setClear(false)
    }

    function sujar(){
        setClear(true)
    }

    return (
        <>
        <section className='pratos'>
            <TransitionGroup className="pratos-flex">
            {cincoPratos.map((element, index) => (
                <CSSTransition
                key={index}
                timeout={500}
                classNames="produtos-animacao"
                >
                <ProdutosHome key={element.id} produto={element} tipo="prato" funcaoFilho={personalizar}></ProdutosHome>
                </CSSTransition>
            ))}
            </TransitionGroup>
        <img src="../../../images/amarelo 1.svg" alt="" className='fundo-amarelo'/>
        </section>
        <div className='verMais' onClick={alteraPratos}>
            <p>{textoPratos}</p> 
            <img src="../../../images/setaDown.png" alt=""  className={classeSeta}/>
        </div>
        <h2>SUCOS</h2>
        <section className='sucos'>
                
                {sucos.map((element) => (
                    <ProdutosHome key={element.id} produto={element} tipo="suco" funcaoFilho={personalizar} ></ProdutosHome>
                ))}
        </section>
                    {personalizarCampo==true ? null :
                    <PersonalizarPedido nome={personalizarPedido.nome} descricao={personalizarPedido.descricao} valor={personalizarPedido.preco} componentes={personalizarPedido.ingredientes==undefined ? "suco" : personalizarPedido.ingredientes} limpeza={clear} funcaoFilho={limpar} setPersonalizarCampo={setPersonalizarCampo} personalizarCampo={personalizarCampo}></PersonalizarPedido>
                    }

    <ToastContainer />
        </>
    )
})