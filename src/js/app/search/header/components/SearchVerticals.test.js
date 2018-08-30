import React from 'react'
import { shallow, mount, render } from 'enzyme';
import config from '../../../../config';
import SearchVerticals from './SearchVerticals';

describe('SearchVerticals', ()=> {
    const tests = [
        {provider: 'bing', expected: 4},
        {provider: 'elasticsearch', expected : 1}
    ];

    tests.forEach(function(test) {
        const firstVertical = config.providerVerticals[test.provider].keys()[0];
        const wrapper = shallow(<SearchVerticals vertical={firstVertical} changeHandler={function(){}} provider={test.provider}/>);

        it('should load ' + test.expected + ' tabs for the ' + test.provider + ' provider', () => {
            expect(wrapper.find(".search-vertical").length).toEqual(test.expected);
        });
    });
});