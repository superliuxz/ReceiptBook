import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipesComponent } from './recipes.component';

const routes = [
  {
    path: '', // Empty string becoz of lazy loading.
    canActivate: [AuthGuard],
    component: RecipesComponent,
    /* Preload recipes when hitting /recipes or any children url. */
    resolve: [RecipesResolverService],
    children: [
      { path: '', component: RecipeStartComponent },
      /* 'new' must come before ':recipeId' */
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':recipeId',
        component: RecipeDetailComponent
      },
      {
        path: ':recipeId/edit',
        component: RecipeEditComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
