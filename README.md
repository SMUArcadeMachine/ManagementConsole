# SMU Arcade Machine Management Console

# Installation Steps
1. Download Docker Toolbox (w/ Virtual Box): https://www.docker.com/products/docker-toolbox
2. Create a Docker Cloud account: https://cloud.docker.com/
3. Download PhpStorm (IDE): https://www.jetbrains.com/phpstorm/download/
    1. Sign up under a student license.
    2. Checkout from version control to pull in this repo.
4. Open Terminal or **PowerShell not Command Prompt as ADMIN**
5. Start Docker: 
    1. cd <project_root_direct> (Ex. cd C:/Users/PrestonT/PhpstormProjects/SMUArcadeMachine)
    2. ./docker-start.sh
6. Run Ember Server
    1. docker exec -it smu-arcade-machine /bin/bash
    2. ember server
7. Access public frontend EmberJS website: http://localhost:4200/
8. Access backend server: http://localhost:8080/
    1. Ex. http://localhost:8080/test will output `Test backend API call`
    
# Ember Server
* #### Start (SSH into Docker container then run Ember Server)
    1. docker exec -it smu-arcade-machine /bin/bash
    2. ember server
* #### Web URL: http://localhost:4200/
* Requires Docker Container to be running

# PHP Backend Server
* #### Start
    1. ./docker-start.sh
* #### Web URL: http://localhost:8080/

