import React, { Component } from 'react';
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

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

const addTodo = `mutation createTodo($id:ID! $cuenta:String! $usuario:String! $clave:String!) {
  createTodo(input:{
    id:$id
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
    let {lista} = this.state;
    let numeroId = (lista.length+1).toString();
    const todoDetails = {
      id: numeroId,
      cuenta: this.state.cuenta,
      usuario: this.state.usuario,
      clave: this.state.clave
    };
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
    this.listQuery()
  }

  listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    this.setState({ lista: allTodos.data.listTodos.items});
        
  }
  render(){
  return (
    <div className="App">
       <form onSubmit={this.todoMutation} >
         <input type="text" name="cuenta" placeholder="Cuenta" value={this.state.cuenta} onChange={this.handleChange} />
         <input type="text" name="usuario" placeholder="Usuario" value={this.state.usuario} onChange={this.handleChange} />
         <input type="text" name="clave" placeholder="Clave" value={this.state.clave} onChange={this.handleChange} />
         <button type="submit" onClick={this.todoMutation}>Agregar</button>
       </form>
       <br/>
       <table align="center" cellpadding="10" border='1' >
          <tr>
            <th>Cuenta</th>
            <th>Usuario</th>
            <th>Clave</th>
          </tr>
          {this.state.lista.map((item) => 
            <tr> <td>{item.cuenta}</td> <td>{item.usuario}</td> <td>{item.clave}</td> </tr> 
          )}
       </table>
       
    </div>
  );
}
componentDidMount(){
  this.listQuery()
}
}

export default withAuthenticator(App, true);
