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
          schedule: { at: new Date(Date.now() + 2000) }
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
          title: 'Volte para o Memória Viva ',
          body: 'Continue registrando suas memórias!',
          schedule: { at: doisDias }
        }
      ]
    });
  }

  // Notificação se o usuário ficar 15 dias sem entrar
  async agendarNotificacaoInatividade() {
    const data = new Date();
    data.setDate(data.getDate() + 15);
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

  // 🔔 Nova notificação — alertar sobre exclusão de arquivos de "Meu Dia"
  async agendarAvisoApagarMeuDia() {
    const agora = new Date();
    const hoje22h = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      22, 0, 0 // 22:00h (10 da noite)
    );

    // Se já passou das 22h, agenda para o dia seguinte às 22h
    if (hoje22h.getTime() <= agora.getTime()) {
      hoje22h.setDate(hoje22h.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 4,
          title: 'Atenção 🕒',
          body: 'Suas memórias de hoje serão apagadas ao virar o dia. Quer guardar algo mais?',
          schedule: { at: hoje22h }
        }
      ]
    });

    console.log('Notificação de aviso de exclusão agendada para:', hoje22h);
  }

  async jaTemAvisoAgendado(id: number): Promise<boolean> {
    const pendentes = await LocalNotifications.getPending();
    return pendentes.notifications.some(n => n.id === id);
  }

}
