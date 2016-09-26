import env from '../config/environment';

export function initialize(application) {
  application.register('env:main', env, { singleton: true, instantiate: false });
  application.inject('component', 'env', 'env:main');
  // application.inject('authenticators', 'env', 'env:main');
}

export default {
  name: 'inject-env',
  initialize: initialize
};