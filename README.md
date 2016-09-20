# SMU Arcade Machine Management Console

## Installation Steps
1. Install Git: https://git-scm.com/download
2. Download Docker Toolbox (w/ Virtual Box): https://www.docker.com/products/docker-toolbox
3. Create a Docker Cloud account: https://cloud.docker.com/
4. Download PhpStorm (IDE): https://www.jetbrains.com/phpstorm/download/
    1. Sign up under a student license.
    2. Click `Checkout from version control` under main screen to pull in this repo.
    3. **Import settings:** File | Import Settings | Browse to [documentation/php_storm_settings.jar](documentation/php_storm_settings.jar)
5. Open Terminal or **PowerShell not Command Prompt as ADMIN**
6. Start Docker (first time takes a bit): 
    1. Make sure the Docker program is running. 
    
        ![Docker running](documentation/docker_running.png)
        
    1. `cd <project_root_direct>`
    2. `bash docker-start.sh` or `sh docker-start.sh`
7. Access public frontend EmberJS website: [http://localhost:4200/](http://localhost:4200/)
8. Access backend server: [http://localhost:8080/](http://localhost:8080/)
    1. Ex. [http://localhost:8080/test](http://localhost:8080/test)
9. Run Kitematic (Docker Toolbox) to visualize the containers and see logs
    
## Ember Guide
* Where to start learning: [Ember Tutorial](https://guides.emberjs.com/v2.8.0/tutorial/ember-cli/#toc_directory-structure)
* Make sure you are looking at guides/Stack Overflow questions for Ember 2.8.0 and up as Ember has changed a lot from 1.* -> 2.*. 
* **AJAX/Talking with the backend** - 2 ways
    1. [Ember Data](https://guides.emberjs.com/v2.8.0/tutorial/ember-data/)
        1. Used most of the time
        2. Used to POST, GET, and PUT resources (Ex. GET a list of all the ROMs)
        3. Basically a client side database that caches, updates, and adds new resources.
    2. [Ember AJAX](https://github.com/ember-cli/ember-ajax)
        1. Used rarely
        2. Try to use Ember Data whenever possible

## Run Settings
![Run Settings](documentation/build_screenshot.png)   
* Start - run Docker containers
* Remove Containers - remove all containers
* Remove All - remove all images and containers

## Helpful Commands
* SSH into Ember container (adding addons, adding bower components, adding Node modules):
    1. docker exec -it ember /bin/bash
* SSH into PHP/Apache container (read error logs):
    1. docker exec -it php-apache /bin/bash
* SSH into MySQL container:
    1. docker exec -it mysql /bin/bash

# TODO/Bugs
* File change problems on mounting single files
* Run Ember server on docker startup
* Test XDebug