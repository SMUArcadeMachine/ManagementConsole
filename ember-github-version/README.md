# Ember Blueprint

Sometimes `ember new` is just too slow. This repository is kept up to date with the **latest Ember and Ember Data stable versions**, and provides an alternative project creation method.

In my absolutely non-formal tests, I got:

Installing with `ember new`:

    time ember new contacts
    real	1m53.625s
    user	1m46.425s
    sys	 0m31.163s

Installing by cloning the blueprint repo:
  
    time git clone https://github.com/frank06/ember-blueprint.git contacts
    real	0m46.136s
    user	0m4.070s
    sys	 0m9.881s

It assumes you have installed the latest Ember CLI, npm and bower.

Needless to say, **YMMV**.

## Installation

 1. `git clone https://github.com/frank06/ember-blueprint.git your-project-name`
 1. change directory into your project and run `./setup.sh your-project-name`
 1. ready! 
 
It's a good idea to keep a copy of the blueprint on your computer and `git pull` whenever there are updates.

## Current versions

  - Ember: `2.3.1`
  - Ember Data: `2.3.3`
  - Created with Ember CLI `2.3.0` and node.js `4.3.1`
  
----
----

# Your App

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

