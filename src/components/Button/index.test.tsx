import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
    it('renders Button component correctly', () => {
        const { container } = render(<Button disabled={false} onClick={jest.fn()}>Test</Button>);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Test', { exact: true})).toBeInTheDocument();
    });

    it('renders disabled Button component correctly', () => {
        const { container } = render(<Button disabled={true} onClick={jest.fn()}>Test</Button>);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Test', { exact: true})).toBeDisabled();
    });
})