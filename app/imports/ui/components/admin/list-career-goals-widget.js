import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.List_Career_Goals_Widget.onCreated(function listCareerGoalsWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

Template.List_Career_Goals_Widget.helpers({
  careerGoals() {
    return CareerGoals.find();
  },
  careerGoalsCount() {
    return CareerGoals.count();
  },
  getInterestNames(interestIDs) {
    return Interests.findNames(interestIDs);
  },
  getSlugName(slugID) {
    return Slugs.findDoc(slugID).name;
  }
});
