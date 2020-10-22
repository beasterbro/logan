import React from 'react';
import { connect } from 'react-redux';
import { Page } from '../shared';
import { getScheduleSelectors, asyncActions as asyncScheduleActions } from '../../store/schedule';
import TermsList from './terms-list';
import TermChildrenList from './term-children-list';
import SectionsList from './sections-list';
import TermEditor from './term-editor';
import CourseEditor from './course-editor';
import styles from './schedule-page.module.scss';

class SchedulePage extends React.Component {
    constructor(props) {
        super(props);

        this.onTermSelected = this.onTermSelected.bind(this);
        this.onCourseSelected = this.onCourseSelected.bind(this);
        this.onHolidaySelected = this.onHolidaySelected.bind(this);
        this.onSectionSelected = this.onSectionSelected.bind(this);

        this.state = {
            selectedTid: undefined,
            selectedCid: undefined,
            selectedHid: undefined,
        };
    }

    onTermSelected(tid) {
        this.setState({
            selectedTid: tid,
            selectedCid: undefined,
            selectedHid: undefined,
            selectedSid: undefined,
        });
    }

    onCourseSelected(cid) {
        this.setState({
            selectedCid: cid,
            selectedHid: undefined,
            selectedSid: undefined,
        });
    }

    onHolidaySelected(hid) {
        this.setState({
            selectedCid: undefined,
            selectedHid: hid,
            selectedSid: undefined,
        });
    }

    onSectionSelected(sid) {
        this.setState({
            selectedSid: sid,
        });
    }

    editorToDisplay() {
        if (!this.state.selectedCid && !this.state.selectedHid) {
            return <TermEditor tid={this.state.selectedTid} />;
        } else if (this.state.selectedCid) {
            return <CourseEditor cid={this.state.selectedCid} />;
        }
    }

    render() {
        return (
            <Page title="Schedule">
                <div className={styles.schedulePage}>
                    <div className={styles.list}>
                        <TermsList onTermSelected={this.onTermSelected} />
                    </div>
                    {this.state.selectedTid && (
                        <div className={styles.list}>
                            <TermChildrenList
                                tid={this.state.selectedTid}
                                selectedId={this.state.selectedCid || this.state.selectedHid}
                                onCourseSelected={this.onCourseSelected}
                                onHolidaySelected={this.onHolidaySelected}
                            />
                        </div>
                    )}
                    {this.state.selectedCid && (
                        <div className={styles.list}>
                            <SectionsList cid={this.state.selectedCid} onSectionSelected={this.onSectionSelected} />
                        </div>
                    )}
                    {this.editorToDisplay()}
                </div>
            </Page>
        );
    }
}

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        tids: selectors.baseSelectors.terms.selectIds(),
    };
};

const mapDispatchToProps = {
    ...asyncScheduleActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
