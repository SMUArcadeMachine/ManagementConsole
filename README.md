# SMU Arcade Machine Management Console

# Installation Steps
1. Install Git: https://git-scm.com/download
2. Download Docker Toolbox (w/ Virtual Box): https://www.docker.com/products/docker-toolbox
3. Create a Docker Cloud account: https://cloud.docker.com/
4. Download PhpStorm (IDE): https://www.jetbrains.com/phpstorm/download/
    1. Sign up under a student license.
    2. Checkout from version control to pull in this repo.
5. Open Terminal or **PowerShell not Command Prompt as ADMIN**
6. Start Docker: 
    1. cd <project_root_direct> (Ex. cd C:/Users/PrestonT/PhpstormProjects/SMUArcadeMachine)
    2. bash docker-start.sh
7. Run Ember Server
    1. docker exec -it smu-arcade-machine /bin/bash
    2. ember server
8. Access public frontend EmberJS website: http://localhost:4200/
9. Access backend server: http://localhost:8080/
    1. Ex. http://localhost:8080/test will output `Test backend API call`
    
# Ember Server
* #### Start (SSH into Docker container then run Ember Server)
    1. docker exec -it smu-arcade-machine /bin/bash
    2. ember server
* #### Web URL: http://localhost:4200/
* Requires Docker Container to be running

# PHP Backend Server
* #### Start
    1. bash docker-start.sh
* #### Web URL: http://localhost:8080/

