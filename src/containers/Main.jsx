import React from 'react';
import Form from './Form.jsx';
import Markdown from 'react-markdown';

const Main = (props) =>  {
    return (
    <div id="app">
        <div className="unit">
            <div className="hero" id="bftn-action-form">
                <div>
                    <div id="signThePetition">
                        <Form 
                        subHeader={props.subHeader} 
                        header={ props.header } 
                        ftcComment = { props.ftcComment }
                        main={props.main} 
                        disclaimer={props.disclaimer} 
                        formButton = {props.formButton} 
                        modalHeader = {props.modalHeader}
                        modalText = {props.modalText}/>
                    </div>
                </div>
                <div className="unit" >
                <div id="congress">
                    <Markdown source= {props.congressLanguage} />
                </div>
                <hr/>
                    <div className="more_info">
                    <h4>More Information:</h4>
                    <Markdown source= {props.main} />
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default Main;