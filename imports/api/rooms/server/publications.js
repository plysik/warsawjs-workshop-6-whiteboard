import { Meteor } from 'meteor/meteor';
import { Rooms } from '../rooms.js';
import { check } from 'meteor/check';

Meteor.publish('rooms.all', function() {
    return Rooms.find();
});


Meteor.publish('rooms.getById', function(roomId) {
    check(roomId, String);
    return Rooms.find({ _id: roomId });
});