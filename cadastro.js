// cadastro.js — validação básica e comportamentos da tela de cadastro
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const display = document.getElementById('displayName');
  const email = document.getElementById('email');
  const user = document.getElementById('username');
  const pass = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  const msg = document.getElementById('message');
  const togglePw = document.getElementById('toggle-pw');
  const toggleConfirm = document.getElementById('toggle-confirm');

  function toggleInputVisibility(input, button){
    if (input.type === 'password'){
      input.type = 'text';
      button.textContent = '👁️';
      button.setAttribute('aria-label','Ocultar senha');
    } else {
      input.type = 'password';
      button.textContent = '🔒';
      button.setAttribute('aria-label','Mostrar senha');
    }
  }

  togglePw.addEventListener('click', () => toggleInputVisibility(pass, togglePw));
  toggleConfirm.addEventListener('click', () => toggleInputVisibility(confirm, toggleConfirm));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage();

    const d = display.value.trim();
    const em = email.value.trim();
    const u = user.value.trim();
    const p = pass.value;
    const c = confirm.value;

    if (!d || !em || !u || !p || !c){
      showMessage('Preencha todos os campos.', 'error');
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){
      showMessage('Endereço de email inválido.', 'error');
      return;
    }

    if (p.length < 6){
      showMessage('A senha deve ter ao menos 6 caracteres.', 'error');
      return;
    }

    if (p !== c){
      showMessage('As senhas não coincidem.', 'error');
      return;
    }

    if (!document.getElementById('terms').checked){
      showMessage('Você deve aceitar os termos para continuar.', 'error');
      return;
    }

    // Criar conta com Firebase Auth
    const loading = document.getElementById('loading-register');
    function setLoading(on){
      if (!loading) return;
      if (on){
        loading.style.display = 'inline-block';
        form.classList.add('form-loading');
        Array.from(form.querySelectorAll('button')).forEach(b => b.disabled = true);
      } else {
        loading.style.display = 'none';
        form.classList.remove('form-loading');
        Array.from(form.querySelectorAll('button')).forEach(b => b.disabled = false);
      }
    }

    setLoading(true);
    firebase.auth().createUserWithEmailAndPassword(em, p)
      .then((userCredential) => {
        const userObj = userCredential.user;
        // atualiza displayName
        userObj.updateProfile({ displayName: d }).catch(()=>{});
        // grava informações adicionais no Realtime Database
        try {
          const uid = userObj.uid;
          db.ref('users/' + uid).set({ displayName: d, email: em, username: u, createdAt: Date.now() });
        } catch (err) {
          console.warn('Não foi possível gravar no banco:', err);
        }

        showMessage('Conta criada com sucesso! Redirecionando para o login...', 'success');
        setTimeout(() => window.location.href = 'login.html', 900);
      })
        .catch((error) => {
          console.error('Erro ao criar usuário com Firebase Auth:', error);
          const code = error.code || '';
          // Fallback especial: se a configuração do Identity Toolkit não estiver pronta,
          // podemos opcionalmente gravar o usuário no nó 'usuarios' do Realtime DB como medida temporária.
          if (code === 'auth/configuration-not-found'){
            // AVISO: gravar senhas em texto simples no Realtime Database é INSEGURO.
            // Use isto apenas temporariamente para testes locais ou se você entender os riscos.
            const novoUsuario = { displayName: d, email: em, username: u, senha: p, createdAt: Date.now(), fallback: true };
            try {
              db.ref('usuarios').push(novoUsuario).then(() => {
                showMessage('Auth não configurado. Usuário gravado temporariamente no banco (inseguro).', 'success');
                setTimeout(() => window.location.href = 'login.html', 900);
              }).catch((dbErr) => {
                console.error('Erro ao gravar fallback no Realtime DB:', dbErr);
                showMessage('Erro ao gravar usuário localmente. Verifique o console.', 'error');
              });
            } catch (dbErr) {
              console.error('Erro ao acessar db para fallback:', dbErr);
              showMessage('Erro de banco de dados. Verifique o console.', 'error');
            }
            return;
          }

          if (code === 'auth/email-already-in-use'){
            showMessage('Este email já está em uso.', 'error');
          } else if (code === 'auth/invalid-email'){
            showMessage('Email inválido.', 'error');
          } else if (code === 'auth/weak-password'){
            showMessage('Senha fraca — escolha uma senha mais forte.', 'error');
          } else {
            showMessage(error.message || 'Erro ao criar conta.', 'error');
          }
        })
      .finally(() => setLoading(false));
  });

  function showMessage(text, kind){
    msg.textContent = text;
    msg.className = kind === 'success' ? 'msg-success' : 'msg-error';
  }
  function clearMessage(){ msg.textContent=''; msg.className=''; }
});
