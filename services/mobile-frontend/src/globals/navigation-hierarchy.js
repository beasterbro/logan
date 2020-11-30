import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LOGIN_STAGE } from '@logan/fe-shared/store/login';
import TasksScreen from '../components/tasks/tasks-screen';
import AssignmentsScreen from '../components/assignments/assignments-screen';
import ScheduleStack from '../components/schedule/schedule-stack';
import NewTaskModalStack from '../components/tasks/new-task-modal-stack';
import NewAssignmentModalStack from '../components/assignments/new-assignment-modal-stack';
import NewTermModal from '../components/schedule/terms/new-term-modal';
import NewCourseModal from '../components/schedule/courses/new-course-modal';
import NewHolidayModal from '../components/schedule/holidays/new-holiday-modal';
import Home from '../components/home/home';
import SignUpForm from '../components/home/signup-form';
import OverviewScreen from '../components/overview/overview-screen';
import LoginTutorial from '../components/tutorial/login-tutorial';
import OverviewTutorial from '../components/tutorial/overview-tutorial';
import SchedulerTutorial from '../components/tutorial/scheduler-tutorial';
import AssignmentTutorial from '../components/tutorial/assignment-tutorial';
import TasksTutorial from '../components/tutorial/tasks-tutorial';
import NewSectionModal from '../components/schedule/sections/new-section-modal';
import SettingsScreen from '../components/settings/settings-screen';
import ReminderDisplay from '../components/reminders/reminder-display';
import NewReminderModal from '../components/reminders/new-reminder-modal';

const RootStack = createStackNavigator();
const BottomTabs = createMaterialBottomTabNavigator();

const routes = [
    {
        name: 'Overview',
        icon: 'home',
        component: OverviewScreen,
    },
    {
        name: 'Tasks',
        icon: 'check-box',
        component: TasksScreen,
    },
    {
        name: 'Assignments',
        icon: 'assignment',
        component: AssignmentsScreen,
    },
    {
        name: 'Schedule',
        icon: 'today',
        component: ScheduleStack,
    },
];

class NavigationHierarchy extends React.Component {
    tabs() {
        return (
            <BottomTabs.Navigator
                initialRouteName="Overview"
                activeColor="teal"
                barStyle={{ backgroundColor: 'white' }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        const iconName = _.find(routes, navigationRoute => navigationRoute.name === route.name).icon;
                        return <Icon name={iconName} size={22} color={color} />;
                    },
                })}
            >
                {routes.map(({ name, component }) => (
                    <BottomTabs.Screen key={name} name={name} component={component} />
                ))}
            </BottomTabs.Navigator>
        );
    }

    render() {
        return (
            <RootStack.Navigator mode="modal" headerMode="screen" screenOptions={{ headerShown: false }}>
                {this.props.loginStage === LOGIN_STAGE.DONE ? (
                    <React.Fragment>
                        <RootStack.Screen name="Root" component={this.tabs} />
                        <RootStack.Screen name="New Task" component={NewTaskModalStack} />
                        <RootStack.Screen name="New Assignment" component={NewAssignmentModalStack} />
                        <RootStack.Screen name="New Term" component={NewTermModal} />
                        <RootStack.Screen name="New Course" component={NewCourseModal} />
                        <RootStack.Screen name="New Holiday" component={NewHolidayModal} />
                        <RootStack.Screen name="New Section" component={NewSectionModal} />
                        <RootStack.Screen name="New Reminder" component={NewReminderModal} />
                        <RootStack.Screen name="Edit Reminder" component={ReminderDisplay} />
                        <RootStack.Screen name="Settings" component={SettingsScreen} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <RootStack.Screen name="Home" component={Home} />
                        <RootStack.Screen name="Signup" component={SignUpForm} />
                    </React.Fragment>
                )}
                <RootStack.Screen name="Tutorial Root" component={LoginTutorial} />
                <RootStack.Screen name="Overview Tutorial" component={OverviewTutorial} />
                <RootStack.Screen name="Scheduler Tutorial" component={SchedulerTutorial} />
                <RootStack.Screen name="Assignment Tutorial" component={AssignmentTutorial} />
                <RootStack.Screen name="Task Tutorial" component={TasksTutorial} />
            </RootStack.Navigator>
        );
    }
}

NavigationHierarchy.propTypes = {
    loginStage: PropTypes.string,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
});

export default connect(mapStateToProps, null)(NavigationHierarchy);
