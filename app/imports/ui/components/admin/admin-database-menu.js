import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

// /** @module ui/components/admin/Admin_DataBase_Menu */

Template.Admin_DataBase_Menu.helpers({
  integrityCheckRouteName() {
    return RouteNames.adminDataBaseIntegrityCheckPageRouteName;
  },
  dumpRouteName() {
    return RouteNames.adminDataBaseDumpPageRouteName;
  },
});
