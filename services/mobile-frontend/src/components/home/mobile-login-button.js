import React from 'react';
import { Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Google from 'expo-google-app-auth';
import { connect } from 'react-redux';
import { LOGIN_STAGE, setLoginStage, verifyIdToken } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';

const ANDROID_CLIENT_ID = '850674143860-73rdeqg9n24do0on8ghbklcpgjft1c7v.apps.googleusercontent.com';
const IOS_CLIENT_ID = '850674143860-mqhkuritdvkmiq53h9963rjmn5gamsgb.apps.googleusercontent.com';
const CLIENT_ID = Platform.OS === 'ios' ? IOS_CLIENT_ID : ANDROID_CLIENT_ID;
const DEVICE = Platform.OS === 'ios' ? 'ios' : 'android';
const config = { clientId: CLIENT_ID };

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);

        //this.state = { accessToken: '' };
    }

    async signIn() {
        const { type, accessToken, idToken } = await Google.logInAsync(config);
        if (type === 'success') {
            //this.setState({ accessToken: accessToken });
            await this.props.verifyIdToken({ idToken: idToken, clientType: DEVICE });
        }
    }

    async signOut() {
        //await Google.logOutAsync({ accessToken: this.state.accessToken, ...config });
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
    }

    render() {
        if (this.props.isLoggedIn) {
            return <Button onPress={this.signOut}>Logout</Button>;
        } else {
            return <Button onPress={this.signIn}>Login with Google</Button>;
        }
    }
}

MobileLoginButton.propTypes = {
    isLoggedIn: PropTypes.bool,
    setLoginStage: PropTypes.func,
    verifyIdToken: PropTypes.func,
};

/*
This is from react-redux
When the state gets updated, so do the props
 */
const mapStateToProps = state => ({
    isLoggedIn: state.login.isLoggedIn,
});

/*
When we update the props, dispatch to the state
 */
const mapDispatchToProps = {
    setLoginStage,
    verifyIdToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileLoginButton);
