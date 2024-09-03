import { Meteor } from 'meteor/meteor';
import { TasksCollection } from "../imports/db/TasksCollection";
import { Accounts } from 'meteor/accounts-base';
import { mockupTasks } from './mockupData/Tasks';

import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() =>
{
    if (!Accounts.findUserByUsername(SEED_USERNAME))
    {
        Accounts.createUser({username: SEED_USERNAME, password: SEED_PASSWORD});
    }

    const user = Accounts.findUserByUsername(SEED_USERNAME);
    TasksCollection.find().count() === 0 && mockupTasks.forEach(text => TasksCollection.insert({
        text,
        userId: user._id,
        createdAt: new Date(),
    }))
});
