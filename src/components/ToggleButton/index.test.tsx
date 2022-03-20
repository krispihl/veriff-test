import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ToggleButton } from './index';

describe('ToggleButton', () => {
    it('renders ToggleButton component correctly', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: false,
            disabled: false,
        }

        const { container } = render(<ToggleButton check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Yes', { exact: true})).toBeInTheDocument();
        expect(screen.getByText('No', { exact: true})).toBeInTheDocument();
    });

    it('renders disabled ToggleButton correctly', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: false,
            disabled: true,
        }

        const { container } = render(<ToggleButton check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getAllByRole('button')[0]).toHaveClass('disabled');
        expect(screen.getAllByRole('button')[1]).toHaveClass('disabled');
    });

    it('renders ToggleButton correctly when YES is active button', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: false,
            disabled: false,
            value: 'yes'
        }

        const { container } = render(<ToggleButton check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getAllByRole('button')[0]).toHaveClass('activeButton');
        expect(screen.getAllByRole('button')[1]).not.toHaveClass('activeButton');
    });

    it('renders ToggleButton correctly when NO is active button', () => {
        const testCheck = {
            id: 'ccc',
            priority: 7,
            description: 'Face is clearly visible',
            active: false,
            disabled: false,
            value: 'no'
        }

        const { container } = render(<ToggleButton check={testCheck} updateChecks={jest.fn()} />);

        expect(container).toMatchSnapshot();
        expect(screen.getAllByRole('button')[0]).not.toHaveClass('activeButton');
        expect(screen.getAllByRole('button')[1]).toHaveClass('activeButton');
    });
})