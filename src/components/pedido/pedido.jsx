import React, {useEffect, useState} from 'react';
import './pedido.css'

import moment from 'moment-timezone';


function transformData(data){

const momentObj = moment.utc(data, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
const formattedDate = momentObj.local().format("HH:mm DD/MM/YYYY");

// Formata a data no formato desejado


// Faz alguns ajustes na hora e no fuso horário


console.log(formattedDate);
}


export default (({produtos, criacao, conclusao, endereco}) =>{

    const [minutos, setMinutos] = useState(0)
    const [segundos, setSegundos] = useState(0)
    const [status, setStatus] = useState('')
    console.log(endereco)
    let partes = produtos.split('|')
    let divisao = []
    partes.shift()
    console.log(criacao)
    const horarioCriacao = moment.utc(criacao, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
    const formattedDateCriacao = horarioCriacao.local().format("HH:mm DD/MM/YYYY");
    const horarioConclusao = moment.utc(conclusao, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
    const formattedDateConclusao = horarioConclusao.local().format("HH:mm:ss DD/MM/YYYY");
    const horario = moment(formattedDateConclusao, 'HH:mm:ss DD/MM/YYYY').tz('America/Sao_Paulo');
    const endereco_separado = endereco.split('|')
    const logradouro = endereco_separado[1];
    const numero = endereco_separado[2];
    const estado = endereco_separado[4]
    setInterval(() => {
        const agora = moment().tz('America/Sao_Paulo')
        const diferenca = horario.diff(agora);
        const duracao = moment.duration(diferenca) / 1000 / 60;
        if (duracao > 0) {
            const minutos = Math.floor(duracao)
            setMinutos(minutos)
            const segundos = Math.floor((duracao % 1) * 60)
            setSegundos(segundos)
        }else{
            setStatus('concluido')
        }

    }, 1000)



    return (
        <div className='pedido-total'>
            <img src="../../../images/pedido.gif" alt="" />
            <div className='itens-pedido'>
            {partes.map((parte) => {
                divisao = parte.split('#')
                console.log(parte)
                const valor = divisao[3].split(',')
                return (<div className='dados-item'>
                
                <div className='item-pedido'>{divisao[0]} x{divisao[2]}</div>
                <div className='obs-pedido'>Observações: {divisao[1] == '' ? "nenhuma" : divisao[1]}</div>
                <div className='valor-pedido'>R${valor[0]},00</div>
                </div>
                )
                
            })}

            <div className='horario'>
            <div className='horario-criacao'>Pedido realizado às {formattedDateCriacao}</div>
            <div className='horario-criacao'>Envio para {logradouro}, n: {numero} - {estado}</div>
            <div className={`horario-conclusao ${status}`}>{status == 'concluido' ? "Pedido entregue!" : `Pedido será entregue daqui a ${minutos}min e ${segundos}seg`}</div>
            </div>
            </div>
        </div>
    )
})