import React, { useEffect, useState } from "react";
import "./personalizar-pedido.css";
import Select from "../select/select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default ({nome,descricao,valor,componentes,limpeza,funcaoFilho, setPersonalizarCampo, personalizarCampo}) => {
  const [ingredientes, setIngredientes] = useState({});
  const [tamanho, setTamanho] = useState("");
  const [classePrato, setClassePrato] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const arrayComponentes = componentes.split(",");
  const temVirgula = componentes.includes(',');


  useEffect(() => {
    temVirgula ? setClassePrato("sombra") : setClassePrato("")
    limpaItens();
    setObservacoes("")
    setQuantidade(1)
  }, [limpeza]);

  function addCarrinho(){
    let selecionados = ""
    if(tamanho==""){
      for(const key in ingredientes){
        if(ingredientes[key]){
          if(selecionados==""){
            selecionados=key
          }else{
            selecionados=`${selecionados},${key}`
          }
        }
      }
    }else{
      console.log("entrou")
      selecionados=tamanho
    }
    
    setCarrinho(selecionados)
    setTimeout(movePage,50)
    setPersonalizarCampo(!personalizarCampo)
      toast.success('Produto adicionado no seu carrinho!', {
          position: toast.POSITION.TOP_LEFT
      });
  }

  function movePage(){
    const element = document.querySelector(".topo");
    element.scrollIntoView({ behavior: "smooth" });
    
}

  function limpaItens() {
    if (limpeza == true) {
      setIngredientes({});

      let selects = document.querySelectorAll("input[type=checkbox]");
      selects.forEach((el) => {
        el.checked = false;
      });

      selects = document.querySelectorAll("input[type=radio]");
      selects.forEach((el) => {
        el.checked = false;
      });

      setTamanho("");
      funcaoFilho();
    }
  }

  function personalizarSuco(event) {
    limpaItens();

    setTamanho(event.target.value);
  }

  function personalizarPrato(event) {
    limpaItens();
    setIngredientes({});
    const { value, checked } = event.target;
    setIngredientes({ ...ingredientes, [value]: checked });
  }

 const setCarrinho = async (selecionados) =>{
  const formData = new FormData();
    formData.append('produto_nome', nome);
    formData.append('quantidade', quantidade);
    formData.append('preco', valor);
    formData.append('observacao', selecionados);  
    let url = 'http://127.0.0.1:5000/carrinho';
    await fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
 }

  return (
    <section className="section-personalizar" id="section-personalizar">
      <h2 className="h2-personalizar">Personalizar Pedido</h2>
      <img
        src={`../../../images/${nome}.png`}
        alt="img-produto"
        className={`img-produto-personalizar ${classePrato}`}
      />
      <div className="descritivo-personalizar">
        <h3>{nome}</h3>
        <p>{descricao}</p>
        <p className="valor-personalizar">{`R$ ${valor}`}</p>
      </div>
      <div className="personalizacao">
        {componentes == "suco" ? (
          <>
            <Select
              componente="Selecionar o tamanho de 300ml"
              tipo={componentes}
              funcaoFilho={personalizarSuco}
            ></Select>
            <Select
              componente="Selecionar o tamanho de 500ml"
              tipo={componentes}
              funcaoFilho={personalizarSuco}
            ></Select>
            <Select
              componente="Selecionar o tamanho de 700ml"
              tipo={componentes}
              funcaoFilho={personalizarSuco}
            ></Select>
          </>
        ) : (
          arrayComponentes.map((element, index) => (
            <Select
              componente={`Sem ${element}`}
              tipo="prato"
              key={index}
              id={index}
              funcaoFilho={personalizarPrato}
            ></Select>
          ))
        )}
        <p className="p-quantidade">Quantidade</p>
        <div className="div-quantidade">
        <div className="btn-quantidade menos" onClick={()=>{setQuantidade(quantidade<=1 ? 1 : quantidade-1)}}>-</div>
          <input type="number" name="quantidade" id="quantidade" value={quantidade<=1 ? 1 : quantidade} min="1" onChange={(e) => setQuantidade(e.target.value)} />
          <div className="btn-quantidade mais" onClick={()=>{setQuantidade(quantidade+1)}}>+</div>

        </div>
        
        <div className="button-produtos-home button-personalizacao" onClick={addCarrinho}>
          <img
            src="../../../images/carrinho-de-compra.svg"
            alt="carrinho-icon"
          />
          <p>Finalizar personalização</p>
        </div>
      </div>
      
    </section>
  );
};
