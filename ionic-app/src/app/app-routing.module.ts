import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {
	AngularFireAuthGuardWithReturnUrl,
	redirectUnauthorizedToLoginWithReturnUrl
} from './services/auth-guard.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'teams',
		pathMatch: 'full',
		...redirectUnauthorizedToLoginWithReturnUrl,
	},
	{
		path: 'teams',
		loadChildren: () => import('./pages/teams/teams-page.module').then(m => m.TeamsPageModule),
		...redirectUnauthorizedToLoginWithReturnUrl,
	},
	{
		path: 'scrum',
		loadChildren: () => import('./scrum/scrum.module').then(m => m.ScrumPageModule),
		...redirectUnauthorizedToLoginWithReturnUrl,
	},
	{
		path: 'sign-in',
		loadChildren: () => import('./auth/sign-in/sign-in.module').then(m => m.SignInPageModule)
	},
	{
		path: 'team',
		loadChildren: () => import('./pages/team/team.module').then(m => m.TeamPageModule),
		...redirectUnauthorizedToLoginWithReturnUrl,
	},
	{
		path: 'member',
		loadChildren: () => import('./pages/member/member.module').then(m => m.MemberPageModule),
		...redirectUnauthorizedToLoginWithReturnUrl,
	},
	{
		path: 'add-member',
		loadChildren: () => import('./pages/member-new/member-new.module').then(m => m.MemberNewPageModule),
		...redirectUnauthorizedToLoginWithReturnUrl,
	},
	{
		path: 'personal-invite',
		loadChildren: () => import('./pages/invite-personal/invite-personal.module').then(m => m.InvitePersonalPageModule),
	},
	{
		path: 'join-team',
		loadChildren: () => import('./pages/join-team/join-team.module').then(m => m.JoinTeamPageModule)
	},
	{
		path: 'scrums',
		loadChildren: () => import('./scrum/scrums-history/scrums-history.module').then(m => m.ScrumsHistoryPageModule)
	},
	{
		path: 'add-metric',
		loadChildren: () => import('./pages/add-metric/add-metric.module').then(m => m.AddMetricPageModule)
	},
	{
		path: 'user-profile',
		loadChildren: () => import('./pages/user-profile/user-profile.module').then(m => m.UserProfilePageModule)
	},
	{
		path: 'retro-my-feedback',
		loadChildren: () => import('./retrospective/pages/retro-my-feedback/retro-my-feedback.module')
			.then(m => m.RetroMyFeedbackPageModule)
	},
	{
		path: 'retro-tree',
		loadChildren: () => import('./retrospective/pages/retro-tree/retro-tree.module')
			.then(m => m.RetroTreePageModule)
	},
	{
		path: 'retrospective',
		loadChildren: () => import('./retrospective/pages/retrospective/retrospective.module')
			.then(m => m.RetrospectivePageModule)
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
	],
	exports: [RouterModule],
	providers: [AngularFireAuthGuardWithReturnUrl],
})
export class AppRoutingModule {
}
