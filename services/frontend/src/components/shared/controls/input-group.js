import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../typography';
import styles from './input-group.module.scss';

/**
 * Displays a fancy input with an optional detail label above, and an optional accessory view to the left. Pass
 * emptyAccessory to keep left padding with no accessory view or icon.
 */
// eslint-disable-next-line react/display-name
const InputGroup = React.forwardRef(
    ({ style, color, accessory, icon, emptyAccessory = false, label, content, className, ...rest }, ref) => {
        const hasAccessory = emptyAccessory || accessory || icon;
        let accessoryContent = accessory;

        if (icon) {
            const IconComponent = icon;
            accessoryContent = <IconComponent style={{ fontSize: 22, color: color || '#646464' }} />;
        }

        const classNames = [styles.inputGroup];

        if (className) classNames.push(className);

        return (
            <table style={style} className={classNames.join(' ')} ref={ref} {...rest}>
                <tbody>
                    {label && (
                        <tr>
                            {hasAccessory && <td />}
                            <td style={{ width: '100%' }}>
                                <Typography style={{ userSelect: 'none' }} variant="detail-label">
                                    {label}
                                </Typography>
                            </td>
                        </tr>
                    )}
                    <tr>
                        {hasAccessory && (
                            <td>
                                <div className={styles.accessory}>{accessoryContent}</div>
                            </td>
                        )}
                        <td style={{ width: '100%' }}>{content}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
);

InputGroup.propTypes = {
    style: PropTypes.object,
    accessory: PropTypes.node,
    emptyAccessory: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    content: PropTypes.node,
    icon: PropTypes.elementType,
    color: PropTypes.string,
    className: PropTypes.string,
};

export default InputGroup;