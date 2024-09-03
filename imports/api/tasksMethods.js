import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';

import '/imports/api/tasksMethods';

Meteor.methods({
    'tasks.insert'(text)
    {
        check(text, String);
        if (!this.userId) throw new Meteor.Error('Not authorized.');

        TasksCollection.insert({
            text,
            createdAt: new Date,
            userId: this.userId,
        })
    },

    'tasks.remove'(taskId)
    {
        check(taskId, String);
        if (!this.userId) throw new Meteor.Error('Not authorized.');

        const currentTask = TasksCollection.findOne({_id: taskId, userId: this.userId});
        if(!currentTask) throw new Meteor.Error('Access denied.');

        TasksCollection.remove(taskId);
    },

    'tasks.setIsChecked'(taskId, isChecked)
    {
        check(taskId, String);
        check(isChecked, Boolean);
        if (!this.userId) throw new Meteor.Error('Not authorized.');

        const currentTask = TasksCollection.findOne({_id: taskId, userId: this.userId});
        if(!currentTask) throw new Meteor.Error('Access denied.');

        TasksCollection.update(taskId, {
            $set: {
                isChecked
            }
        });
    }
});