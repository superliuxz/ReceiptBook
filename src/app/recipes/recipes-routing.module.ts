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
    children: [
      {
        path: '',
        component: RecipeStartComponent,
      },
      /* 'new' must come before ':recipeId' */
      {
        path: 'new',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':recipeId',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':recipeId/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
