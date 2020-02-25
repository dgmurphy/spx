import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, TextArea } from "@blueprintjs/core";
import autobind from 'react-autobind';
import displaCy from './displacy'

class App extends Component {

  constructor(props) {

    super(props)
    autobind(this);

    this.state = { 
      apiResponse: "",
      textContent: "Spanning the globe to bring you the constant variety of sport.\n" +
        "The thrill of victory,\n" + 
        "and the agony of defeat.",
      nlpResults: ""
    }

    

  }

  onInputChange(textContent) {
    this.setState({ textContent: textContent.target.value })
  } 



  logres(res) {
    console.log("res: " + res)
  }

  logdata(data) {
    console.log(data)
    this.setState({apiResponse: data.text})
  }


  componentDidMount() {
   
    this.displacy = new displaCy('http://localhost:9000/test-display', {container: '#displacy'})
  }


  parse() {

    let self = this

    console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch('/test-py', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.logdata(data))
      .then(self.displacy.parse())
      .catch((err) => console.log(err))
  }

  parseTest() {
    console.log("parse test")
  }

  render() {
    return (
      <div className="spx-app">
        
        <div className="input-text">
          <TextArea fill={true} 
            onChange={this.onInputChange} 
            value={this.state.textContent} 
            rows={6} cols={50}
            />
        </div>
         <Button onClick={this.parse}>Render</Button>
         <div className="nlp-div">
           <p className="nlp-results">{this.state.apiResponse}</p>
         </div>

         <div id="displacy">
          &nbsp;
         </div>

      </div>
    )
  }
}

export default App;
