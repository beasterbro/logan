import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { getScheduleSelectors, updateSectionLocal, asyncActions } from '../../store/schedule';
import { getChanges } from './change-processor';

const { dayjs, constants: dateConstants } = dateUtils;

class SectionDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.actuallyMakeUpdates = this.actuallyMakeUpdates.bind(this);
        this.del = this.del.bind(this);

        this.state = {
            entity: this.props.eid ? this.props.getEntity(this.props.eid) : undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.eid !== prevProps.eid) {
            this.setState({
                entity: this.props.getEntity(this.props.eid),
            });
        }
    }

    handleChange(prop, e) {
        const changes = {};

        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(dateConstants.DB_DATE_FORMAT);
        } else if (prop === 'startTime' || prop === 'endTime') {
            changes[prop] = e.format(dateConstants.DB_TIME_FORMAT);
        } else {
            changes[prop] = e.target.value;
        }

        this.setState({
            entity: _.merge({}, this.state.entity, changes),
        });
    }

    actuallyMakeUpdates() {
        const changes = getChanges(this.props.getEntity(this.props.eid), this.state.entity);

        this.props.updateSelfLocal({
            id: this.props.eid,
            changes,
        });

        this.props.updateSelf(this.state.entity);
    }

    del() {
        this.props.deleteSelf(this.props.getEntity(this.props.eid));
    }

    render() {
        const changesExist = !_.isEmpty(getChanges(this.props.getEntity(this.props.eid), this.state.entity));

        return (
            <li>
                <input
                    type="text"
                    placeholder="Title"
                    value={_.get(this.state.entity, 'title', '')}
                    onChange={this.handleChange.bind(this, 'title')}
                />
                <DatePicker
                    variant="inline"
                    label="Start"
                    value={dayjs(_.get(this.state.entity, 'startDate'), dateConstants.DB_DATE_FORMAT)}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DatePicker
                    variant="inline"
                    label="End"
                    value={dayjs(_.get(this.state.entity, 'endDate'), dateConstants.DB_DATE_FORMAT)}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
                <TimePicker
                    variant="inline"
                    label="Start"
                    value={dayjs(_.get(this.state.entity, 'startTime'), dateConstants.DB_TIME_FORMAT)}
                    onChange={this.handleChange.bind(this, 'startTime')}
                />
                <TimePicker
                    variant="inline"
                    label="End"
                    value={dayjs(_.get(this.state.entity, 'endTime'), dateConstants.DB_TIME_FORMAT)}
                    onChange={this.handleChange.bind(this, 'endTime')}
                />
                <button onClick={this.actuallyMakeUpdates} disabled={!changesExist}>
                    Save
                </button>
                <button onClick={this.del}>Delete</button>
            </li>
        );
    }
}

SectionDisplay.propTypes = {
    eid: PropTypes.string,
    getEntity: PropTypes.func,
    updateSelfLocal: PropTypes.func,
    updateSelf: PropTypes.func,
    deleteSelf: PropTypes.func,
};

const mapStateToProps = state => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);
    return {
        getEntity: scheduleSelectors.baseSelectors.sections.selectById,
    };
};

const mapDispatchToProps = {
    updateSelfLocal: updateSectionLocal,
    updateSelf: asyncActions.updateSection,
    deleteSelf: asyncActions.deleteSection,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionDisplay);
