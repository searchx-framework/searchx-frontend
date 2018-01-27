import React from 'react'
import { shallow, mount, render } from 'enzyme';


import SearchVerticals from '../src/js/components/Search/Header/SearchVerticals';

describe('SearchVerticals',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<SearchVerticals vertical={"web"} changeHandler={function(){}}/>)
    });

    it('should load four tabs', () => {
        expect(wrapper.find(".Search-vertical").length).toEqual(4);
    });
    
});