import { Meteor } from 'meteor/meteor';
import { Rooms } from '../rooms.js';

Meteor.publish('rooms.all', function() {
    return Rooms.find();
});