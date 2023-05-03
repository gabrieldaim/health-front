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

   async function clickAddPedido(){
    let produtos = []
    carrinho.forEach((item) => {
      const string = `|${item.produto_nome}#${item.observacao}#${item.quantidade}#${item.quantidade*item.preco}`
      produtos.push(string)
    })
    console.log(produtos)
    await PostPedidos(produtos)
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
      <div className='informativos-carrinho'>
        <p>{`Total do Pedido: R$${totalCompra},00`}</p>
        <div onClick={clickAddPedido}>Finalizar Pedido</div>
      </div>
      </Drawer>
    </header>
  )
})