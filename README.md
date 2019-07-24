# RecipeBook
A single page application built using Angular 8. 
I used as many Angular features as I can to maximize my learning experience.

Demo: http://35.212.254.27:10101/

#### Local development:
- update ```AppConstants``` entries;
- run ```ng serve```, and visit ```localhost:4200```;

#### Deployment:
- The runtime environment is dockerized, hence it's free to deploy onto any cloud service provider.
- The production port is `10101`, and only HTTP traffic is supported.
  - Once can set up a load-balancer to downgrade the external HTTPS traffic to HTTP, other than
    configuring Nginx. 

#### TODOs:
- [x] Keep the spinner after user being authenticated but before resolver load the data.
- [ ] Make shopping-list persistent.
- [x] Redo README.
- [x] Dockerize runtime.
- [x] Google Cloud deployment.
- [ ] Hook up CircleCI.
- [ ] Move API keys in ```AppConstants``` to Google Cloud keystore.
