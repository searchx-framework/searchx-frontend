import React from 'react'
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer'


import SearchVerticals from '../src/js/components/Header/SearchVerticals';

describe('SearchVerticals',()=>{
    let wrapper
     const edX = false

    beforeEach(()=>{
        wrapper = shallow(<SearchVerticals vertical={"web"} changeHandler={function(){}} edX={edX}/>)       
    })

    it('should load four tabs when outside edX', () => {
        expect(wrapper.find(".Search-vertical").length).toEqual(4);
    });

    it('should load five tabs when outside edX', () => {
        wrapper = shallow(<SearchVerticals vertical={"web"} changeHandler={function(){}} edX={!edX}/>)
        expect(wrapper.find(".Search-vertical").length).toEqual(5);
    });
    
});