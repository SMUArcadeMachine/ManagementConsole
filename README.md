# SMU Arcade Machine Management Console

# Installation Steps
1. Install Git: https://git-scm.com/download
2. Download Docker Toolbox (w/ Virtual Box): https://www.docker.com/products/docker-toolbox
3. Create a Docker Cloud account: https://cloud.docker.com/
4. Download PhpStorm (IDE): https://www.jetbrains.com/phpstorm/download/
    1. Sign up under a student license.
    2. Click `Checkout from version control` under main screen to pull in this repo.
5. Open Terminal or **PowerShell not Command Prompt as ADMIN**
6. Start Docker (first time takes a bit): 
    1. `cd <project_root_direct>`
    2. `bash docker-start.sh`
7. Run Ember Server
    1. `docker exec -it smu-arcade-machine /bin/bash`
    2. `ember server`
8. Access public frontend EmberJS website: [http://localhost:4200/](http://localhost:4200/)
9. Access backend server: [http://localhost:8080/](http://localhost:8080/)
    1. Ex. [http://localhost:8080/test](http://localhost:8080/test) will output `Test backend API call`
    
# Ember Server
* **Start (SSH into Docker container then run Ember Server)**
    1. `docker exec -it smu-arcade-machine /bin/bash`
    2. `ember server`
* Web URL: [http://localhost:4200/](http://localhost:4200/)
* Requires Docker Container to be running

# PHP Backend Server
* **Start**
    1. `bash docker-start.sh`
* Web URL: [http://localhost:8080/](http://localhost:8080/)

# Ember Guide
* Where to start learning: [Ember Tutorial](https://guides.emberjs.com/v2.8.0/tutorial/ember-cli/#toc_directory-structure)
* Make sure you are looking at guides/Stack Overflow questions for Ember 2.8.0 and up as Ember has changed a lot from 1.* -> 2.*. 
* **AJAX/Talking with the backend** - 2 ways
    1. [Ember Data](https://guides.emberjs.com/v2.8.0/tutorial/ember-data/)
        1. Used most of the time
        2. Used to POST, GET, and PUT resources (Ex. GET a list of all the ROMs)
    2. [Ember AJAX](https://github.com/ember-cli/ember-ajax)
        1. Used rarely.
        2. Try to use Ember Data whenever possible.
