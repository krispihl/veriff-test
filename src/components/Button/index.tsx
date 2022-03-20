import React from 'react';
import styles from './index.module.css'

type Props = {
  children: React.ReactNode,
  disabled: boolean,
  onClick: () => void,
}

export const Button = ({ children, disabled, onClick }: Props) => {
  return (
    <button className={styles.button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
