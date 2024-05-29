// Import de bibliotecas
import './App.css';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useParams } from "react-router-dom";
import { useState , useEffect } from 'react';
import { Container, Form, Button, Table, Nav } from 'react-bootstrap';

// Define o endereço do servidor
const endereco_servidor = 'http://localhost:8000';

/**
 * Layout do menu.
 * 
 * @returns 
 */
function Layout(){
  
  // Renderiza o componente
  return (
    <>
      <Container>
        <h1>Menu principal</h1>
        <Nav defaultActiveKey="/" className="bg-light flex-column">
          <Nav.Item as="incluir">
            <Nav.Link href="/frmcadastroaluno/-1">1. Incluir</Nav.Link>
          </Nav.Item>
          <Nav.Item as="listar">
            <Nav.Link href="/frmlistaraluno">2. Listar(Alterar, Excluir)</Nav.Link>
          </Nav.Item>     
        </Nav>
        <hr />
        <Outlet />
      </Container>
    </>
  ) 
};

/**
 * Opção de página não encontrada.
 * 
 * @returns 
 */
function NoPage() {
  
  // Renderiza o componente
  return (
      <div>
        <h2>404 - Página não encontrada</h2>
      </div>
    );
};

/**
 * Componente formulário que insere ou altera aluno.
 * 
 * @returns 
 */
function FrmCadastroAluno(){

  // Recupera o parâmetro do componente
  const { alterarId } = useParams();

  // Estados inciais das variáveis do componente   
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [cpf, setCpf] = useState('');
  const [resultado, setResultado] = useState('');  

  // Renderiza a lista de alunos.
  useEffect(() => {
    
    // Recupera um aluno para alteração
    const getAluno = async () => {
      //Se foi passado um parâmetro
      if (alterarId > 0) {      
        //Consulta o aluno
        const response = await fetch(`${endereco_servidor}/aluno/${alterarId}`);
        const data = await response.json();
        //Atualiza os dados        
        setNome(data.nome);
        setCurso(data.curso);
        setCpf(data.cpf);
      }      
    };

    //Se tem algum aluno para alterar, busca os dados do aluno.    
    getAluno(); 
  }, [alterarId]);

  // Submissão do formulário para inserir.
  const handleSubmitInsert = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    //Dados do formulário a serem enviados
    const dados =  { 
          //'alunoId': alunoId,
          'nome': nome,
          'curso': curso,
          'cpf': cpf
    }

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/aluno`, {
        method : 'post',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Submissão do formulário atualizar.
  const handleSubmitUpdate = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    const dados =  { 
          'nome': nome,
          'curso': curso,
          'cpf': cpf
    };

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/aluno/${alterarId}`, {
        method : 'put',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Limpa os campos do formulário.     
  const limpar = () => {     
    setNome('');
    setCpf('');
  };

  // Renderiza o componente formulário
  return (
    <>          
      <Form name="FrmCadastroAluno" method="post" onSubmit={alterarId < 0 ? handleSubmitInsert: handleSubmitUpdate}>
          <Form.Label><h2> {(alterarId < 0) ? (<div>1 - Formulário Cadastro Aluno</div>) : (<div>1 - Formulário Alteração Aluno</div>)} </h2></Form.Label>          
          <Form.Group>
            <Form.Label>Nome: 
            <Form.Control type="text" size="60" id="nome" name="nome" value={nome} onChange={(event) => setNome(event.target.value)} /></Form.Label><br/>
            <Form.Label>Curso: 
            <Form.Control type="text" size="50" id="curso" name="curso" value={curso} onChange={(event) => setCurso(event.target.value)} /></Form.Label><br/>
            <Form.Label>CPF: 
            <Form.Control type="text" size="15" id="cpf" name="cpf" value={cpf} onChange={(event) => setCpf(event.target.value)} /></Form.Label><br/><br/>
         </Form.Group>
          <Form.Group>
            <Button variant="secondary" name="Limpar" onClick={limpar}>Limpar</Button>
            <Button variant="primary" type="submit" name="Cadastrar">Cadastrar</Button><br/><br/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Resultado: {resultado} </Form.Label>
          </Form.Group>
      </Form>
    </>
  );
};

/**
 * Componente de exclusão de aluno.
 * 
 * @returns 
 */
function FrmExcluirAluno() {

  // Recupera o parâmetro do componente
  const { alunoId } = useParams();

  // Estados inciais das variáveis do componente
  const [resultado, setResultado] = useState('');
  
  // Renderiza a lista de alunos.
  useEffect(() => {

    // Exclui um aluno
    const excluirAluno = async () => {
      //Endereço da API + campos em JSON
      fetch(`${endereco_servidor}/aluno/${alunoId}`, {method : 'delete'}) 
      .then((response) => response.json()) //Converte a resposta para JSON
      .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
    };

    excluirAluno();
  }, [alunoId]);

  // Renderiza o componente
  return (
    <div>      
       <label>Resultado: {resultado} </label>
    </div>
  );
}

/**
 * Componente de listagem de alunos.
 * 
 * @returns 
 */
function FrmListarAluno(){
  
  // Estados inciais das variáveis do componente
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([])
  
  // Renderiza a lista de alunos.
  useEffect(() => {
    // Busca os alunos cadastrados no servidor.
    const getAlunos = () => {
      fetch(`${endereco_servidor}/alunos`)
        .then(response => {return response.json()}) //Converte a resposta para JSON
        .then(data => {setAlunos(data)}) // Atribui a resposta ao aluno
    };

    getAlunos();
  }, []);

  // Renderiza o componente
  return (
    <div>
        <h2>2 - Listar(Editar, Excluir)</h2>        
        <div>
          <Table striped bordered hover responsive> 
            <thead>
              <th>Id</th> <th>Nome</th> <th>Curso</th> <th>CPF</th> <th>Editar</th> <th>Excluir</th>          
            </thead>  
            <tbody>
              {alunos.map(aluno => (
                <tr>
                  <td> {aluno.alunoId} </td>
                  <td> {aluno.nome}</td>
                  <td> {aluno.curso}</td>
                  <td> {aluno.cpf}</td>
                  <td> 
                    <Button variant="primary" onClick={() => {navigate(`/frmcadastroaluno/${aluno.alunoId}`)}}>Editar</Button>
                  </td>                
                  <td>                  
                    <Button variant="primary" onClick={() => {navigate(`/frmexcluiraluno/${aluno.alunoId}`)}}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br/>          
        </div>
     </div>
  );
}

/**
 * Principal componente da aplicação.
 * 
 * @returns 
 */
function MenuPrincipal() {
    return (      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='frmcadastroaluno/:alterarId' element={<FrmCadastroAluno />} />
            <Route path='frmexcluiraluno/:alunoId' element={<FrmExcluirAluno />} />
            <Route path='frmlistaraluno' element={<FrmListarAluno />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>        
      </BrowserRouter>    
    );
  }
  
  export default MenuPrincipal;