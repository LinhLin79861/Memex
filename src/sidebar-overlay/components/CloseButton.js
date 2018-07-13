import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import styles from './CloseButton.css'

const CloseButton = ({ isActive, isOverview, clickHandler }) => (
    <div
        className={cx({
            [styles.close]: isActive,
            [styles.hidden]: !isActive,
            [styles.overview]: isOverview,
        })}
        onClick={clickHandler}
    >
        X
    </div>
)

CloseButton.propTypes = {
    isActive: PropTypes.bool.isRequired,
    isOverview: PropTypes.bool,
    clickHandler: PropTypes.func.isRequired,
}

export default CloseButton
