import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button } from '@material-ui/core';
import { DueDatePicker, PriorityPicker } from '../shared/controls';
import { createTask } from '../../store/tasks';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class NewTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.createTask = this.createTask.bind(this);

        this.state = {
            task: {
                title: 'New subtask',
                dueDate: dayjs().format(DB_DATE_FORMAT),
                priority: 0,
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        }
    }

    componentWillOpen() {
        this.setState({
            task: {
                aid: this.props.aid,
                title: 'New subtask',
                dueDate: dayjs().format(DB_DATE_FORMAT),
                priority: 0,
            },
        });
    }

    close() {
        this.props.onClose();
    }

    async createTask() {
        await this.props.createTask(this.state.task);
        this.props.onClose();
    }

    handleChange(prop, e) {
        const task = this.state.task;

        if (prop === 'dueDate') {
            task[prop] = e;
        } else {
            task[prop] = e.target.value;
        }

        this.setState({ task });
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <DialogTitle>New Subtask</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                onChange={this.handleChange.bind(this, 'title')}
                                value={_.get(this.state.task, 'title')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                multiline
                                onChange={this.handleChange.bind(this, 'description')}
                                value={_.get(this.state.task, 'description')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2} style={{ marginTop: 4 }}>
                                <Grid item xs={6}>
                                    <DueDatePicker
                                        entityId={this.props.aid}
                                        value={_.get(this.state.task, 'dueDate')}
                                        onChange={this.handleChange.bind(this, 'dueDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <PriorityPicker
                                        value={_.get(this.state.task, 'priority')}
                                        onChange={this.handleChange.bind(this, 'priority')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.close} disableElevation>
                        Cancel
                    </Button>
                    <Button onClick={this.createTask} variant="contained" color="primary" disableElevation>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

NewTaskModal.propTypes = {
    aid: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    createTask: PropTypes.func,
};

export default connect(null, { createTask })(NewTaskModal);
