import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '../../store/assignments';
import { getScheduleSelectors } from '../../store/schedule';
import { CourseLabel } from '../shared';

export class AssignmentCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.deleted = this.deleted.bind(this);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }

    select() {
        this.props.onSelect(this.props.aid);
    }

    deleted() {
        this.props.onDelete(this.state.assignment);
    }

    componentDidUpdate() {
        const storeAssignment = this.props.selectAssignmentFromStore(this.props.aid);

        if (!_.isEqual(storeAssignment, this.state.assignment)) {
            this.setState({ assignment: storeAssignment });
        }
    }

    render() {
        const course = this.props.getCourse(_.get(this.state.assignment, 'cid'));

        return (
            <div className="list-cell">
                <ListItem button selected={this.props.selected} onClick={this.select}>
                    <ListItemText
                        primary={
                            <React.Fragment>
                                {course && (
                                    <div className="cell-upper-label">
                                        <CourseLabel cid={course.cid} />
                                    </div>
                                )}
                                <div>{_.get(this.state, 'assignment.title')}</div>
                            </React.Fragment>
                        }
                        secondary={_.get(this.state, 'assignment.description')}
                    />
                    <ListItemSecondaryAction className="actions">
                        <IconButton edge="end" onClick={this.deleted}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    }
}
AssignmentCell.propTypes = {
    aid: PropTypes.string,
    updateAssignmentLocal: PropTypes.func,
    selectAssignmentFromStore: PropTypes.func,
    getCourse: PropTypes.func,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectAssignmentFromStore: getAssignmentsSelectors(state.assignments).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCell);