import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';

/** @module api/utility/fixture-utilities */

/**
 * The restore/fixture file date format.
 * Used when dumping and restoring the RadGrad database.
 * @type {string}
 */
export const restoreFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the restore file was created. Parses the file name string.
 * @param restoreFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 */
export function getRestoreFileAge(restoreFileName) {
  const terms = _.words(restoreFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, restoreFileDateFormat).fromNow();
}

/**
 * Returns the definition array associated with collectionName in the restoreJSON structure.
 * @param restoreJSON The restore file contents.
 * @param collection The collection of interest.
 */
function getDefinitions(restoreJSON, collection) {
  return _.find(restoreJSON.collections, obj => obj.name === collection).contents;
}

/**
 * Given a collection and the restoreJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be restored.
 * @param restoreJSON The structure containing all of the definitions.
 */
export function restoreCollection(collection, restoreJSON) {
  const definitions = getDefinitions(restoreJSON, collection._collectionName);
  console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`); // eslint-disable-line
  _.each(definitions, definition => collection.define(definition));
}
