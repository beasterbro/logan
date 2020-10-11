const _ = require('lodash');
const dayjs = require('dayjs');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const requestValidator = require('../utils/request-validator');
const { NotFoundError } = require('../utils/errors');

const DATE_FORMAT = 'M/D/YYYY';

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'title']),
        startDate: dayjs(db.sd, DATE_FORMAT).startOf('day'),
        endDate: dayjs(db.ed, DATE_FORMAT).endOf('day'),
    };
}

function toDbFormat(term) {
    return {
        ..._.pick(term, ['uid', 'tid', 'title']),
        sd: term.startDate.format(DATE_FORMAT),
        ed: term.endDate.format(DATE_FORMAT),
    };
}

async function getTerm(req, res) {
    const requestedTid = req.params.tid;

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.TERMS,
        Key: { tid: requestedTid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new NotFoundError('Term does not exist');
    }
}

async function getTerms(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TERMS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createTerm(req, res) {
    const tid = uuid();

    const term = _.merge({}, req.body, { tid }, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'startDate', 'endDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.TERMS,
        Item: toDbFormat(term),
    });

    res.json(term);
}

async function updateTerm(req, res) {
    const term = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'startDate', 'endDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.TERMS,
        Item: toDbFormat(term),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(term);
}

async function deleteTerm(req, res) {
    const requestedTid = req.params.tid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.TERMS,
        Key: { tid: requestedTid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json({ success: true });
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getTerm,
    getTerms,
    createTerm,
    updateTerm,
    deleteTerm,
};
