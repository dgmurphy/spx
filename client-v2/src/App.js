import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, TextArea } from "@blueprintjs/core";
import autobind from 'react-autobind';
import displaCy from './displacy';
import displaCyENT from './displacy-ent'
import { DOC_FULL_IIR, DOC_IIR_ABRIDGED, DOC_ONE_SENTENCE,
         DOC_ONE_PARAGRAPH } from './constants'
import Table from './Table'


class App extends Component {

  constructor(props) {

    super(props)
    autobind(this);

    this.state = { 
      apiResponse: "",
      textContent: DOC_ONE_SENTENCE,
      nlpResults: "",
      nounChunks: [],
      parseTreeA: [],
      parseTreeB: [],
      pos: [],
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
    this.getDep()
    this.getNounChunks()
    this.getParseTreeA()
    this.getParseTreeB()
    this.getPOS()
  }


  getPOS() {
    let self = this
    let url = this.serverUrl + 'test-pos'

    //console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.updatePOS(data))
      .catch((err) => console.log(err))       
  }
  
  getParseTreeB() {
    let self = this
    let url = this.serverUrl + 'test-parse-tree-b'

    //console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.updateParseTreeB(data))
      .catch((err) => console.log(err))    
  }



  getParseTreeA() {
    let self = this
    let url = this.serverUrl + 'test-parse-tree-a'

    //console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then((data) => self.updateParseTreeA(data))
      .catch((err) => console.log(err))    
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

  updatePOS(data) {
    this.setState({pos: data.pos})
  }

  updateNounChunks(data) {
    //console.log(data)
    this.setState({nounChunks: data.chunks})
  }

  updateParseTreeA(data) {
    this.setState({parseTreeA: data.tree})
  }

  updateParseTreeB(data) {
    this.setState({parseTreeB: data.tree})
  }

  
  getDep() {
    let self = this
    let url = this.serverUrl + 'test-display'

    //console.log(this.state.textContent)
    let posttext = this.state.textContent
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'text': posttext})
    }).then((res) => res.json())
      .then(self.displacy_dep.parse(posttext))
      .catch((err) => console.log(err))
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
    let entityPOSHeading = <div></div>
    let nounChunksHeading = <div></div>
    let parseTreeAHeading  =<div></div>
    let parseTreeBHeading  =<div></div>
    let depHeading = <div></div>

    if (this.state.entitiesReady) {
      entityRenderHeading = <h2>Entity Render</h2>
      entityPOSHeading = <h2>Parts of Speech</h2>
      nounChunksHeading = <h2>Noun Chunks</h2>
      parseTreeAHeading = <h2>Parse Tree Table 1</h2>
      parseTreeBHeading = <h2>Parse Tree Table 2</h2>
      depHeading = <h2> Dependency Tree</h2>
    }

    return (
      <div className="spx-app">

        <h2>Doc Text:</h2>

        <div className="doc-buttons">

          <Button 
            onClick={(e)=>this.changeText(DOC_FULL_IIR, e)}>
            Complete IIR
          </Button>

          <Button 
            onClick={(e)=>this.changeText(DOC_IIR_ABRIDGED, e)}>
            Abridged IIR
          </Button>

          <Button id="oneparagraph" 
            onClick={(e)=>this.changeText(DOC_ONE_PARAGRAPH, e)}>
            One Paragraph
          </Button>

          <Button id="onesentence" 
            onClick={(e)=>this.changeText(DOC_ONE_SENTENCE, e)}>
            One Sentence
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
          {entityPOSHeading}
          <div id="pos-list">
            <Table data={this.state.pos}/>
          </div>
        </div>
        

        <div className="output-section">
          {nounChunksHeading}
          <div id="noun-chunks">
            <Table data={this.state.nounChunks}/>
          </div>
        </div>

        <div className="output-section">
          {parseTreeAHeading}
          <div id="parse-tree-a">
            <Table data={this.state.parseTreeA}/>
          </div>
        </div>

        <div className="output-section">
          {parseTreeBHeading}
          <div id="parse-tree-b">
            <Table data={this.state.parseTreeB}/>
          </div>
        </div>

        <div className="output-section">
          {depHeading}
          <div id="displacy-dep-out">
            &nbsp;
          </div>
        </div>


      </div>
    )
  }
}

export default App;
