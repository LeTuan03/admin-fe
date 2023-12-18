import React from 'react';
import styles from './notFound.module.scss';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>404</h1>
            <p>Oops! Something is wrong.</p>
        </div>
    )
}

export default NotFound;