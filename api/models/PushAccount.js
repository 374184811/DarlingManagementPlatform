/**
 * PushAccount.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'push_account',
    attributes: {
        id: {type: "integer"},
        name: {type: "string", size: 20},
        avatar: {type: "string", size: 100},
        gid: {type: "integer", size: 11}
    },
    autoCreatedAt:false,
    autoUpdatedAt:false
};

