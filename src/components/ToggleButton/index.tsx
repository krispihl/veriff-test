import React from 'react';
import cx from 'classnames';
import { CheckUpdate } from '../../types'
import styles from './index.module.css';

export const ToggleButton = ({ check, updateChecks }: CheckUpdate) => {
    const handleClick = (e: React.MouseEvent, value: string) => {
        e.preventDefault();
        (e.target as HTMLButtonElement).blur(); // remove focus because selection can also continue with keypress event
        updateChecks(value, check.id);
    };

    return (
        <div>
            <button
                className={cx(styles.leftButton, check.value === 'yes' && styles.activeButton, check.disabled && styles.disabled)}
                onClick={(e) => handleClick(e, 'yes')}
            >
                Yes
            </button>
            <button
                className={cx(styles.rightButton, check.value === 'no' && styles.activeButton, check.disabled && styles.disabled)}
                onClick={(e) => handleClick(e, 'no')}
            >
                No
            </button>
        </div>
    );
};
