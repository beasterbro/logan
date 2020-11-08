import React from 'react';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { FormLabel, Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { getAssignmentsSelectors, setShouldGoToAssignment } from '../../store/assignments';
import { CourseLabel } from '../shared/displays';
import classes from './assignment-preview.module.scss';

class AssignmentPreview extends React.Component {
    openAssignment() {
        this.props.setShouldGoToAssignment(this.props.aid);
        navigate('/assignments');
    }

    render() {
        const assignment = this.props.getAssignment(this.props.aid);
        const formattedDueDate = dateUtils.readableDueDate(assignment.dueDate);

        return (
            <div>
                <FormLabel style={{ fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                    Related Assignment
                </FormLabel>
                <Card variant="outlined" onClick={this.openAssignment.bind(this)}>
                    <CardActionArea>
                        <CardContent className={classes.contentContainer}>
                            <div className={classes.details}>
                                {assignment.cid && (
                                    <div className="cell-upper-label">
                                        <CourseLabel cid={assignment.cid} />
                                    </div>
                                )}
                                <Typography>{assignment.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Due {formattedDueDate}
                                </Typography>
                            </div>
                            <ExitToAppIcon />
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        );
    }
}

AssignmentPreview.propTypes = {
    aid: PropTypes.string,
    getAssignment: PropTypes.func,
    setShouldGoToAssignment: PropTypes.func,
};

const mapStateToProps = state => ({
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
});

export default connect(mapStateToProps, { setShouldGoToAssignment })(AssignmentPreview);
