import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchChecks, submitCheckResults } from "./api";

const mockedFetchChecks = fetchChecks as jest.Mocked<any>;
const mockedSubmitCheckResults = submitCheckResults as jest.Mocked<any>;

jest.mock('./api', () => ({
    fetchChecks: jest.fn(),
    submitCheckResults: jest.fn(),
}))

describe('App', () => {
    beforeEach(() => {
        mockedFetchChecks.mockResolvedValue([
            {
                id: 'aaa',
                priority: 10,
                description: 'Face on the picture matches face on the document'
            },
            {
                id: 'bbb',
                priority: 5,
                description: 'Veriff supports presented document'
            },
        ]);
    })

    it('renders App correctly when checks are fetch successfully', async () => {
        const { container } = render(<App />);

        expect(await screen.findByText('Veriff supports presented document')).toBeInTheDocument();
        expect(await screen.findByText('Face on the picture matches face on the document')).toBeInTheDocument();
        expect(await screen.findByText('Submit', { exact: true})).toBeDisabled();
        
        expect(container).toMatchSnapshot();
    });

    it('renders Error view when unable to fetch checks', async () => {
        mockedFetchChecks.mockRejectedValue({ success: false });
        const { container } = render(<App />);

        expect(await screen.findByText('Whoops! Something went wrong...')).toBeInTheDocument();        
        expect(container).toMatchSnapshot();
    });

    it('renders App correctly when user makes a selection', async () => {
        const { container } = render(<App />);

        const buttons = await screen.findAllByRole('button');

        // user clicks first ListItem button YES
        userEvent.click(buttons[0]);

        expect(container).toMatchSnapshot();
        expect(await screen.findByText('Submit', { exact: true})).toHaveAttribute('disabled');
        expect(buttons[0]).toHaveClass('activeButton');
        expect(buttons[1]).not.toHaveClass('activeButton');

        // user clicks first ListItem button NO
        userEvent.click(buttons[1]);

        expect(buttons[1]).toHaveClass('activeButton');
        expect(buttons[0]).not.toHaveClass('activeButton');
        expect(await screen.findByText('Submit', { exact: true})).not.toHaveAttribute('disabled');
    });

    it('sends submit data when user clicks Submit button and renders success view', async () => {
        const { container } = render(<App />);

        const buttons = await screen.findAllByRole('button');

        // user clicks first ListItem button NO
        userEvent.click(buttons[1]);
        // user clicks Submit button
        userEvent.click(buttons[4]);

        expect(await screen.findByText('Submit', { exact: true})).toBeEnabled();
        expect(mockedSubmitCheckResults).toHaveBeenCalledTimes(1);
        expect(mockedSubmitCheckResults).toHaveBeenCalledWith([
            {
                checkId: 'bbb',
                value: 'no',
            },
            {
                checkId: 'aaa',
                value: 'not selected',
            },
        ]);

        expect(container).toMatchSnapshot();
        expect(await screen.findByText('Great success!')).toBeInTheDocument();
    });

    it('renders App correctly when user navigates with keyboard', async () => {
        const { container } = render(<App />);

        const buttons = await screen.findAllByRole('button');
        const listItems = await screen.findAllByTestId('list-item')

        // user selects first listItem
        userEvent.keyboard('[ArrowDown]');

        // first listItem becomes active, second is still disabled
        expect(listItems[0]).toHaveClass('item--active');
        expect(listItems[1]).toHaveClass('item--disabled');

        // user uses right arrow key, nothing changes
        userEvent.keyboard('[ArrowRight]');

        expect(listItems[0]).toHaveClass('item--active');
        expect(listItems[1]).toHaveClass('item--disabled');

        // user selects first listItem button YES
        userEvent.keyboard('[Digit1]');

        expect(buttons[0]).toHaveClass('activeButton');
        //second listItem is not disabled anymore
        expect(listItems[1]).not.toHaveClass('item--disabled');
        // submit button is still disabled
        expect(buttons[4]).toBeDisabled();
        expect(container).toMatchSnapshot();

        // user selects second listItem
        userEvent.keyboard('[ArrowDown]');

        // second listItem becomes active, first listItem will not be active anymore
        expect(listItems[1]).toHaveClass('item--active');
        expect(listItems[0]).not.toHaveClass('item--active');

        // user selects again first listItem
        userEvent.keyboard('[ArrowUp]');

        // first listItem becomes active, second listItem will not be active anymore
        expect(listItems[0]).toHaveClass('item--active');
        expect(listItems[1]).not.toHaveClass('item--active');

        // user selects again second listItem
        userEvent.keyboard('[ArrowDown]');
        // user selects second listItem button NO
        userEvent.keyboard('[Digit2]');

        expect(buttons[3]).toHaveClass('activeButton');
        // submit button will now be enabled
        expect(buttons[4]).toBeEnabled();
    });

    it('renders Error view when sumbit fails', async () => {
        mockedSubmitCheckResults.mockRejectedValue({ success: false });

        const { container } = render(<App />);
        const buttons = await screen.findAllByRole('button');

        expect(await screen.findByText('Submit', { exact: true})).toBeDisabled();

        userEvent.click(buttons[1]);
        userEvent.click(buttons[4]);
        
        expect(await screen.findByText('Submit', { exact: true})).toBeEnabled();
        expect(container).toMatchSnapshot();
        expect(await screen.findByText('Whoops! Something went wrong...')).toBeInTheDocument();
    });
})