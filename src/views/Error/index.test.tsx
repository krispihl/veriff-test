import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorView } from './index';

describe('Error', () => {
    const { location } = window;

    beforeAll(() => {
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = { reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('renders Error view correctly', () => {
        const { container } = render(<ErrorView />);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Whoops! Something went wrong...', { exact: true})).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('window reload is called when user clicks try again button', () => {
        render(<ErrorView />);

        const button = screen.getByRole('button');

        userEvent.click(button);

        expect(window.location.reload).toHaveBeenCalled();
    });
})