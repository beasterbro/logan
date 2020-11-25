import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getScheduleSelectors, updateTerm, updateTermLocal } from '@logan/fe-shared/store/schedule';
import { dateUtils } from '@logan/core';
import Editor from '@logan/fe-shared/components/editor';
import { View } from 'react-native';
import { FAB, List, TextInput } from 'react-native-paper';
import ListItem from '../../shared/list-item';
import Typography, { typographyStyles } from '../../shared/typography';
import DueDateControl from '../../shared/due-date-control';
import CourseCell from './course-cell';

class TermEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'term', mobile: true });

        let term;

        if (this.isEditor) {
            term = props.getTerm(props.route.params.tid);
        } else {
            term = {
                title: '',
                startDate: dateUtils.formatAsDate(),
                endDate: dateUtils.formatAsDate(),
            };
        }

        this.state = { term };
    }

    selectEntity(id) {
        return this.props.getTerm(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTermLocal({ id, changes });
    }

    updateEntity(term) {
        this.props.updateTerm(term);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;
    }

    coursesList() {
        const courses = this.props.getCoursesForTerm(this.state.term);

        return (
            <React.Fragment>
                <List.Subheader style={{ marginTop: 8 }}>Courses</List.Subheader>
                {!courses.length && (
                    <ListItem
                        key="none"
                        leftContent={
                            <Typography color="secondary" style={{ fontStyle: 'italic' }}>
                                None
                            </Typography>
                        }
                    />
                )}
                {courses.map(course => (
                    <CourseCell key={course.cid} course={course} />
                ))}
            </React.Fragment>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    paddingHorizontal: 0,
                                    flexGrow: 1,
                                    backgroundColor: 'none',
                                    ...typographyStyles.h5,
                                }}
                                mode="flat"
                                label="Title"
                                value={this.state.term.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <DueDateControl
                    datesOnly
                    label="Start Date"
                    value={this.state.term.startDate}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DueDateControl
                    datesOnly
                    label="End Date"
                    value={this.state.term.endDate}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
                {this.isEditor && this.coursesList()}
                {this.isEditor && (
                    <FAB
                        icon="plus"
                        color="white"
                        style={{
                            position: 'absolute',
                            bottom: -28,
                            right: 28,
                        }}
                        onPress={() => this.props.navigation.navigate('New Term')}
                    />
                )}
            </View>
        );
    }
}

TermEditor.propTypes = {
    getTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    updateTerm: PropTypes.func,
    updateTermLocal: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        getTerm: selectors.baseSelectors.terms.selectById,
        getCoursesForTerm: selectors.getCoursesForTerm,
        getHolidaysForTerm: selectors.getHolidaysForTerm,
    };
};

const mapDispatchToProps = {
    updateTerm,
    updateTermLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TermEditor);
