import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TermsList from './terms/terms-list';
import TermDisplay from './terms/term-display';

const Stack = createStackNavigator();

const ScheduleStack = () => (
    <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Terms" component={TermsList} />
        <Stack.Screen name="Term" component={TermDisplay} />
    </Stack.Navigator>
);

export default ScheduleStack;
