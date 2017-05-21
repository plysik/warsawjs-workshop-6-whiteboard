import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Rooms } from './rooms.js';



Meteor.methods({
    'rooms.insert' (title) {
        check(title, String);

        return Rooms.insert({
            title,
            createdAd: new Date(),
        });
    },
    'rooms.removeById' (roomId) {
        check(roomId, String);
        Rooms.remove(roomId);
    }
})