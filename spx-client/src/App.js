import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, TextArea } from "@blueprintjs/core";
import autobind from 'react-autobind';

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

  callAPI() {
    fetch("http://localhost:9000/test-py")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err)
  }


  postText() {
    let self = this

    console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch('http://localhost:9000/test-py', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.logdata(data))
      .catch((err) => console.log(err))
  }

  logres(res) {
    console.log("res: " + res)
  }

  logdata(data) {
    console.log(data)
    this.setState({apiResponse: data.text})
  }


  componentDidMount() {
    //this.callAPI();
  }

  sendText() {
    this.postText()
    //this.callAPI()
    //this.setState({ nlpResults: this.state.textContent})
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
         <Button onClick={this.sendText}>Submit</Button>
         <div className="nlp-div">
           <p className="nlp-results">{this.state.apiResponse}</p>
         </div>

      </div>
    )
  }
}

export default App;
