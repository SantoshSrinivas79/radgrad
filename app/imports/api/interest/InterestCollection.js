import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module api/interest/InterestCollection */

/**
 * Represents a specific interest, such as "Software Engineering".
 * Note that all Interests must have an associated InterestType.
 * @extends module:api/base/BaseInstanceCollection~BaseInstanceCollection
 */
class InterestCollection extends BaseInstanceCollection {

  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Interest', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      interestTypeID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Defines a new Interest and its associated Slug.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    slug: 'software-engineering',
   *                    description: 'Methods for group development of large, high quality software systems',
   *                    interestType: 'cs-disciplines' });
   * @param { Object } description Object with keys name, slug, description, interestType.
   * Slug must be previously undefined.
   * InterestType must be an InterestType slug or ID.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  define({ name, slug, description, interestType }) {
    // Get InterestTypeID, throw error if not found.
    const interestTypeID = InterestTypes.getID(interestType);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the Interest and get its ID
    const interestID = this._collection.insert({ name, description, slugID, interestTypeID });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, interestID);
    return interestID;
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param instanceIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(instanceIDs) {
    return instanceIDs.map(instanceID => this.findDoc(instanceID).name);
  }

  getSlug(interestID) {
    this.assertDefined(interestID);
    const courseDoc = this.findDoc(interestID);
    return Slugs.findDoc(courseDoc.slugID).name;
  }


  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID and interestTypeID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!InterestTypes.isDefined(doc.interestTypeID)) {
        problems.push(`Bad interestTypeID: ${doc.interestTypeID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the Interest docID in a format acceptable to define().
   * @param docID The docID of an Interest.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const description = doc.description;
    const interestType = InterestTypes.findSlugByID(doc.interestTypeID);
    return { name, slug, description, interestType };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Interests = new InterestCollection();
radgradCollections.push(Interests);
