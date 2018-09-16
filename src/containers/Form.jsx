import React, { Component } from 'react';
import Markdown from 'react-markdown';
import Responsive from 'react-responsive-decorator';
import axios from 'axios';
import { getQueryVariables } from '../utils';
import { CONF, URLS } from '../config';
import keys from '../config/keys';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = getQueryVariables();
    this.state.formSubmitted = false;
    this.state.countDown = 5;
    this.state.isMobile = false;
    this.state.loading = false;
    this.onSubmit = this.onSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.props.media({ minWidth: 768 }, () => {
      this.setState({
        isMobile: false,
      });
    });
    this.props.media({ maxWidth: 768 }, () => {
      this.setState({
        isMobile: true,
      });
    });
  }

  render() {
    let modal = null;
    let topOfPage = null;
    let middle = null;
    let formButtonText = null;
    const {
      header, subHeader, formButton, disclaimer, ftcComment, modalHeader, modalText,
    } = this.props;
    console.log(ftcComment);
    const subHeaderDiv = (
        <div id="subHeader">
          <Markdown source={ subHeader } />
        </div>
    );


    if (this.state.loading) {
      formButtonText = (<span>Loading ...</span>);
    } else {
      formButtonText = (<span>{ formButton }</span>);
    }

    const form = (
        <div>
        <form id="form">
        <div className="flex">
          <input type="text" className="form-input" name="name" placeholder="Your Name" />
          <input type="email" className="form-input" name="email" placeholder="Your Email" />
        </div>
        <div className="flex">
          <input type="text" className="form-input" name="street" placeholder="Street Address" />
          <input type="text" className="form-input" name="zip" placeholder="Your Zipcode" />
        </div>
        <div className="flex" style={{ marginBottom: '20px' }}>
          <textarea type="text" className="form-input" name="comment" placeholder="Comment" >
I write to urge the Commission to deny Sprint and T-Mobile’s request to merge. Over the past decade, the wireless industry has aggressively consolidated, leaving consumers with only four choices for national cell phone providers. Sprint and T-Mobile have both carved out a niche in the marketplace by providing lower cost plans, shorter contracts, and other consumer-friendly practices, compared to their rivals AT&T and Verizon. Sprint and T-Mobile compete directly with each other for the same market share, which results in higher quality plans and lower costs for their customers, many of whom are low-income and people of color. A merger between Sprint and T-Mobile would disproportionately and negatively impact these consumers, and lead to higher prices for all wireless customers. 
          </textarea>
        </div>
        <div className="flex" style={{ marginTop: '25px' }}>
          <button className="btn">
            {formButtonText}
          </button>
        </div>
      </form>
      <span><i>{disclaimer}</i></span>
      <br/><br/>
      </div>
    );

    if (this.state.isMobile) {
      topOfPage = form;
      middle = subHeaderDiv;
    } else {
      topOfPage = subHeaderDiv;
      middle = form;
    }

    if (this.state.formSubmitted) {
      modal = (
              <div id="thanks" className="modal-wrapper-thanks modal-open-thanks" style={{ display: this.state.formSubmitted ? 'block' : 'none' }}>
              <div className="modal-thanks">
                <a className="close-thanks" href="#" onClick={ this.closeModal }>×</a>
                <header>
                  <h2 id="modal-header-thanks">{modalHeader}</h2>
                </header>
                <article>
                <Markdown className="modal-thanks-text" source= {modalText} />
                </article>
              </div>
            </div>
      );
    }

    return (
        <div className="bftn-form call-action-form" onSubmit={ this.onSubmit }>
          <Markdown source={header} />
            {topOfPage}
            {middle}
            {modal}
          </div>
    );
  }

  closeModal(evt) {
    evt.preventDefault();
    this.setState({ formSubmitted: false });
  }

  onSubmit(evt) {
    evt.preventDefault();

    this.setState({
      loading: true,
    });

    const form = evt.target;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const { name, email, zip } = form;

    if (!name.value.trim()) {
      name.focus();
      alert('Please enter your name.');
      return;
    }

    if (!email.value.trim()) {
      email.focus();
      alert('Please enter your email.');
      return;
    } if (!emailRegex.test(email.value.trim())) {
      email.focus();
      alert('Please enter a valid email.');
      return;
    }

    const address1 = form.street;
    if (!address1.value.trim()) {
      address1.focus();
      alert('Please enter your address.');
      return;
    }

    const fcc_comment = form.comment;
    if (!fcc_comment.value.trim()) {
      fcc_comment.focus();
      alert('Please enter your comment.');
      return;
    }

    if (!zip.value.trim()) {
      zip.focus();
      alert('Please enter your Zipcode.');
      return;
    } if (zip.value.length < 5 || zip.value.length > 5) {
      zip.focus();
      alert('Please enter a valid Zipcode.');
      return;
    }

    const fields = {
      action_user_agent: navigator.userAgent,
      action_fcc_comment: fcc_comment.value.trim(),
      country: 'United States',
      email: email.value.trim(),
      form_name: 'act-petition',
      js: 1,
      name: name.value.trim(),
      address1: address1.value.trim(),
      zip: zip.value.trim(),
      opt_in: 1,
      page: CONF.actionKitPageShortName,
      source: this.state.source || 'website',
      want_progress: 1,
    };

    this.sendFormToActionKit(fields);
  }

  clearUserForm() {
    const formFlex = document.getElementById('form').getElementsByClassName('flex');
    // loop through items to clear form
    const firstRow = formFlex[0].getElementsByClassName('form-input');
    const secondRow = formFlex[1].getElementsByClassName('form-input');
    const thirdRow = formFlex[2].getElementsByClassName('form-input');
    firstRow[0].value = '';
    firstRow[1].value = '';
    secondRow[0].value = '';
    secondRow[1].value = '';
    thirdRow[0].value = '';
  }

  sendFormToActionKit(fields) {
    // iFrame
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('name', 'actionkit-iframe');
    document.body.appendChild(iframe);

    // Form
    const form = document.createElement('form');
    form.style.display = 'none';
    form.setAttribute('action', URLS.actionKit);
    form.setAttribute('method', 'post');
    form.setAttribute('target', 'actionkit-iframe');
    document.body.appendChild(form);

    Object.keys(fields).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });
    form.submit();

    const {
      name, email, address1, zip, action_fcc_comment,
    } = fields;
    const first_name = name.split(' ')[0];
    const last_name = name.split(' ')[1] ? name.split(' ')[1] : '';

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios({
      method: 'post',
      url: `https://publicapi.fcc.gov/ecfs/filings?api_key=${keys.fccKey}`,
      data: {
        proceedings: [
          {
            // bureau_code: 'WTB',
            // bureau_name: 'Wireless Telecommunications Bureau',
            // name: '18-197',
          },
        ],
        filers: [
          {
            name: `${first_name} ${last_name}`,
          },
        ],
        contact_email: email,
        addressentity: {
          address_line_1: address1,
          city: 'oakland',
          state: 'ca',
          zip_code: zip,
        },
        text_data: action_fcc_comment,
        express_comment: 1,
      },
      axiosConfig,
    })
      .then((response) => {
        console.log('success', response);
        this.setState(
          {
            formSubmitted: true,
            loading: false,
          }, () => { this.clearUserForm(); },
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default Responsive(Form);
