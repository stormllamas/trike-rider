import { combineReducers } from 'redux';

import auth from './auth';
import manager from './manager';
import siteConfig from './siteConfig';

export default combineReducers({
  auth,
  manager,
  siteConfig,
});