import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { opportunitySemesters } from '../../utilities/template-helpers';

Template.Semester_Add.helpers({
  itemName(item) {
    return item.name;
  },
  itemSemesters() {
    let ret = [];
    if (this.type === 'courses') {
      // do nothing
    } else {
      ret = opportunitySemesters(this.item);
    }
    return ret.slice(0, 8);
  },
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  nextYears(amount) {
    const nextYears = [];
    const currentSem = Semesters.getCurrentSemesterDoc();
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
  replaceSemString(array) {
    const currentSem = Semesters.getCurrentSemesterDoc();
    const currentYear = currentSem.year;
    let fourRecentSem = _.filter(array, function isRecent(semesterYear) {
      return semesterYear.split(' ')[1] >= currentYear;
    });
    fourRecentSem = array.slice(0, 4);
    const semString = fourRecentSem.join(' - ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  typeCourse() {
    return (this.type === 'courses');
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
});

Template.Semester_Add.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const semester = event.target.text;
    const itemSlug = Slugs.findDoc({ _id: this.item.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    if (this.type === 'courses') {
      const definitionData = {
        semester: semSlug,
        course: itemSlug,
        verified: false,
        note: this.item.number,
        grade: 'B',
        student: username,
      };
      defineMethod.call({ collectionName: 'CourseInstanceCollection', definitionData }, (error) => {
        if (error) {
          console.log('Error defining CourseInstance', error);
        }
      });
    } else {
      const definitionData = {
        semester: semSlug,
        opportunity: itemSlug.name,
        verified: false,
        student: username,
      };
      defineMethod.call({ collectionName: 'OpportunityInstanceCollection', definitionData }, (error) => {
        if (error) {
          console.log('Error defining CourseInstance', error);
        }
      });
    }
  },
});

Template.Semester_Add.onRendered(function semesterAddOnRendered() {
  const template = this;
  template.$('.chooseSemester')
    .popup({
      on: 'click',
    });
  template.$('.chooseYear')
    .popup({
      on: 'click',
    });
});