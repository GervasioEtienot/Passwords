import React, { Component } from 'react';
import './App.css';
import Item from './Item';
import ComponenteCuenta from './ComponenteCuenta'
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';


import { container } from '@aws-amplify/ui';

Amplify.configure(awsconfig);

const listTodos = `query listTodos {
  listTodos(limit: 100, filter: {propietario: {eq:"$propietario"} }) {
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

const actualizarTodo = `mutation updateTodo($id:ID! $clave:String! ) {
  updateTodo(input:{
    id:$id
    clave:$clave
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
      lista: [],
      loggedUser: '',
      botonNuevaCuenta: false
    }
    this.todoMutation = this.todoMutation.bind(this);
  }
  
  todoMutation = async (datosCuenta) => {
    const todoDetails = {
      cuenta: datosCuenta.cuenta,
      usuario: datosCuenta.usuario,
      clave: datosCuenta.clave,
      propietario: this.state.loggedUser
    };
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert("La cuenta de " + JSON.stringify(newTodo.data.createTodo.cuenta) + " ha sido registrada.");
    this.listQuery()
    this.setState({botonNuevaCuenta: false});
  }

  actualizarCuenta = async (datosActualizados) => {
    const todoActualizado = await API.graphql(graphqlOperation(actualizarTodo, datosActualizados));
    alert("La clave de la cuenta ha sido modificada.");
    this.listQuery()
    this.setState({botonNuevaCuenta: false});
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
  botNewCuetna = () => {
    this.setState({botonNuevaCuenta: true});
  }
  cancelar = () => {this.setState( {botonNuevaCuenta: false} ); }
  
    
  render(){
  if(this.state.botonNuevaCuenta){
    return (
      <ComponenteCuenta traeDatos={this.todoMutation} cancelarRegistro={this.cancelar} />
    );
  }  
  else{
    return(
     <div className= "container">
        <button className="ui primary basic button" onClick={this.botNewCuetna}>Nueva Cuenta</button>
        <br/>
        <table className="ui compact celled definition table" >
            <thead className="full-width" >
              <tr>
                <th>Cuenta</th>
                <th>Usuario</th>
                <th>Clave</th>
                <th className="two wide"></th>
              </tr>
            </thead>    
            <tbody>
              {this.state.lista.map((item,index) => 
                      <Item datos={item} 
                            key={index} 
                            onRemove={ () => this.quitarCuenta(item.id)}
                            updateCuenta={this.actualizarCuenta} /> 
              )}
            </tbody>
        </table>
        
     </div>
 );
    
  }
  

       
}
componentDidMount(){
  this.getUser();
  //this.listQuery();
  
}
}

export default withAuthenticator(App, true);
