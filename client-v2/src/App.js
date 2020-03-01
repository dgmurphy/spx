import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, TextArea } from "@blueprintjs/core";
import autobind from 'react-autobind';
import displaCy from './displacy';
import displaCyENT from './displacy-ent'
import { DOC_FULL_IIR, DOC_IIR_ABRIDGED, DOC_ONE_SENTENCE } from './constants'
import Table from './Table'


class App extends Component {

  constructor(props) {

    super(props)
    autobind(this);

    this.state = { 
      apiResponse: "",
      textContent: DOC_FULL_IIR,
      nlpResults: "",
      nounChunks: [],
      entitiesReady: false
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
    //console.logconsole.log("res: " + res)
  }

  logdata(data) {
    //console.log(data)
    this.setState({apiResponse: data.text})
  }


  componentDidMount() {
   
    let url = this.serverUrl + 'test-display'
    let url_ent = this.serverUrl + 'test-display-ent'
    this.displacy_dep = new displaCy(url, {container: '#displacy-dep-out'})
    this.displacy_ent = new displaCyENT(url_ent, 
      {
        container: '#displacy-ent-out',
        defaultText: 'Why does Rice play Texas?',
        defaultEnts: ['person', 'org', 'date']
      })
  }

  analyze() {
    this.parse()
    this.getNounChunks()
  }

  
  getNounChunks() {

    let self = this
    let url = this.serverUrl + 'test-noun-chunks'

    //console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.updateNounChunks(data))
      .catch((err) => console.log(err)) 

  }

  updateNounChunks(data) {
    //console.log(data)
    this.setState({nounChunks: data.chunks})
  }


  parse() {

    const model = 'en';
    const ents = ['person', 
      'org', 
      'gpe', 
      'loc', 
      'product', 
      'date', 
      'time', 
      'norp',
      'mgrs' ];
    

    let self = this
    let url = this.serverUrl + 'test-py'

    //console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.logdata(data))
      .then(self.displacy_ent.parse(posttext, model, ents))
      .then(this.setState({entitiesReady: true}))
      .catch((err) => console.log(err))
  }

  parseTest() {
    console.log("parse test")
  }

  changeText(text, e) {
    this.setState({textContent: text})
  }

  render() {

    let entityRenderHeading = <div></div>
    let nounChunksHeading = <div></div>

    if (this.state.entitiesReady) {
      entityRenderHeading = <h2>Entity Render:</h2>
      nounChunksHeading = <h2>Noun Chunks:</h2>
    }

    return (
      <div className="spx-app">

        <h2>Doc Text:</h2>

        <div className="doc-buttons">

          <Button id="onesentence" 
            onClick={(e)=>this.changeText(DOC_ONE_SENTENCE, e)}>
            One Sentence
          </Button>

          <Button 
            onClick={(e)=>this.changeText(DOC_IIR_ABRIDGED, e)}>
            Abridged IIR
          </Button>

          <Button 
            onClick={(e)=>this.changeText(DOC_FULL_IIR, e)}>
            Complete IIR
          </Button>

          <Button id="submit" onClick={this.analyze} intent="primary">
            Submit
          </Button>

        </div>

        <div className="input-text">
          <TextArea fill={true}
            onChange={this.onInputChange}
            value={this.state.textContent}
            rows={15}
          />
        </div>
        

        
        <div className="output-section">
          {entityRenderHeading}
          <div id="displacy-ent-out">
            &nbsp;
          </div>
        </div>

        <div className="output-section">
          {nounChunksHeading}
          <div id="noun-chunks">
            <Table data={this.state.nounChunks}/>
          </div>
        </div>

        <div id="displacy-dep-out">
          &nbsp;
         </div>

      </div>
    )
  }
}

export default App;
