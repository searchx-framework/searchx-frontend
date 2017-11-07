import React from 'react'
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer'

jest.mock('../src/js/dispatchers/AppDispatcher');
 jest.mock('config');

import SearchResults from '../src/js/components/SearchResults/SearchResults';

describe('SearchResults',()=>{
   
    let wrapper
     const edX = false

    beforeEach(()=>{
            
    })

    it('should show a message if server is down or respond with error', () => {
        
    });

    it('should not show spinner if server is down or respond with error', () => {
        
    });

    it('should not show pagination bar if results less than or equal the minimal for the vertical', () => {
    
    });

    it('should show a message of results not found with query with zero results', () => {
    
    });
    
});