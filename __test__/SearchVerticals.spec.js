import React from 'react'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import config from '../src/js/config';

import SearchVerticals from '../src/js/app/search/header/components/SearchVerticals';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchVerticals',()=>{
    const tests = [
        {provider: 'bing', expected: 4},
        {provider: 'elasticsearch', expected : 1}
    ];

    tests.forEach(function(test) {
        const firstVertical = config.providerVerticals.get(test.provider).keys()[0];
        const wrapper = Enzyme.shallow(<SearchVerticals vertical={firstVertical} changeHandler={function(){}} provider={test.provider}/>);

        it('should load ' + test.expected + ' tabs for the ' + test.provider + ' provider', () => {
            expect(wrapper.find(".search-vertical").length).toEqual(test.expected);
        });
    });

});