import React, {useEffect, useState} from 'react';
import './produtos-home.css'

export default (({produto, tipo, funcaoFilho}) =>{
    return (
        <div className='produto-home'>
            <div className={`informacoes-principais-produto`}>
                <img src={`../../../images/${produto.nome}.png`} alt="img-produto" className={`img-produto-home ${tipo == 'prato' ? 'sombra' : '' }`}/>
                <div className='texto-produto'>
                    <h3 className='titutlo-produto'>{produto.nome}</h3>
                    <p className='descricao-produto'>{produto.descricao}</p>
                </div>
            </div>
            <div className='button-produtos-home' onClick={() => funcaoFilho(tipo, produto.id)}>
                <img src="../../../images/carrinho-de-compra.svg" alt="carrinho-icon" />
                <p>Adicionar ao carrinho</p>
            </div>
        </div>
    )
})