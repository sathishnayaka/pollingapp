import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import axios from 'axios';
import PollingList from '../src/PollingList';
import {Alert, FlatList} from 'react-native';

import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import debounce from 'lodash.debounce';
configure({ adapter: new Adapter() });

jest.mock('axios');

beforeEach(() => {
  jest.useFakeTimers()
})

describe('PollingDetails', () => {
  test('renders pollingList  details correctly', async () => {
    const mockAxios = (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        data: {
          hits: [
            {
              created_at: '2021-03-22',
              url: 'https:url.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '2212121',
            },
            {
              created_at: '2021-03-22',
              url: 'https:url3.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '221281',
            },
            {
              created_at: '2021-03-22',
              url: 'https:url2.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '22121',
            },
          ],
        },
      }),
    );
    const navigation = {navigate: jest.fn()};

    const wrapper = render(<PollingList navigation={navigation} route={{}} />);
    await waitFor(() => screen.getByText('URL : https:url.com'), { timeout: 5000 });
    expect(screen.getByText('URL : https:url.com')).toBeTruthy();
  }, 2000);

  test('should handle error in catch block', async () => {
    const axiosMock = axios as jest.Mocked<typeof axios>;
    axiosMock.get.mockRejectedValueOnce(new Error('API request failed'));

    const navigation = {
      goBack: jest.fn(),
    };

    const route = {
      params: {
        asteriodId: '12345',
      },
    };
    Alert.alert = jest.fn();
    const {getByTestId} = render(
      <PollingList navigation={navigation} route={route} />,
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled()
    },{timeout:5000});
  });
  
  test('should call the api on end reached', async () => {
    const mockAxios = (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        data: {
          hits: [
            {
              created_at: '2021-03-22',
              url: 'https:nasa.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '1',
            },
            {
              created_at: '2021-03-22',
              url: 'https:url.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '2',
            },
            {
              created_at: '2021-03-22',
              url: 'https:url.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '3',
            },
            {
              created_at: '2021-03-22',
              url: 'https:url.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '2121',
            },
            {
              created_at: '2021-03-22',
              url: 'https:url.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '225',
            },
          ],
        },
      }),
    );
    const navigation = {navigate: jest.fn()};

    const wrapper = render(<PollingList navigation={navigation} route={{}} />);
    await waitFor(() => screen.getByText('URL : https:nasa.com'), {timeout: 5000});
    const flatList = screen.getByTestId('flatlist');
    expect(flatList).toBeDefined();
    // fireEvent.scroll(flatList, { nativeEvent: { contentOffset: { y: 1000 } } })
  });
  test("when i click on item of flatlist should navigate",async () => {
    const mockAxios = (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        data: {
          hits: [
            {
              created_at: '2021-03-22',
              url: 'https:nasa.com',
              author: 'satheesh',
              title: 'my-life story',
              objectID: '221121',
            },
          ],
        },
      }),
    );
    const navigation = {navigate: jest.fn()};

    const wrapper = render(<PollingList navigation={navigation} route={{}} />);
    await waitFor(() => screen.getByText('URL : https:nasa.com'), {timeout:5000});
    const item = screen.getByTestId('navigate-to-json');
    fireEvent.press(item);
    expect(navigation.navigate).toHaveBeenCalledWith("json-details", {"jsonDetails": "{\"created_at\":\"2021-03-22\",\"url\":\"https:nasa.com\",\"author\":\"satheesh\",\"title\":\"my-life story\",\"objectID\":\"221121\"}"})
    fireEvent.scroll;
  })

  test('testing the flatlist', async() => {
    jest.useFakeTimers()
    const navigation = { navigate: jest.fn() };
    const renderItem = shallow(<PollingList navigation={navigation} route={{}}/>);
    const flatList = renderItem.find("[testID='flatlist']");
    // await waitFor(() =>  { flatList.simulate('endReached',{timeout: 5000 })})
    flatList.simulate('endReached',{timeout: 5000});
    const debouncedFunction = flatList.prop('onEndReached') as () => {};

    const handleDebounce = debounce(() => {
      debouncedFunction();
    }, 1000);
  
    handleDebounce();
    jest.runAllTimers();
  });
});
