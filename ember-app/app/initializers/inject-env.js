import env from '../config/environment';

export function initialize(application) {
  application.register('env:main', env, { singleton: true, instantiate: false });
  application.inject('component', 'env', 'env:main');

  //Current user service (currentUser.user.username)
  application.inject('component', 'currentUser', 'service:current-user');
  application.inject('route', 'currentUser', 'service:current-user');

  //Current session service (session.isAuthenticated)
  application.inject('component', 'session', 'service:session');
  application.inject('route', 'session', 'service:session');

  //Ajax service
  application.inject('component', 'ajax', 'service:ajax');
  application.inject('route', 'ajax', 'service:ajax');

  //Utils service
  application.inject('component', 'utils', 'service:utils');
  application.inject('route', 'utils', 'service:utils');
}

export default {
  name: 'inject-env',
  initialize: initialize
};