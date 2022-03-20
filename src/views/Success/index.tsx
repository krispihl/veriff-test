import React from 'react';
import styles from './index.module.css';

export const SuccessView = () => {
    return (
        <div className={styles.container}>
            <h2>Great success!</h2>
            <p>Your data was submitted successfully.</p>
        </div>
    );
};
