import {Tracker} from "meteor/tracker";

export const batchUpdate = (updates) =>
{
    Tracker.nonreactive(() => {updates()});
    Tracker.flush();
};