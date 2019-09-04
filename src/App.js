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
      name
      description
    }
  }
}`

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`

class App extends Component {
  
  constructor(props){
    super(props);
    this.state={
      name:"",
      description:"",
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
      name: this.state.name,
      description: this.state.description
    };
    
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  }

  listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    this.setState({ lista: allTodos.data.listTodos.items});
    alert(JSON.stringify(this.state.lista[0]));
    
  }
  render(){
  return (
    <div className="App">
       <form>
         <input type="text" name="name" placeholder="Nombre" value={this.state.name} onChange={this.handleChange} />
         <input type="text" name="description" placeholder="Descripción" value={this.state.description} onChange={this.handleChange} />
       </form>
       <button onClick={this.todoMutation}>GraphQL Mutation</button>
       <button onClick={this.listQuery}>GraphQL Query</button> 
       <table aling='center' >
          <tr>
            <th>Cuenta</th>
            <th>Usuario</th>
          </tr>
          {this.state.lista.map((item) => 
            <tr> <td>{item.name}</td> <td>{item.description}</td> </tr> 
          )}
       </table>
       
    </div>
  );
}
}

export default withAuthenticator(App, true);
