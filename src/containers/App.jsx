import React, { Component } from 'react';
import axios from 'axios';
import { CONF } from '../config/index';
import Main from './Main.jsx';
import Footer from './Footer.jsx';
import keys from '../config/keys';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textContent: {
        header: null,
        subHeader: null,
        congressLanguage: null,
        main: null,
        disclaimer: null,
        formButton: null,
        modalHeader: null,
        modalText: null,
        fccComment: '',
        tweet: null,
      },
      loading: true,
    };
  }

  componentDidMount() {
    const { tipeAuth, tipeId } = keys;
    window.scrollTo(0, 0);

    axios({
      method: 'get',
      url: `https://api.tipe.io/api/v1/document/${CONF.tipeTextFolderId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: tipeAuth,
        'Tipe-Id': tipeId,
      },
    })
      .then((response) => {
        const { data } = response;

        this.setState({
          textContent: {
            header: data.blocks[0].value,
            subHeader: data.blocks[1].value,
            fccComment: data.blocks[2].value,
            formButton: data.blocks[3].value,
            disclaimer: data.blocks[4].value,
            congressLanguage: data.blocks[5].value,
            main: data.blocks[6].value,
            modalHeader: data.blocks[7].value,
            modalText: data.blocks[8].value,
            tweet: data.blocks[9].value,
          },
          loading: false,
        });
      })
      .catch(console.error);
  }

  render() {
    const {
      header,
      subHeader,
      fccComment,
      main,
      congressLanguage,
      disclaimer,
      formButton,
      modalHeader,
      modalText,
      tweet,
    } = this.state.textContent;

    return (
            <div style={{ display: this.state.loading ? 'none' : 'block' }}>
                <Main
                header={ header }
                subHeader={ subHeader }
                fccComment={ fccComment }
                main={ main }
                congressLanguage={ congressLanguage }
                disclaimer={ disclaimer }
                formButton={ formButton }
                modalHeader={ modalHeader }
                modalText= { modalText }
                />
                <Footer tweet= {tweet} />
            </div>
    );
  }
}

export default App;
