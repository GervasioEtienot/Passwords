import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

class ComponenteCuenta extends Component{
  
    state = {
        cuenta:"",
        usuario:"",
        clave:""
    };

onFormChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
    } 
onFormSubmit = (event) => {
    event.preventDefault();
    const datosCuenta = {
        cuenta: this.state.cuenta,
        usuario: this.state.usuario,
        clave: this.state.clave
    }
    this.setState({cuenta:"", usuario:"", clave:""});
    this.props.traeDatos(datosCuenta);
}


  render(){
    return(
        <div>
          <Grid>
            <Row>
              <Col xs={1} sm={1} md={2} lg={2} />
              <Col xs={10} sm={10} md={8} lg={8} className="Grid">
                <div className="ui inverted segment">
                   <form className="ui inverted form" onSubmit={this.onFormSubmit}>
                      <div className="field">
                        <label>Cuenta</label>
                        <input type="text" 
                               name="cuenta" 
                               id="cuenta" 
                               placeholder="Cuenta" 
                               value={this.state.cuenta} 
                               onChange={this.onFormChange} />
                      </div>
                      <div className="field">
                        <label>Usuario</label>
                        <input type="text" 
                               name="usuario" 
                               placeholder="Usuario" 
                               value={this.state.usuario} 
                               onChange={this.onFormChange} />
                      </div>
                      <div className="field">
                        <label>Clave</label>
                        <input type="password" 
                               name="clave" 
                               placeholder="Clave" 
                               value={this.state.clave} 
                               onChange={this.onFormChange} />
                      </div>
                        <br/>
                      <div className="ui buttons">
                        <button className="ui button" 
                                onClick={() => {this.props.cancelarRegistro();} }>Cancelar</button>
                        <button className="ui positive button" onClick={this.onFormSubmit} >Guardar</button>
                      </div>
                  </form>
                </div>
              </Col>
              <Col xs={1} sm={1} md={2} lg={2} />
            </Row>
          </Grid>
        </div>
    );
  }
}

export default ComponenteCuenta;