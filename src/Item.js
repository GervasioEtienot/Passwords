import React, { Component } from 'react';
 
class Item extends Component{
    
   constructor(props){
    super(props);
    this.state = {
         claveVisible: false,
         icono: "large eye icon"
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
      if(this.state.claveVisible){ 
          this.setState({icono: "large eye icon"});
     }
     else{
         this.setState({icono: "large eye slash icon"});
     }
    }
    render(){
        return (
            <tr >
               <td align="left"> {this.props.datos.cuenta} </td>
               <td align="left"> {this.props.datos.usuario} </td>
               <td width="30%" > {this.state.claveVisible ? this.props.datos.clave : '******'} </td>
               <td> 
                  <i className={this.state.icono} onClick={this.mostrar.bind(this)}></i>
                  <i class="large pencil alternate icon"></i>
                  <i class="large trash alternate icon" onClick={this.quitarCuenta.bind(this)}></i> 
               </td>                              
            </tr>
        )
    }
}
 
 
export default Item;