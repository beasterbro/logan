import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Select, ListSubheader, MenuItem } from '@material-ui/core';
import { getScheduleSelectors } from '../../../store/schedule';

class CoursePicker extends React.Component {
    render() {
        let derivedValue = this.props.value;

        if (this.props.value !== 'none' && !this.props.allCids.includes(this.props.value)) {
            derivedValue = undefined;
        }

        const terms = this.props.tids.map(tid => {
            const term = { ...this.props.getTerm(tid) };
            term.courses = this.props.getCoursesForTerm(term);
            return term;
        });

        const items = [];
        items.push(
            <MenuItem key="none" value="none">
                None
            </MenuItem>
        );

        for (const term of terms.filter(term => term.courses.length)) {
            items.push(<ListSubheader key={term.tid}>{term.title}</ListSubheader>);
            for (const course of term.courses) {
                items.push(
                    <MenuItem key={course.cid} value={course.cid} style={{ color: course.color }}>
                        {course.nickname || course.title}
                    </MenuItem>
                );
            }
        }

        return (
            <Select value={derivedValue} onChange={this.props.onChange}>
                {items}
            </Select>
        );
    }
}

CoursePicker.propTypes = {
    tids: PropTypes.array,
    getTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    allCids: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

CoursePicker.defaultProps = {
    tids: [],
    value: 'none',
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        tids: selectors.baseSelectors.terms.selectIds(),
        getTerm: selectors.baseSelectors.terms.selectById,
        getCoursesForTerm: selectors.getCoursesForTerm,
        allCids: selectors.baseSelectors.courses.selectIds(),
    };
};

export default connect(mapStateToProps, null)(CoursePicker);
