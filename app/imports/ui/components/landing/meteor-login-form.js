import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

Template.Meteor_Login_Form.events({

  submit(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.log('error during login');
        console.log(error);
      } else {
        $('.ui.modal').modal('hide');
        const username = Meteor.user('username').username;
        const id = Meteor.userId();
        let role = Roles.getRolesForUser(id)[0];
        const studentp = role.toLowerCase() === 'student';
        if (studentp) {
          const profile = Users.findProfileFromUsername(username);
          if (profile.isAlumni) {
            role = 'Alumni';
          }
        }
        FlowRouter.go(`/${role.toLowerCase()}/${username}/home`);
        
      }
    });
  },

  'click .cancel-login-form': function cancel(event) {
    event.preventDefault();
    $('.ui.modal').modal('hide');
  },

});
