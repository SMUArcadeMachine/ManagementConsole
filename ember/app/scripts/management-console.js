//____________________________________INCLUDE FILES______________________________________________________________________________________
require('scripts/config-processed');
require('scripts/controllers/application');
require('scripts/lib/view');
require('scripts/mixins/*');
require('scripts/lib/*');
require('scripts/mixins/Pagination');//Needs to be loaded first (Messaging.js has a dependency on Pagination.js)
require('scripts/extensions/*');
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/adapters/*');
require('scripts/serializers/*');
require('scripts/compiled-emblem-templates');
require('scripts/compiled-handlebars-templates');
require('scripts/editor');