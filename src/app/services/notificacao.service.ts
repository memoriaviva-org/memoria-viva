import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  constructor() {}

  async solicitarPermissao() {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') {
      console.log('Permissão negada para notificações');
    }
  }

  // Notificação de boas-vindas (logo após o login)
  async agendarBoasVindas() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Bem-vindo 💜',
          body: 'É ótimo ter você aqui!',
          schedule: { at: new Date(Date.now() + 2000) } // em 2 segundos
        }
      ]
    });
  }

  // Notificação a cada 2 dias
  async agendarNotificacaoPeriodica() {
    const agora = new Date();
    const doisDias = new Date(agora.getTime() + 2 * 24 * 60 * 60 * 1000);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2,
          title: 'Volte para o Memória Viva 💭',
          body: 'Continue registrando suas memórias!',
          schedule: { at: doisDias }
        }
      ]
    });
  }


  // Notificação se o usuário ficar 15 dias sem entrar
  async agendarNotificacaoInatividade() {
    const data = new Date();
    data.setDate(data.getDate() + 15); // daqui a 15 dias
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 3,
          title: 'Estamos sentindo sua falta 💔',
          body: 'Faz tempo que não te vemos por aqui. Que tal voltar hoje?',
          schedule: { at: data }
        }
      ]
    });
  }

  // Cancelar notificações (caso o usuário volte antes dos 15 dias)
  async cancelarInatividade() {
    await LocalNotifications.cancel({ notifications: [{ id: 3 }] });
  }
}
