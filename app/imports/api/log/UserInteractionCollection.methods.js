import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { UserInteractions } from './UserInteractionCollection';

/**
 * The validated method for defining UserInteractions.
 * @memberOf api/log
 */
export const userInteractionDefineMethod = new ValidatedMethod({
  name: 'UserInteraction.define',
  validate: null,
  mixins: [CallPromiseMixin],
  run(definitionData) {
    UserInteractions.assertValidRoleForMethod(this.userId);
    if (!this.userId) {
      console.log('unauthorized');
      throw new Meteor.Error('unauthorized', 'You must be logged in to define UserInteractions.');
    }
    return UserInteractions.define(definitionData);
  },
});

/**
 * The validated method for removing UserInteractions.
 * @memberOf api/log
 */
export const userInteractionRemoveUserMethod = new ValidatedMethod({
  name: 'UserInteraction.removeUser',
  validate: null,
  mixins: [CallPromiseMixin],
  run(instances) {
    UserInteractions.assertValidRoleForMethod(this.userId);
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove from UserInteractions.');
    }
    return UserInteractions.removeUser(instances);
  },
});