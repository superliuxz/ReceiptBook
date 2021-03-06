# RecipeBook
A single page application built using Angular 8. 
I used as many Angular features as I can to maximize my learning experience.

Demo: http://35.212.211.172:10101/

#### Local development:
- update ```environment.ts``` entries;
- run ```ng serve```, and visit ```localhost:4200```;

#### Deployment:
- The runtime environment is dockerized, hence it's free to deploy onto any cloud service provider.
- Push image to Google Cloud: ```docker build . -t us.gcr.io/recipeapp-247619/recipe-book:latest && gcloud docker -- push us.gcr.io/recipeapp-247619/recipe-book```
- The production port is `10101`, and only HTTP traffic is supported.
  - Once can set up a load-balancer to downgrade the external HTTPS traffic to HTTP, other than
    configuring Nginx. 

#### TODOs:
- [x] Keep the spinner after user being authenticated but before resolver load the data.
- [x] Make shopping-list persistent.
  - [x] Corresponding NgRx effects, new actions, new resolver.
- [x] Redo README.
- [x] Dockerize runtime.
- [x] Google Cloud deployment.
- [x] SSR is causing flickering when refresh page.
- [ ] Hook up CircleCI.
- [ ] Move API keys in ```environment.ts``` to Google Cloud keystore.
