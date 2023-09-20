import React, {useEffect, useState} from 'react';
import './styles.css'
import { Link } from 'react-router-dom';
import { Drawer } from 'antd';
import ItemCarrinho from '../itemCarrinho/item-carrinho';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default (() =>{
  const [ativoHome, setAtivoHome] = useState('ativo')
  const [carrinho, setCarrinho] = useState([])
  const [totalCompra, setTotalCompra] = useState(0)
  const [ativoPedidos, setAtivoPedidos] = useState('')
  const [visible, setVisible] = useState(false);
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [bairro, setBairro] = useState('')
  const [estado, setEstado] = useState('') 
  const [numero, setNumero] = useState('') 
  const [complemento, setComplemento] = useState('') 


  function mudarAtivo(ativoAtual){
    if (ativoAtual == "home"){
      setAtivoHome('ativo')
      setAtivoPedidos('')
    }else{
      setAtivoHome('')
      setAtivoPedidos('ativo')
    }
  }
  const showDrawer = async () => {
    getCarrinho()
    getEndereco()
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => { //importante para não ficar fazendo request em loop
    getCarrinho()
  }, [])  

  useEffect(() =>{
    setTotalCompra(carrinho.reduce((acumulado, objeto) => acumulado + (parseInt(objeto.preco) * objeto.quantidade), 0))
    console.log(totalCompra)
  }, [carrinho])

  async function getCarrinho(){
    await fetch("http://localhost:5000/carrinho", { //link do backend
        method: "GET",
        headers: {
            "Content-Type": "application/json",}
    })
    .then((resp) => resp.json()) //transformando ele em json
    .then((data) => {setCarrinho(data.carrinho)}) //chamando o useState para atualizar o const categories
    .catch((err) => console.error(err))
  }

  const delCarrinho = async (id) =>{
    const formData = new FormData();
      formData.append('id', id); 
      let url = 'http://127.0.0.1:5000/carrinho';
      await fetch(url, {
        method: 'delete',
        body: formData
      })
        .then((response) => response)
        .catch((error) => {
          console.error('Error:', error);
        });
   }

   async function getEndereco(){
    await fetch("http://localhost:5000/endereco", { //link do backend
        method: "GET",
        headers: {
            "Content-Type": "application/json",}
    })
    .then((resp) => resp.json()) //transformando ele em json
    .then((data) => {setCep(data.Endereco.cep),setLogradouro(data.Endereco.logradouro),setNumero(data.Endereco.numero),setBairro(data.Endereco.bairro),setEstado(data.Endereco.estado),setComplemento(data.Endereco.complemento)}) //chamando o useState para atualizar o const categories
    .catch((err) => console.error(err))
  }

   const PostPedidos = async (produtos) =>{
    const formData = new FormData();
      formData.append('produtos', produtos); 
      let url = 'http://127.0.0.1:5000/pedidos';
      await fetch(url, {
        method: 'post',
        body: formData
      })
        .then((response) => setCarrinho([]))
        .catch((error) => {
          console.error('Error:', error);
        });
   }

   function verificaPedido(){
    let camposObrigatorios = [carrinho.length, cep, logradouro, numero,estado];
    if(camposObrigatorios.some(variavel => variavel == null || variavel == undefined || variavel == '' || variavel == 0)){
      toast.error('Está faltando produto ou endereço na solicitação', {
        position: toast.POSITION.TOP_LEFT
      });
    }else{
      clickAddPedido()
    }

   }

   async function clickAddPedido(){
    let produtos = []
    carrinho.forEach((item) => {
      const string = `|${item.produto_nome}#${item.observacao}#${item.quantidade}#${item.quantidade*item.preco}`
      produtos.push(string)
    })
    console.log(produtos)
    await PostPedidos(produtos)
    setCep('')
    setCep('')
    setLogradouro('')
    setBairro('')
    setEstado('') 
    setNumero('') 
    setComplemento('') 
    toast.success('Pedido realizado com sucesso! Para visualizar, basta ir na aba de MEUS PEDIDOS.', {
      position: toast.POSITION.TOP_LEFT
    });
   }
 
    async function handleClick(event) {
      const id = event.target.getAttribute('data-id');
      console.log(id); // exibe o ID da imagem clicada
      await delCarrinho(id)
      getCarrinho()
      toast.error('Produto excluído do carrinho!', {
        position: toast.POSITION.TOP_LEFT
    });
    }

    async function getCep(cepDigitado){
      await fetch(`https://thingproxy.freeboard.io/fetch/https://viacep.com.br/ws/${cepDigitado}/json`, { //link do backend
          method: "GET",
          headers: {
              "Content-Type": "application/json",}
      })
      .then((resp) => resp.json()) //transformando ele em json
      .then((data) => {setLogradouro(data.logradouro), setBairro(data.bairro),setEstado(data.uf)}) //chamando o useState para atualizar o const categories
      .catch((err) => console.error(err))
    }

    const PutEndereco = async () =>{
      const formData = new FormData();
        formData.append('cep', cep); 
        formData.append('logradouro', logradouro); 
        formData.append('numero', numero); 
        formData.append('bairro', bairro); 
        formData.append('estado', estado); 
        formData.append('complemento', complemento); 
        let url = 'http://127.0.0.1:5000/endereco';
        await fetch(url, {
          method: 'put',
          body: formData
        })
          .then((response) => console.log(response))
          .catch((error) => {
            console.error('Error:', error);
          });
     }

    const handleBlur = () => {
      // Esta função será executada quando o usuário sair do campo de entrada
      PutEndereco()
      // Você pode chamar a função que deseja executar aqui
    };

    const handleCepChange = (event) => {
      const inputValue = event.target.value;
      // Verifica se o valor contém apenas números usando uma expressão regular
      const numericValue = inputValue.replace(/\D/g, '');
      setCep(numericValue);
      if (numericValue.length === 8) {
        getCep(numericValue)
      }
    };


  return (
    <header className='topo'>
      <div className='menu-total'>
      <img src="../../../images/LOGO.png" alt="logo" className='logo'/>
      <div className='menu'>
        <Link to="/" className={`link ${ativoHome}`} onClick={() => mudarAtivo("home")}>HOME</Link>
        <Link to="/pedidos" className={`link ${ativoPedidos}`} onClick={() => mudarAtivo("pedidos")}>MEUS PEDIDOS</Link>
      </div>
      <div className="carrinho" onClick={showDrawer}>
      <img src="../../../images/carrinho.svg" alt=""  className=''/>
      </div>
      </div>
      <Drawer
        title="Carrinho de compras"
        placement="right"
        onClose={onClose}
        open={visible}
      >
      <div className='itens-carrinho'>
      {carrinho.map( (elemento,key) => (
        <ItemCarrinho key={key} item={elemento.id} nome={elemento.produto_nome} quantidade={elemento.quantidade} preco={elemento.preco} observacao={elemento.observacao} funcaoFilho={handleClick}></ItemCarrinho>
      ))}
      </div>
      <div className='form-endereco'>
      <label for="cep" className='label'>CEP:</label>
        <input type="text" onBlur={PutEndereco} id="cep" name="cep" value={cep} maxLength={8} onChange={handleCepChange} required /><br /><br />

        <label for="logradouro" className='label'>Logradouro:</label>
        <input type="text" onBlur={PutEndereco} id="logradouro" name="logradouro" value={logradouro} readOnly /><br /><br />

        <label for="numero" className='label'>Numero:</label>
        <input type="text" onBlur={PutEndereco} id="numero" name="numero" value={numero} onChange={(event) => setNumero(event.target.value)} required /><br /><br />

        <label for="bairro" className='label'>Bairro:</label>
        <input type="text" onBlur={PutEndereco} id="bairro" name="bairro" value={bairro} readOnly /><br /><br />

        <label for="estado" className='label'>Estado:</label>
        <input type="text" onBlur={PutEndereco} id="estado" name="estado" value={estado} readOnly /><br /><br />

        <label for="complemento" className='label'>Complemento:</label>
        <input type="text" onBlur={PutEndereco} id="complemento" name="complemento" value={complemento} onChange={(event) => setComplemento(event.target.value)} required /><br /><br />
      </div>
      <div className='informativos-carrinho'>
        <p>{`Total do Pedido: R$${totalCompra},00`}</p>
        <div onClick={verificaPedido}>Finalizar Pedido</div>
      </div>
      </Drawer>
    </header>
  )
})