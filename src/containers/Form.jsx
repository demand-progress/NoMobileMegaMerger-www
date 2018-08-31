import React, { Component } from 'react';
import Markdown from 'react-markdown';
import Responsive from 'react-responsive-decorator';
import axios from 'axios';
import { getQueryVariables } from '../utils';
import { CONF, URLS } from '../config';

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

    const subHeader = (
        <div id="subHeader">
          <Markdown source={this.props.subHeader} />
        </div>
    );


    if (this.state.loading) {
      formButtonText = (<span>Loading ...</span>);
    } else {
      formButtonText = (<span>{this.props.formButton}</span>);
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
          <textarea type="text" className="form-input" name="comment" placeholder="Comment">
          I write to urge the Commission to do more to protect consumers from the harmful practices of tech giants. We have seen numerous examples of these giants abusing their power and their dominant market position to undermine competition, consumer privacy, and our democratic rights. These companies have been allowed to reach their current size and power due to a relative lack of scrutiny and oversight by regulators. It is time for regulators, including this Commission, to step in now to change course in order to protect the public interest. The Commission has should use its competition authority to examine these tech giants, including any future mergers they might propose, with a very close eye. The Commission should strongly leverage violations of existing consent decrees to obtain meaningful relief for consumers. The Commission should also interpret and use its authority to prohibit unfair and deceptive trade practices to protect consumers, communities, and our democracy as a whole from the wide range of harm being committed by tech giants. The Commission must look not only at the largest companies, but also the ecosystem and market practices that promote the harmful data-driven practices on which tech giants thrive.
          </textarea>
        </div>
        <div className="flex" style={{ marginTop: '25px' }}>
          <button className="btn">
            {formButtonText}
          </button>
        </div>
      </form>
      <span><i>{this.props.disclaimer}</i></span>
      <br/><br/>
      </div>
    );

    if (this.state.isMobile) {
      topOfPage = form;
      middle = subHeader;
    } else {
      topOfPage = subHeader;
      middle = form;
    }

    if (this.state.formSubmitted) {
      modal = (
              <div id="thanks" className="modal-wrapper-thanks modal-open-thanks" style={{ display: this.state.formSubmitted ? 'block' : 'none' }}>
              <div className="modal-thanks">
                <a className="close-thanks" href="#" onClick={ this.closeModal }>×</a>
                <header>
                  <h2 id="modal-header-thanks">{this.props.modalHeader}</h2>
                </header>
                <article>
                <Markdown className="modal-thanks-text" source= {this.props.modalText} />
                </article>
              </div>
            </div>
      );
    }

    return (
        <div className="bftn-form call-action-form" onSubmit={ this.onSubmit }>
          <Markdown source={this.props.header} />
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

    // const {
    //   name, email, zip, action_fcc_comment,
    // } = fields;
    // const first_name = name.split(' ')[0];
    // const last_name = name.split(' ')[1] ? name.split(' ')[1] : '';

    // axios.post('https://fcc-comment-api.herokuapp.com/comment',
    //   {
    //     first_name,
    //     last_name,
    //     fcc_comment: action_fcc_comment,
    //     email,
    //     zip,
    //   })
    //   .then((response) => {
    //     console.log('fcc comment posted ', response.data);
    //   })
    //   .catch(console.error);
    form.submit();
    setTimeout(
      () => {
        this.setState(
          {
            formSubmitted: true,
            loading: false,
          }, () => { this.clearUserForm(); },
        );
      },
      1500,
    );
  }
}

export default Responsive(Form);
