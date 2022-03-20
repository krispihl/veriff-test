import React from 'react';
import userEvent from '@testing-library/user-event';
import styles from './index.module.css';

const refreshPage = () => {
    window.location.reload();
};

export const ErrorView = () => {
    return (
        <div className={styles.container}>
            <h2>Whoops! Something went wrong...</h2>
            <div>Please <button onClick={refreshPage}>try again</button> or contact our <a href='https://support.veriff.com/en'>support.</a></div>
        </div>
    );
};
