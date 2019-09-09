import React, { Component } from 'react';
 
class Item extends Component{
    
   constructor(props){
    super(props);
    this.state = {
         claveVisible: false
    }
   }

    quitarCuenta(){
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
               <td width="30%" > {this.state.claveVisible ? this.props.datos.clave : '******'} </td>
               <td> <input type="checkbox"  onClick={this.mostrar.bind(this)}/></td>
               <td> <button className="Boton" onClick={this.quitarCuenta.bind(this)}><i >   Eliminar</i></button> </td>                              
            </tr>
        )
    }
}
 
 
export default Item;