import React, { Component } from 'react';
import './App.css';
import Item from './Item';
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
//import { async } from 'q';
//import Form from 'react-bootstrap/Form'
//import Container from 'react-bootstrap/Container'
//import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
import { Grid, Row, Col } from 'react-flexbox-grid';

Amplify.configure(awsconfig);

const listTodos = `query listTodos {
  listTodos(filter: {propietario: {eq:"$propietario"} }) {
    items{
      id
      cuenta
      usuario
      clave
      propietario
    }
  }
}
`

const addTodo = `mutation createTodo($cuenta:String! $usuario:String! $clave:String! $propietario:String!) {
  createTodo(input:{
    cuenta:$cuenta
    usuario:$usuario
    clave:$clave
    propietario:$propietario
  }){
    id
    cuenta
    usuario
    clave
    propietario
  }
}`

const eliminarCuenta = `mutation deleteTodo($id:ID!){
  deleteTodo(input:{
    id:$id
  }){
    id
    cuenta
    usuario
    clave
    propietario
  }
}`

class App extends Component {
  
  constructor(props){
    super(props);
    this.state={
      cuenta:"",
      usuario:"",
      clave:"",
      lista: [],
      loggedUser: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.todoMutation = this.todoMutation.bind(this);
  }
  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }

  todoMutation = async () => {
    const todoDetails = {
      cuenta: this.state.cuenta,
      usuario: this.state.usuario,
      clave: this.state.clave,
      propietario: this.state.loggedUser
    };
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert("La cuenta de " + JSON.stringify(newTodo.data.createTodo.cuenta) + " ha sido registrada.");
    this.listQuery()
  }

  getUser = async () => {
    const log = await Auth.currentAuthenticatedUser();
    this.setState({ loggedUser: log.username});
    this.listQuery();
  } 

  listQuery = async () => {
    console.log('listing todos');
    
    const listTodos2 = listTodos.replace("$propietario",this.state.loggedUser);
    const allTodos = await API.graphql(graphqlOperation(listTodos2));
    console.log(allTodos);
    this.setState({ lista: allTodos.data.listTodos.items});

        
  }

  quitarCuenta = async (idCuenta) => {
    if(window.confirm("Está seguro que desea eliminar la cuenta")){
      const borrarId = { id: idCuenta };
      const borrarCuenta = await API.graphql(graphqlOperation(eliminarCuenta, borrarId));
      //console.log(JSON.stringify(borrarCuenta));
      this.listQuery()
    }
    
  }
  render(){
  return (
<container className="App">
    
       <form>
        <fieldset>
          <legend>Nueva Cuenta</legend>
          <input type="text" name="cuenta" id="cuenta" placeholder="Cuenta" value={this.state.cuenta} onChange={this.handleChange} />
          <input type="text" name="usuario" placeholder="Usuario" value={this.state.usuario} onChange={this.handleChange} />
          <input type="password" name="clave" placeholder="Clave" value={this.state.clave} onChange={this.handleChange} />
          <button type="button" onClick={this.todoMutation}>Agregar</button>
        </fieldset>
       </form>

        <br/>
       <table align="center" cellPadding="10" >
           <thead>
              <tr>
                <th>Cuenta</th>
                <th>Usuario</th>
                <th>Clave</th>
                <td><i>Mostrar</i></td>
              </tr>
           </thead>    
           <tbody>
              {this.state.lista.map((item,index) => 
                      <Item datos={item} key={index} onRemove={ () => this.quitarCuenta(item.id)} /> 
              )}
           </tbody>
       </table>

  </container>
  );
}
componentDidMount(){
  this.getUser();
  //this.listQuery();
  
}
}

export default withAuthenticator(App, true);
