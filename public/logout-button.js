// Script para injetar botão de logout flutuante na PWA
(function() {
  // Esperar o DOM estar pronto
  function createLogoutButton() {
    // Verificar se o botão já existe
    if (document.getElementById('floating-logout-btn')) {
      return;
    }

    // Criar botão flutuante
    const button = document.createElement('button');
    button.id = 'floating-logout-btn';
    button.innerHTML = '🚪';
    button.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      width: 50px;
      height: 50px;
      background: #EF4444;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    `;

    // Adicionar hover effect
    button.onmouseover = function() {
      this.style.background = '#DC2626';
      this.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
      this.style.transform = 'scale(1.05)';
    };

    button.onmouseout = function() {
      this.style.background = '#EF4444';
      this.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
      this.style.transform = 'scale(1)';
    };

    button.onmousedown = function() {
      this.style.transform = 'scale(0.95)';
    };

    button.onmouseup = function() {
      this.style.transform = 'scale(1)';
    };

    // Adicionar evento de clique
    button.onclick = function() {
      const shouldLogout = window.confirm('Deseja realmente sair da sua conta?');
      if (shouldLogout) {
        // Limpar localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('user_data');
        
        // Redirecionar para login
        window.location.href = window.location.origin + '/api/webapp/login';
      }
    };

    // Adicionar ao body
    document.body.appendChild(button);
  }

  // Criar botão quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLogoutButton);
  } else {
    createLogoutButton();
  }

  // Recriar botão se a página for modificada (React re-render)
  const observer = new MutationObserver(function() {
    if (!document.getElementById('floating-logout-btn')) {
      createLogoutButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
