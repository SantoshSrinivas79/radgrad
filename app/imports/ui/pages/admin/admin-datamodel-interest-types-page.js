import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_Interest_Types_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_Interest_Types_Page.onCreated(function onCreated() {
  this.updateID = new ReactiveVar('');
});

