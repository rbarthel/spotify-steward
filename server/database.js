var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] },
    { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

module.exports = {
    findById: (id, cb) => {
        process.nextTick(function() {
            var idx = id - 1;
            if (records[idx]) {
                cb(null, records[idx]);
            } else {
                cb(new Error('User ' + id + ' does not exist'));
            }
        });
    }

    findByUsername: (username, cb) => {
        process.nextTick(function() {
            for (var i = 0, len = records.length; i < len; i++) {
                var record = records[i];
                if (record.username === username) {
                    return cb(null, record);
                }
            }
            return cb(null, null);
        });
    }
}