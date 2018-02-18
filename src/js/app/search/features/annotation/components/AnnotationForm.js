import React from 'react';

class AnnotationForm extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            value: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.value);
        this.setState({value: ""});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <textarea className="form-control"
                          rows="4"
                          placeholder="Your comment..."
                          value={this.state.value}
                          onChange={this.handleChange}
                          autoComplete={'off'}
                          autoFocus
                />
                <input type="submit" className="btn btn-info" value="Post"/>
            </form>
        )
    }
}

export default AnnotationForm;