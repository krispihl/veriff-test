import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ListItem } from './index';

describe('ListItem', () => {
    it('renders ListItem component correctly', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: false,
            disabled: false,
        }

        const { container } = render(<ListItem check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Face is clearly visible', { exact: true})).toBeInTheDocument();
        expect(screen.getByText('Yes', { exact: true})).toBeInTheDocument();
        expect(screen.getByText('No', { exact: true})).toBeInTheDocument();
    });

    it('renders active ListItem correctly', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: true,
            disabled: false,
        }
        const { container } = render(<ListItem check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getByTestId('list-item')).toHaveClass('item--active');
    });

    it('renders disabled ListItem correctly', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: false,
            disabled: true,
        }
        const { container } = render(<ListItem check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getByTestId('list-item')).toHaveClass('item--disabled');
    });
})