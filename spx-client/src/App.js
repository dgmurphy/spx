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

    
    this.devUrl = "http://localhost:9001/"
    this.prodUrl = "http://10.59.59.47:9001/"
    this.serverUrl = this.prodUrl
    if (process.env.NODE_ENV === 'development')
      this.serverUrl = this.devUrl

    console.log("Server url: " + this.serverUrl)

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
   
    let url = this.serverUrl + 'test-display'
    this.displacy = new displaCy(url, {container: '#displacy'})
  }


  parse() {

    let self = this
    let url = this.serverUrl + 'test-py'

    console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.logdata(data))
      .then(self.displacy.parse(posttext))
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
