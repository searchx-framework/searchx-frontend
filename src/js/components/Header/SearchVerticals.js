import React from 'react';

export default class SearchVerticals extends React.Component {

    render () {
        let verticals_list = [ 'Web', 'Images', 'Videos','News','Forums'];

        if (!this.props.edX) {
            verticals_list = [ 'Web', 'Images', 'Videos','News'];
        }
        
        let verticals = verticals_list.map((vertical, index) => {
            let cn = 'Search-vertical';
            
            
            if (vertical.toLocaleLowerCase() === this.props.vertical) {
                cn += ' Search-vertical--active';
            }
            return (
                <li key={index} className={cn} onClick={this.props.changeHandler.bind(this, vertical)}>
                    {vertical == "Forums" ? "Course discussion" : vertical}
                </li>
            )
        });

        return (
            <div className="row Search-verticals" data-intro="You can also search within the edX discussion forum." data-set="step2" >
                <div className="col-xs-12">
                    <ul>
                        {verticals}
                    </ul>
                </div>
            </div>
        )
    }
}