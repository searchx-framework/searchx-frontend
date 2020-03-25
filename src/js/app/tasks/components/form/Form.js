import './Form.pcss'
import React from "react";
import PropTypes from 'prop-types';
import Alert from "react-s-alert";
import * as Survey from "survey-react/survey.react";
import FormContainer from "./FormContainer";

class Form extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleComplete = this.handleComplete.bind(this);
        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    componentWillUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    render() {
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
        

        let survey = new Survey.Model(this.props.formData);
        survey.completedHtml = `<div class='message'>${survey.completedHtml}</div>`;

        return (
            <FormContainer>
                <div onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste}>
                    <Survey.Survey model={survey} onComplete={this.handleComplete} onValidateQuestion={this.props.formValidation}/>
                </div>
            </FormContainer>
        );
    }

    ////

    handleComplete(res) {
        this.props.onComplete(res.data);
        
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }

    handleCutCopyPaste(e) {
        if (this.props.disableCopy) {
            Alert.warning('You cannot copy and paste in this step.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none",
            });

            e.preventDefault();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
        
            
            this.props.onSwitchPage();
        }
    }
}

Form.propTypes = {
    formData: PropTypes.object.isRequired,
    formValidation: PropTypes.func,
    onComplete: PropTypes.func.isRequired,
    onSwitchPage: PropTypes.func,
    disableCopy: PropTypes.bool,
};

Form.defaultProps = {
    formValidation: () => {},
    onSwitchPage: () => {},
    disableCopy: false,
};

export default Form;