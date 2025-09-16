import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tela-de-carregamento',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'esqueci-minha-senha',
    loadChildren: () => import('./esqueci-minha-senha/esqueci-minha-senha.module').then( m => m.EsqueciMinhaSenhaPageModule)
  },
  {
    path: 'redefinir-senha',
    loadChildren: () => import('./redefinir-senha/redefinir-senha.module').then( m => m.RedefinirSenhaPageModule)
  },
  {
    path: 'codigo',
    loadChildren: () => import('./codigo/codigo.module').then( m => m.CodigoPageModule)
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then( m => m.VideoPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'tela-de-carregamento',
    loadChildren: () => import('./tela-de-carregamento/tela-de-carregamento.module').then( m => m.TelaDeCarregamentoPageModule)
  },
  {
    path: 'video-introdutorio',
    loadChildren: () => import('./video-introdutorio/video-introdutorio.module').then( m => m.VideoIntrodutorioPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'atualizar-perfil',
    loadChildren: () => import('./atualizar-perfil/atualizar-perfil.module').then( m => m.AtualizarPerfilPageModule)
  },
  {
    path: 'premium',
    loadChildren: () => import('./premium/premium.module').then( m => m.PremiumPageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'audio-config',
    loadChildren: () => import('./audio-config/audio-config.module').then( m => m.AudioConfigPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'meu-dia',
    loadChildren: () => import('./meu-dia/meu-dia.module').then( m => m.MeuDiaPageModule)
  },
  {
    path: 'meu-dia-registros',
    loadChildren: () => import('./meu-dia-registros/meu-dia-registros.module').then( m => m.MeuDiaRegistrosPageModule)
  },

  {
    path: '',
    loadChildren: () => import('./video/video.module').then( m => m.VideoPageModule)
  },  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'criar-flashcard',
    loadChildren: () => import('./criar-flashcard/criar-flashcard.module').then( m => m.CriarFlashcardPageModule)
  },
  {
    path: 'func-categoria',
    loadChildren: () => import('./func-categoria/func-categoria.module').then( m => m.FuncCategoriaPageModule)
  },
  {
    path: 'flashcard',
    loadChildren: () => import('./flashcard/flashcard.module').then( m => m.FlashcardPageModule)
  },
  {
    path: 'expl-flashcard',
    loadChildren: () => import('./expl-flashcard/expl-flashcard.module').then( m => m.ExplFlashcardPageModule)
  },
  {
    path: 'expl-contatos',
    loadChildren: () => import('./contato/expl-contatos/expl-contatos.module').then( m => m.ExplContatosPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
