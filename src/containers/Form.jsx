import React, { Component } from 'react';
import { CONF, URLS } from '../config';
import { getQueryVariables } from '../utils';
import Markdown from 'react-markdown'
import Responsive from 'react-responsive-decorator';


class Form extends Component {

    constructor(props) {
        super(props)
        this.state = getQueryVariables()
        this.state.submitted = false
        this.state.countDown = 5
        this.state.isMobile = false
        this.state.isBusiness = false
        this.onSubmit = this.onSubmit.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.business = this.business.bind(this)
    }

    componentDidMount(){
      this.props.media({ minWidth: 768 }, () => {
        this.setState({
          isMobile: false
        })
      })
      this.props.media({ maxWidth: 768 }, () => {
        this.setState({
          isMobile: true
        })
      })
    }

    business() {
      const checkBoxStatus = document.getElementById("business").checked ? true : false;
      this.setState({
        isBusiness: checkBoxStatus
      })
    }

    render() {
      let modal = null;
      let topOfPage = null;
      let middle = null; 
      let headerContent = null;
      let businessForm = null; 

      const subHeader = (
        <div id="subHeader">          
          <Markdown source={this.props.subHeader} />
        </div>
      )

      const form = (
        <div>
        <form id="form">
        <div className="flex">
          <input type="text" className="form-input" name="name" placeholder="Your Name" />
          <input type="email" className="form-input" name="email" placeholder="Your Email" />
        </div>
        <div className="flex" style={{marginBottom: '20px'}}>
          <input type="text" className="form-input" name="street" placeholder="Street Address" />
          <input type="text" className="form-input" name="zip" placeholder="Your Zipcode" />
        </div>
        <div style={{display: this.state.isBusiness ? 'block' : 'none'}}>
          <div className="flex">
            <input type="text" className="form-input" name="company_name" placeholder="Business Name*" />
            <input type="text" className="form-input" name="company_website" placeholder="Business Website*" />
          </div>
          <div className="flex">
            <input type="text" className="form-input" name="company_zipcode" placeholder="Business Zipcode*" />
            <input type="text" className="form-input" name="company_phone" placeholder="Phone Number" />
          </div>
        </div>
        <input id='business' onClick={ this.business } name="business_checkbox" style={{padding:'0', margin:'0',verticalAlign:'bottom', position: 'relative', width: '20px', height: '20px', borderRadius: '5px', border: '2px solid #555'}} type="checkbox"/>
        <label style={{display:'inline', textIndent:'-15px'}}>
        <strong>Check this box if you own a small business and want to help save net neutrality. Small businesses will be among those hurt most by the loss of net neutrality, but they can also play a key role in saving it.
        </strong>
      </label>
        <div className="flex" style={{marginTop: '25px'}}>
          <button className="btn">
            <span>{this.props.formButton}</span>
          </button>
        </div>
      </form>
      <span><i>{this.props.disclaimer}</i></span>
      <br/><br/>
      </div>
      )

      if(this.state.isMobile){
        topOfPage = form
        middle = subHeader
        } else {
        topOfPage = subHeader
        middle = form
      }

      if(this.state.submitted) {
        modal = (
              <div id="thanks" className="modal-wrapper-thanks modal-open-thanks" style={{ 'display' : this.state.submitted ? 'block' : 'none'}}>
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
        )
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
      this.setState({ submitted: false });
    }

    onSubmit(evt) {
        evt.preventDefault();

        const form = evt.target;
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        
        const name = form.name;
        if (!name.value.trim()) {
            name.focus();
            alert('Please enter your name.');
            return;
        }

        const email = form.email;
        if (!email.value.trim()) {
            email.focus();
            alert('Please enter your email.');
            return;
        } else if (!emailRegex.test(email.value.trim())) {
            email.focus();
            alert('Please enter a valid email.');
            return;
        }

        const address1 = form.street;
        if (!address1.value.trim()) {
            address1.focus();
            alert("Please enter your address.");
            return;
        }

        const zip = form.zip;
        if (!zip.value.trim()) {
            zip.focus();
            alert('Please enter your Zipcode.');
            return;
        } else if (zip.value.length < 5 || zip.value.length > 5) {
            zip.focus();
            alert('Please enter a valid Zipcode.');
            return;
        }

        

        const fields = {
            'action_user_agent': navigator.userAgent,
            'country': 'United States',
            'email': email.value.trim(),
            'form_name': 'act-petition',
            'js': 1,
            'name': name.value.trim(),
            'address1': address1.value.trim(),
            'zip': zip.value.trim(),
            'opt_in': 1,
            'page': CONF.actionKitPageShortName,
            'source': this.state.source || 'website',
            'want_progress': 1,
        };

        if(document.getElementById("business").checked){
          const compName = form.company_name
          if (!compName.value.trim()) {
            compName.focus();
            alert('Please enter your company name.');
            return;
          } else {
            fields['action_company_name'] = compName.value.trim()
          }

          const compWebsite = form.company_website
          if (!compWebsite.value.trim()) {
            compWebsite.focus();
            alert('Please enter your company website.');
            return;
          } else {
            fields['action_company_website'] = compWebsite.value.trim()
          }

          const zip = form.company_zipcode;
          if (!zip.value.trim()) {
              zip.focus();
              alert('Please enter your Zipcode.');
              return;
          } else if (zip.value.length < 5 || zip.value.length > 5) {
              zip.focus();
              alert('Please enter a valid Zipcode.');
              return;
          } else {
            fields['action_company_zipcode'] = zip.value.trim()
          }

          const phone = form.company_phone
          if(phone.value.trim() && phone.value.trim().length < 10 || /[a-z]/i.test(phone.value)|| phone.value.trim().length > 14){
            phone.focus();
            console.log(phone.value.trim().length)
            alert('Please enter a valid Phone number.');
            return;
          } else {
            fields['action_company_phone'] = phone.value.trim()
          }
        }
      
        this.sendFormToActionKit(fields);
    }

    clearUserForm(){
      const formFlex = document.getElementById("form").getElementsByClassName("flex")
      const firstRow = formFlex[0].getElementsByClassName("form-input")
      const secondRow = formFlex[1].getElementsByClassName("form-input")
      firstRow[0].value = ''
      firstRow[1].value = ''
      secondRow[0].value = ''
      secondRow[1].value = ''
    }

    clearBusinessForm(){
      const formFlex = document.getElementById("form").getElementsByClassName("flex")
      const thirdRow = formFlex[2].getElementsByClassName("form-input")
      const fourthRow = formFlex[3].getElementsByClassName("form-input")
      thirdRow[0].value = ''
      thirdRow[1].value = ''
      fourthRow[0].value = ''
      fourthRow[1].value = ''
      document.getElementById("business").checked = false
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

        Object.keys(fields).forEach(function(key) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        });

        form.submit()
        this.setState(
          { submitted: true }, 
          () => {
            this.clearUserForm()
            if(document.getElementById("business").checked){
              this.clearBusinessForm()
            }
           });   
    }

}

export default Responsive(Form);