import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { advisorTitle, facultyTitle, studentTitle, mentorTitle } from '../../../api/admin/AdminUtilities';
import { updateSessionState } from '../../../startup/client/session-state';
import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { AdvisorChoices } from '../../../api/advisor/AdvisorChoiceCollection';
import { Users } from '../../../api/user/UserCollection';


Template.Faculty_Layout.onCreated(function facultyLayoutOnCreated() {
  this.autorun(() => {
    this.subscribe(AdminChoices.getPublicationName());
    this.subscribe(AdvisorChoices.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.Faculty_Layout.onRendered(function facultyLayoutOnRendered() {
  updateSessionState();
});

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.facultyHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
  adminSecondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.adminHomePageRouteName },
      { label: 'CRUD', route: RouteNames.adminCrudPageRouteName },
      { label: advisorTitle(), route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: facultyTitle(), route: RouteNames.facultyHomePageRouteName },
      { label: studentTitle(), route: RouteNames.studentHomePageRouteName },
      { label: mentorTitle(), route: RouteNames.mentorHomePageRouteName },
    ];
  },
  adminSecondMenuLength() {
    return 'six';
  },
});

Template.Faculty_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
