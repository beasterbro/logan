import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page } from '../shared';
import { fetchAssignments } from '../../store/assignments';
import AssignmentsList from './assignments-list';
import AssignmentEditor from './assignment-editor';
import styles from './assignments-page.module.scss';

export class AssignmentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);

        this.state = {
            selectedAid: undefined,
        };
    }

    componentDidMount() {
        this.props.fetchAssignments();
    }

    didSelectAssignment(aid) {
        this.setState({ selectedAid: aid });
    }
    render() {
        //possible source of error here
        return (
            <Page title="Assignments">
                <div className={styles.assignmentsPage}>
                    <div className={styles.widenMargins}>
                        <AssignmentsList onAssignmentSelected={this.didSelectAssignment} />
                    </div>
                    <AssignmentEditor aid={this.state.selectedAid} />
                </div>
            </Page>
        );
    }
}

AssignmentsPage.propTypes = {
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    deleteAssignment: PropTypes.func,
};

const mapDispatchToProps = { fetchAssignments };

export default connect(null, mapDispatchToProps)(AssignmentsPage);
