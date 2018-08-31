import React, { Component } from 'react';
import { CONF } from '../config/index'
import Main from './Main.jsx'
import Footer from './Footer.jsx'
import axios from 'axios'
import keys from '../config/keys'

class App extends Component {
   
    constructor(props) {
        super(props)

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
                tweet: null
            },
            loading: true
        }  
    }

    componentDidMount(){
        const { tipeAuth, tipeId } = keys;
        window.scrollTo(0, 0);

        axios({
          method: "get",
          url: 'https://api.tipe.io/api/v1/document/5b68af8f5995200013fc7f9e',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tipeAuth,
            'Tipe-Id': tipeId
          }
        })
        .then(response => {
          const { data } = response
          console.log(data);
          this.setState({
            textContent:{
              header: data.blocks[6].value,
              subHeader: data.blocks[8].value,
              congressLanguage: data.blocks[4].value,
              main: data.blocks[5].value,
              disclaimer: data.blocks[0].value,
              formButton: data.blocks[2].value,
              modalHeader: data.blocks[1].value,
              modalText: data.blocks[3].value,
              tweet: data.blocks[7].value
            },
            loading: false
          })
        })
        .catch(console.error);

      }

    render() {
        const { 
            header, 
            subHeader, 
            main, 
            congressLanguage, 
            disclaimer, 
            formButton, 
            modalHeader, 
            modalText, 
            tweet 
        } = this.state.textContent
        
        return(     
            <div style={{display: this.state.loading ? 'none': 'block'}}>
                <Main 
                header={ header } 
                subHeader={ subHeader} 
                main={ main } 
                congressLanguage={ congressLanguage } 
                disclaimer={ disclaimer }
                formButton={ formButton }
                modalHeader={ modalHeader }
                modalText= { modalText }
                />
                <Footer tweet= {tweet} />
            </div>
        )
    }
}

export default App;