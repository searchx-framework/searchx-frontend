import React from "react";
import PropTypes from 'prop-types';
import Form from "./Form";

class SyncForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        };

        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handleUnload = this.handleUnload.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('unload', this.handleUnload);
        window.addEventListener('popstate', this.handleUnload);
        this.setState({isReady: true});
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('unload', this.handleUnload);
        window.removeEventListener('popstate', this.handleUnload);
        this.handleUnload();
    }

    render() {
        return <Form {...this.props}/>;
    }

    ////

    handleBeforeUnload(e) {
        if (!this.state.isReady) {
            const dialogText = 'Changes you made may not be saved. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    handleUnload() {
        if (!this.state.isReady) {
            this.props.onLeave();
        }
    }
}

SyncForm.propTypes = Object.assign(Form.propTypes, {
    onSync: PropTypes.func.isRequired,
    onLeave: PropTypes.func,
});

SyncForm.defaultProps = Object.assign(Form.defaultProps, {
    onLeave: () => {}
});

export default SyncForm;