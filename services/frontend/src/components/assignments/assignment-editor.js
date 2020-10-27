import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, TextField, Button } from '@material-ui/core';
import {
    deleteAssignment,
    getAssignmentsSelectors,
    updateAssignment,
    updateAssignmentLocal,
} from '../../store/assignments';
import { CoursePicker, DueDatePicker } from '../shared/controls';
import Editor from '../shared/editor';
import SubtasksList from './subtasks-list';
import NewTaskModal from './task-modal';

//Represents a form to submit the info required to create a given assignment
class AssignmentEditor extends Editor {
    constructor(props) {
        super(props, { id: 'aid', entity: 'assignment' });

        this.openNewTaskModal = this.openNewTaskModal.bind(this);
        this.closeNewTaskModal = this.closeNewTaskModal.bind(this);

        this.state = {
            assignment: undefined,
            newTaskModalOpen: false,
        };
    }

    selectEntity(id) {
        return this.props.selectAssignment(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateAssignmentLocal({ id, changes });
    }

    updateEntity(entity) {
        this.props.updateAssignment(entity);
    }

    processChange(changes, prop, e) {
        if (prop === 'dueDate') {
            changes[prop] = e;
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') changes[prop] = undefined;
            else changes[prop] = e.target.value;
        } else {
            changes[prop] = e.target.value;
        }
    }

    openNewTaskModal() {
        this.setState({ newTaskModalOpen: true });
    }

    closeNewTaskModal() {
        this.setState({ newTaskModalOpen: false });
    }

    render() {
        return (
            <div className="editor">
                <div className="scroll-view">
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Title"
                                fullWidth
                                onChange={this.handleChange.bind(this, 'title')}
                                value={_.get(this.state.assignment, 'title', '')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Description"
                                fullWidth
                                onChange={this.handleChange.bind(this, 'description')}
                                value={_.get(this.state.assignment, 'description', '')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <CoursePicker
                                                disabled={this.isEmpty()}
                                                value={_.get(this.state.assignment, 'cid', 'none')}
                                                onChange={this.handleChange.bind(this, 'cid')}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <DueDatePicker
                                                disabled={this.isEmpty()}
                                                entityId={_.get(this.state.assignment, 'aid')}
                                                value={_.get(this.state.assignment, 'dueDate')}
                                                onChange={this.handleChange.bind(this, 'dueDate')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    Subtasks
                                    <SubtasksList aid={this.props.aid} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disableElevation
                                        onClick={this.openNewTaskModal}
                                    >
                                        New subtask
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <NewTaskModal
                    open={this.state.newTaskModalOpen}
                    onClose={this.closeNewTaskModal}
                    aid={this.props.aid}
                />
            </div>
        );
    }
}
AssignmentEditor.propTypes = {
    aid: PropTypes.string,
    updateAssignmentLocal: PropTypes.func,
    selectAssignment: PropTypes.func,
    updateAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal, deleteAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor);
