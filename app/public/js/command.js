import React, {Component} from 'react';
import Signal from './signal.js';
import fetch from 'isomorphic-fetch';

export default class Command extends Component {
  constructor(props){
    super(props);
    this.state = {
      signals: this.props.signals || []
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drop(ev) {
    ev.preventDefault();
    var signal = JSON.parse(ev.dataTransfer.getData("signal"));

    var conflicts = this.state.signals.filter((s)=>{
      console.log("signal", signal, "s", s)
      return s.id === signal.id && s.device === signal.device
    })
    if (conflicts.length === 0){
      this.addSignal(signal);
    }
  }

  addSignal(signal){
    var body = [
        {
          id: signal.id,
          device: signal.device,
          imageName: signal.imageName,
          description: signal.description
        }
      ]
    fetch('api/command/' + this.props.id, {
      method: 'put',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(body)
    })
    .then((response)=>{
      return response.json()
    })
    .then((json)=>{
      // console.log(json)
    })
    this.setState({signals: this.state.signals.concat(signal)}, ()=>{
      console.log("signals", this.state.signals)
    })
  }

  render(){
    var style = {
      background: "#f7ece3",
      color: "#d9823c",
      fontSize: "18px",
      display: "flex",
      justifyContent: "space-between",
      borderRadius: "4px",
      padding: "10px",
      margin: "10px",

    };
    var optionsStyle = {
      display: "flex",
      justifyContent: "space-between"
    };
    var command = {
      padding: "5px"
    }
    var optionsIcon = {
      marginLeft: "10px",
      marginTop: "6px"
    }

    return (
      <div style={style} onDrop={this.drop.bind(this)} onDragOver={this.allowDrop}>
        <div style={command}>
          {this.props.command}
        </div>
        <div style={optionsStyle}>
          {
            this.state.signals && this.state.signals.map((signal)=>{
              return <Signal
              device={signal.device}
              commandId={this.props.id}
              imageName={signal.imageName}
              description={signal.description}
              command={this.props.command}
              copyable={false}
              id={signal.id}
              key={signal.device + signal.id} />
            })
          }
          <div style={optionsIcon}>
            <img src="../images/settings.png" width="24" height="22"/>
          </div>
        </div>
      </div>
    )
  }
}
