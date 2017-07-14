import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

Template.RadGrad_Login_Buttons.events({

  /**
   * Handle the .cas-login click event.
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .cas-login': function casLogin(event, instance) {
    event.preventDefault();
    const callback = function loginCallback(error) {
      if (error) {
        instance.$('div .ui.error.message.hidden').text('You are not yet registered. Go see your Advisor.');
        instance.$('div .ui.error.message.hidden').removeClass('hidden');
      } else {
        const username = Meteor.user().username;
        const id = Meteor.userId();
        const role = Roles.getRolesForUser(id)[0];
        FlowRouter.go(`/${role.toLowerCase()}/${username}`);
      }
    };
    Meteor.loginWithCas(callback);
    return false;
  },

  /**
   * Handle the .meteor-login click event,
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .meteor-login': function clickOpenModal(event) {
    event.preventDefault();
    $('.ui.modal').modal('show');
  },

  'click .submit-login-button': function clickit (event) {
    event.preventDefault();
    console.log('submit-login-button');
  },

  submit(event) {
    event.preventDefault();
    console.log('after submit', event);
  },
});


// Here's how to do the required initialization for Semantic UI dropdown menus.
Template.RadGrad_Login_Buttons.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    action: 'select',
  });

  this.$('.modal').modal({
    onApprove: function foo(event) {
      console.log('approved', event, event.target);
    },
  });
});
