import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
import store from '@logan/fe-shared/store';
import theme from './theme';

function wrapper({ element }) {
    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DayJsUtils}>
                <Provider store={store}>
                    <CssBaseline />
                    {element}
                </Provider>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
}

export default wrapper;
