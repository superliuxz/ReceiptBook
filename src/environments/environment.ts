// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  recipesUrl: 'https://recipebook-f88d0.firebaseio.com/recipes.json',
  ingredientsUrl: 'https://recipebook-f88d0.firebaseio.com/ingredients.json',
  firebaseEmailPasswordEndpoint:
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/',
  authApiKey: 'AIzaSyAD0toTbFtPT5Rjp8tuf1JnFWgHxX88nRM',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
