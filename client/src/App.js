/*
Sample URLs:
https://www.youtube.com/watch?v=fWaHN7q8Cow
https://www.youtube.com/watch?v=Hk8tr01_jU4
https://www.youtube.com/watch?v=03EcKq3EYbs
*/

import React, { Component } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver'; 
import { StyleSheet, css } from 'aphrodite';

let secondaryColour = '#7C77B9';

const styles = StyleSheet.create({
  pageTitle: {
    textAlign: 'center',
    fontSize: '3em',
    color: `${secondaryColour}`
  },

  inputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    outline: 'none',
    backgroundColor: `${secondaryColour}`,
    padding: '20px 10px 20px 10px',
    margin: '0 auto',
    width: '50%',
  },

  linkInput: {
    outline: 'none',
    border: `solid 5px ${secondaryColour}`,
    height: '50px',
    fontSize: '20px',
    textIndent: '10px',
    width: '62%'
  },

  langInput: {
    outline: 'none',
    border: `solid 5px ${secondaryColour}`,
    height: '50px',
    fontSize: '20px',
    width: '6vw',
    textIndent: '2px',
  },

  button: {
    backgroundColor: '#1E2019',
    color: `${secondaryColour}`,
    padding: '.5rem 1rem',
    border: '1px solid black',
    fontWeight: '700',
    fontSize: '25px',
    cursor: 'pointer',
    marginTop: '8px',
    borderRadius: '2px',
    outline: 'none'
  },

  infoContainer: {
    margin: '0 auto',
    color: '#FFFFFC',
    fontWeight: '600',
    textAlign: 'center',
    width: '45%',
  },

  infoTitle: {
    fontSize: '2em',
  },

  infoParagraph: {
    fontSize: '1.5em',
    lineHeight: '1.3',
    letterSpacing: '0.2px',
    fontFamily: "Avenir Next"
  },

  a: {
    color: '#FFFFFC'
  }

});

class App extends Component {
  state = {
    link: 'https://www.youtube.com/watch?v=03EcKq3EYbs',
    lang: 'de',
    // targets: [],
  }

  handleChange = ({target: { value, name }}) => {
    this.setState({ [name]: value });
  }

  // collectTargets(e) {
  //   //console.log('targets: ', e.target.value);
  //   let listOfTargets = e.target.value;
  //   let listOfTargetsAsArray = listOfTargets.toLowerCase().split(",");
  //   console.log(listOfTargetsAsArray);
  //   this.setState({ targets: listOfTargetsAsArray });
  //   console.log(listOfTargetsAsArray);
  // }

  createAndDownloadPdf = () => {
    axios.post('/create-pdf', this.state)
      .then(() => axios.get('fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

        saveAs(pdfBlob, 'newPdf.pdf');
      })
  }

  render() {
    return(
      <div className="App">
        <div className={css(styles.pageTitleContainer)}>
          <h1 className={css(styles.pageTitle)}>Transcript</h1>
        </div>
        <div className={css(styles.inputContainer)}>
          <input type="text" placeholder="link" name="link" className={css(styles.linkInput)} onChange={this.handleChange} />
          <input type="text" placeholder="lang" name="lang" value={this.state.lang} maxLength="2" className={css(styles.langInput)} onChange={this.handleChange} />
          <button onClick={this.createAndDownloadPdf} className={css(styles.button)}>
            Download PDF
          </button>
        </div>
        <div className={css(styles.infoContainer)}>
          <h2 className={css(styles.infoTitle)}>More Info</h2>
          <p className={css(styles.infoParagraph)}>
            This app combines generated captions from a given video. 
            I originally made this to practice German by listening to podcasts/interviews/commentaries on YouTube while following
            along the subtitles. Maybe you can find other use cases. :D
          </p>

          <p className={css(styles.infoParagraph)}>
            It was made with <span style={{color: 'lightgreen'}}>NodeJS</span>, 
            Express, <span style={{color: '#62DAFB'}}>ReactJS</span>, tears, frustration,
            existential questioning, more tears, anger, and acceptance.. which is usually how software development goes. 
            Here it is on <a href="https://github.com/OneCodeMan/der-spiegel" className={css(styles.a)}>Github</a>.
          </p>
        </div>
        {/* <input type="text" placeholder="targets" name="targets" onChange={this.collectTargets} /> */}
    </div>
    );
  } 
}

export default App;
