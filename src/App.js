import React, { Component } from 'react';
import './App.css';
import Item from './Item';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { async } from 'q';

Amplify.configure(awsconfig);

const listTodos = `query listTodos {
  listTodos{
    items{
      id
      cuenta
      usuario
      clave
    }
  }
}`

const addTodo = `mutation createTodo($cuenta:String! $usuario:String! $clave:String!) {
  createTodo(input:{
    
    cuenta:$cuenta
    usuario:$usuario
    clave:$clave
  }){
    id
    cuenta
    usuario
    clave
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
  }
}`

class App extends Component {
  
  constructor(props){
    super(props);
    this.state={
      cuenta:"",
      usuario:"",
      clave:"",
      lista: []
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
      clave: this.state.clave
    };
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert("La cuenta de " + JSON.stringify(newTodo.data.createTodo.cuenta) + " ha sido registrada.");
    this.listQuery()
  }

  listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    this.setState({ lista: allTodos.data.listTodos.items});
        
  }

  quitarCuenta = async (idCuenta) => {
    if(window.confirm("Está seguro que desea eliminar la cuenta")){
      const borrarId = { id: idCuenta };
      const borrarCuenta = await API.graphql(graphqlOperation(eliminarCuenta, borrarId));
      console.log(JSON.stringify(borrarCuenta));
      this.listQuery()
    }
    
  }
  render(){
  return (
    <div className="App">
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
       
    </div>
  );
}
componentDidMount(){
  this.listQuery()
}
}

export default withAuthenticator(App, true);
