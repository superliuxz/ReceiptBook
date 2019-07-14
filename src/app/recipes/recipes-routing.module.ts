import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipes-resolver.service';

const routes = [
  {
    path: 'recipes',
    canActivate: [AuthGuard],
    component: RecipesComponent,
    children: [
      { path: '', component: RecipeStartComponent },
      /* 'new' must come before ':recipeId' */
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':recipeId',
        component: RecipeDetailComponent,
        /* Add a resolver because when hitting /recipes/:localId/ or
      /recipes/:localId/edit/, must make sure all recipes are loaded. */
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
