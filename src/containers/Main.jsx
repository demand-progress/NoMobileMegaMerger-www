import React from 'react';
import Markdown from 'react-markdown';
import Form from './Form.jsx';

const Main = props => (
    <div id="app">
        <div className="unit">
            <div className="hero" id="bftn-action-form">
                <div>
                    <div id="signThePetition">
                        <Form
                        subHeader={ props.subHeader }
                        header={ props.header }
                        fccComment = { props.fccComment }
                        main={ props.main }
                        disclaimer={ props.disclaimer }
                        formButton = { props.formButton }
                        modalHeader = { props.modalHeader }
                        modalText = { props.modalText }/>
                    </div>
                </div>
                <div className="unit" >
                <div id="congress">
                    <Markdown source= { props.congressLanguage } />
                </div>
                <hr/>
                    <div className="more_info">
                    <h4>More Information:</h4>
                    <Markdown source= { props.main } />
                    </div>
                </div>
            </div>
        </div>
    </div>);

export default Main;
