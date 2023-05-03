import React, {useEffect, useState} from 'react';
import './item-carrinho.css'

export default ((id) =>{
    useEffect(()=>{
        console.log(id.funcaoFilho)
    },[])


  
    return (
        <div className='card-carrinho'>
            <img src={`../../../images/${id.nome}.png`} alt="img-pedido" className='image-carrinho'/>
            <div className='descritivo-carrinho'>
                <div className='dados-carrinho'>
                    <div className='topo-dados-carrinho'>
                        <p className='titulo-carrinho'>{`${id.nome} x${id.quantidade}`}</p>
                        <p className='observacao-carrinho'>{`${id.observacao}`}</p>
                    </div>
                    <p className='valor-carrinho'>{`R$ ${id.preco},00`}</p>
                </div>
                    <div className='acao-carrinho'>
                        <img src="../../../images/lixo.png" alt="lixeira" data-id={id.item} onClick={id.funcaoFilho}/>
                    </div>
            </div>
        </div>
    )
})