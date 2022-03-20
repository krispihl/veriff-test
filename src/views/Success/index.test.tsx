import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SuccessView } from './index';

describe('Success', () => {
    it('renders Success view correctly', () => {
        const { container } = render(<SuccessView />);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Great success!', { exact: true})).toBeInTheDocument();
        expect(screen.getByText('Your data was submitted successfully.', { exact: true})).toBeInTheDocument();
    });
})