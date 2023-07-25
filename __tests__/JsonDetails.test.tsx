import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import axios from 'axios';
import JsonDetails from '../src/JsonDetails';

jest.mock('axios');

describe('JsonDetails', () => {
  test('renders pollingList  details correctly', async () => {
    const navigation = {navigate: jest.fn()};
    const route = {
        params : {
            JsonDetails : "json details"
        }
    }

    const wrapper = render(<JsonDetails navigation={navigation} route={route} />);
    expect(screen.getByTestId('json-test')).toBeTruthy();
  }, 10000);

});
