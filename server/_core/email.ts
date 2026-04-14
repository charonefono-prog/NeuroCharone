import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  /**
   * Enviar email de boas-vindas para novo usuário
   */
  sendWelcomeEmail: async (email: string, fullName: string) => {
    try {
      const result = await resend.emails.send({
        from: "NeuroLaserMap <noreply@neurolasermap.com>",
        to: email,
        subject: "Bem-vindo ao NeuroLaserMap",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0a7ea4;">Bem-vindo ao NeuroLaserMap! 🎉</h1>
            <p>Olá <strong>${fullName}</strong>,</p>
            <p>Sua conta foi criada com sucesso! Agora você precisa aguardar a aprovação de um administrador para começar a usar o aplicativo.</p>
            <p>Você receberá um email de confirmação assim que sua conta for aprovada.</p>
            <p style="margin-top: 30px; color: #666;">
              Atenciosamente,<br/>
              <strong>Equipe NeuroLaserMap</strong>
            </p>
          </div>
        `,
      });

      if (result.error) {
        console.error("Erro ao enviar email de boas-vindas:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Erro ao enviar email de boas-vindas:", error);
      return { success: false, error };
    }
  },

  /**
   * Enviar email de aprovação para usuário
   */
  sendApprovalEmail: async (email: string, fullName: string) => {
    try {
      const result = await resend.emails.send({
        from: "NeuroLaserMap <noreply@neurolasermap.com>",
        to: email,
        subject: "Sua conta foi aprovada! ✓",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #22C55E;">Conta Aprovada! ✓</h1>
            <p>Olá <strong>${fullName}</strong>,</p>
            <p>Sua conta no NeuroLaserMap foi aprovada com sucesso! 🎉</p>
            <p>Você já pode fazer login e começar a gerenciar seus pacientes.</p>
            <div style="margin: 30px 0;">
              <a href="https://neuro-map-muctwckw.manus.space" style="background-color: #0a7ea4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Acessar NeuroLaserMap
              </a>
            </div>
            <p style="margin-top: 30px; color: #666;">
              Atenciosamente,<br/>
              <strong>Equipe NeuroLaserMap</strong>
            </p>
          </div>
        `,
      });

      if (result.error) {
        console.error("Erro ao enviar email de aprovação:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Erro ao enviar email de aprovação:", error);
      return { success: false, error };
    }
  },

  /**
   * Enviar email de convite para novo profissional
   */
  sendInviteEmail: async (email: string, inviteCode: string, expiresAt: Date) => {
    try {
      const expirationDate = new Date(expiresAt).toLocaleDateString("pt-BR");
      
      const result = await resend.emails.send({
        from: "NeuroLaserMap <noreply@neurolasermap.com>",
        to: email,
        subject: "Você foi convidado para NeuroLaserMap",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0a7ea4;">Você foi convidado! 🎉</h1>
            <p>Você recebeu um convite para se juntar ao NeuroLaserMap.</p>
            <p>Use o código de convite abaixo ao se registrar:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <code style="font-size: 18px; font-weight: bold; color: #0a7ea4;">${inviteCode}</code>
            </div>
            <p style="color: #666; font-size: 12px;">
              Este código expira em: <strong>${expirationDate}</strong>
            </p>
            <div style="margin: 30px 0;">
              <a href="https://neuro-map-muctwckw.manus.space/register" style="background-color: #0a7ea4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Registrar-se Agora
              </a>
            </div>
            <p style="margin-top: 30px; color: #666;">
              Atenciosamente,<br/>
              <strong>Equipe NeuroLaserMap</strong>
            </p>
          </div>
        `,
      });

      if (result.error) {
        console.error("Erro ao enviar email de convite:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Erro ao enviar email de convite:", error);
      return { success: false, error };
    }
  },

  /**
   * Enviar email de notificação ao admin sobre novo registro
   */
  sendAdminNotificationEmail: async (adminEmail: string, userName: string, userEmail: string) => {
    try {
      const result = await resend.emails.send({
        from: "NeuroLaserMap <noreply@neurolasermap.com>",
        to: adminEmail,
        subject: "Novo registro aguardando aprovação",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0a7ea4;">Novo Usuário Registrado</h1>
            <p>Um novo profissional se registrou no NeuroLaserMap e aguarda sua aprovação.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Nome:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
            </div>
            <div style="margin: 30px 0;">
              <a href="https://neuro-map-muctwckw.manus.space/admin" style="background-color: #0a7ea4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Revisar no Dashboard
              </a>
            </div>
            <p style="margin-top: 30px; color: #666;">
              Atenciosamente,<br/>
              <strong>Sistema NeuroLaserMap</strong>
            </p>
          </div>
        `,
      });

      if (result.error) {
        console.error("Erro ao enviar email de notificação:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Erro ao enviar email de notificação:", error);
      return { success: false, error };
    }
  },
};
