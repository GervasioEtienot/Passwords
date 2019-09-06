import React, { Component } from 'react';
 
class Item extends Component{
    
   constructor(props){
    super(props);
    this.state = {
         claveVisible: false
    }
   }

    _remove(){
        if(this.props.onRemove)
            this.props.onRemove();
    }

    mostrar(){
      this.setState(state => ({
      claveVisible: !state.claveVisible
    }));
    }
    render(){
        return (
            <tr>
               <td align="left"> {this.props.datos.cuenta} </td>
               <td align="left"> {this.props.datos.usuario} </td>
               <td align="left"> {this.state.claveVisible ? this.props.datos.clave : '******'} </td>
               <span> <input type="checkbox"  onClick={this.mostrar.bind(this)}/><i>Mostrar</i></span>
               <span> <button className="Boton" onClick={this._remove.bind(this)}><i >   Eliminar</i></button> </span>                              
            </tr>
        )
    }
}
 
 
export default Item;