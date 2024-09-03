import { Template } from 'meteor/templating';
import { TasksCollection } from "../db/TasksCollection";
import { ReactiveDict } from 'meteor/reactive-dict';

import './App.html';
import './Task.js';
import "./Login.js";


const HIDE_COMPLETED_STRING = "hideCompleted";
const IS_LOADING_STRING = "isLoading";

const getUser = () => Meteor.user();
const getTasksFilter = () =>
{
    const user = getUser();

    const hideCompletedFilter = { isChecked: { $ne: true } };
    const userFilter = user ? { userId: user._id } : {};
    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    return { userFilter, pendingOnlyFilter };
}

Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
    const handler = Meteor.subscribe('tasks');

    Tracker.autorun(() => {
        this.state.set(IS_LOADING_STRING, !handler.ready());
    });

});

Template.mainContainer.helpers({
    isLoading()
    {
      return Template.instance().state.get(IS_LOADING_STRING);
    },
    isUserLogged()
    {
        return !!getUser();
    },
    getUser()
    {
        return getUser();
    },
    tasks()
    {
        if(!getUser()) return [];
        const {userFilter, pendingOnlyFilter} = getTasksFilter();
        const hideCompleted = !!Template.instance().state.get(HIDE_COMPLETED_STRING);
        const requestFilter = hideCompleted ? pendingOnlyFilter : userFilter;
        return TasksCollection.find(requestFilter);
    },
    pendingTasksCount()
    {
        if(!getUser()) return '';
        const {pendingOnlyFilter} = getTasksFilter();
        const incompleteTasksCount =  TasksCollection.find(pendingOnlyFilter).count();
        return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
    },
    hideCompleted()
    {
        return Template.instance().state.get(HIDE_COMPLETED_STRING);
    }
});

Template.mainContainer.events({
    "click #hide-completed-button"(event, instance)
    {
        const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
        instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
    },
    'click .user'()
    {
        Meteor.logout();
    }
});

Template.form.events({
    "submit .task-form"(e)
    {
        e.preventDefault();
        const {_id: userId} = getUser();
        const {target} = event;
        const text = target.text.value;
        Meteor.call('tasks.insert', text);
        target.text.value = '';
    }
})