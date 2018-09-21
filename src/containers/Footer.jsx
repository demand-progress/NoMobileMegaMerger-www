import React, { Component } from 'react';
import axios from 'axios';
import Logo from './Logo.jsx';
import { CONF } from '../config/index';
import keys from '../config/keys.js';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allLogos: null,
    };
  }

  componentDidMount() {
    const { tipeAuth, tipeId } = keys;
    axios({
      method: 'get',
      url: `https://api.tipe.io/api/v1/document/${CONF.tipeLogoFolderId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: tipeAuth,
        'Tipe-Id': tipeId,
      },
    })
      .then((response) => {
        const logos = response.data.blocks;
        this.setState({
          allLogos: logos,
        });
      })
      .catch(console.error);
  }

  render() {
    let logos = null;
    const tweet = 'https://twitter.com/intent/tweet?text=' + this.props.tweet;

    if (this.state.allLogos) {
      const orderedLogos = this.state.allLogos.sort((a, b) => {
                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
            });

      logos = orderedLogos.map(({ key, name, value }) => <Logo key={value.key} alt={name} src={value.url}/>,
      );
    }

    return (
            <div id="footer">
                <div className="footer">
                    <div className="logos-unit">
                        <div className="built-by">
                            <p><br/><br/>Built by:</p> <img src="images/demand-progress.png" />
                            {/* <p>In partnership with: </p> <img src="images/DailyKosLogo.png" /> */}
                        </div>
                        <div className="logos" style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', alignItems: 'center'}}>
                            {logos}
                        </div>
                        <div className="footer-social">
                            <div className="press-inquiries">
                                <h3>For Press inquiries, please contact us at:</h3>
                                <p>
                                    <a className="no-em" href="tel:1-202-681-7582">202-681-7582</a> or <a href="mailto:press@demandprogress.org">press@demandprogress.org</a>
                                </p>
                                <br/>
                                <p>
                                    <a href="https://demandprogress.org/privacy-policy/" target="_blank">Our privacy policy</a>
                                </p>
                            </div>
                            <div className="social-media">
                                <a className="twitter" href={tweet} target="_blank">
                                    <img src="images/twitter_white.svg" />
                                    <span>Share on twitter</span>
                                </a>
                                <a className="facebook" href="https://www.facebook.com/sharer.php?u=https://nomobilemegamerger.com/" target="_blank">
                                    <img src="images/facebook_white.svg" />
                                    <span>Share on facebook</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
  }
}

export default Footer;
