import React from 'react';
import cx from 'classnames';
import { ToggleButton } from '../ToggleButton';
import { CheckUpdate } from '../../types'
import styles from './index.module.css';

export const ListItem = ({ check, updateChecks }: CheckUpdate) => {
    return (
        <div data-testid='list-item' className={cx(styles.item, check.active && styles['item--active'], check.disabled && styles['item--disabled'])}>
            <p className={styles.text}>{check.description}</p>
            <ToggleButton check={check} updateChecks={updateChecks} />
        </div>
    );
};
