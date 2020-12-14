import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { makeTheme } from './theme';

const ThemedPaperProvider = ({ primary, accent, children, ...rest }) => {
    const theme = makeTheme({ primary, accent });

    return (
        <PaperProvider theme={theme} {...rest}>
            {children}
        </PaperProvider>
    );
};

ThemedPaperProvider.propTypes = {
    primary: PropTypes.object,
    accent: PropTypes.object,
    children: PropTypes.node,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(ThemedPaperProvider);
