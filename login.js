// login.js — comportamentos básicos da tela de login
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('login-form');
	const email = document.getElementById('email');
	const pass = document.getElementById('password');
	const msg = document.getElementById('message');
	const toggle = document.getElementById('toggle-pw');
	const demo = document.getElementById('demo');
	const forgot = document.getElementById('forgot');
	const loading = document.getElementById('loading-login');

	toggle.addEventListener('click', () => {
		if (pass.type === 'password') {
			pass.type = 'text';
			toggle.textContent = '👁️';
			toggle.setAttribute('aria-label','Ocultar senha');
		} else {
			pass.type = 'password';
			toggle.textContent = '🔒';
			toggle.setAttribute('aria-label','Mostrar senha');
		}
	});

			demo.addEventListener('click', () => {
				// efetua login anônimo com Firebase
				showMessage('Entrando como Convidado...', 'success');
				setLoading(true);
				firebase.auth().signInAnonymously()
					.then(() => {
						showMessage('Entrou como convidado. Redirecionando...', 'success');
						setTimeout(() => window.location.href = 'index.html', 700);
					})
					.catch((err) => {
						showMessage(err.message || 'Erro ao entrar como convidado.', 'error');
					})
					.finally(() => setLoading(false));
			});

			// Esqueci a senha -> solicita email e chama sendPasswordResetEmail
			if (forgot) {
				forgot.addEventListener('click', (ev) => {
					ev.preventDefault();
					const e = email.value.trim() || window.prompt('Informe seu email para recuperação:');
					if (!e) return showMessage('Informe um email para recuperar a senha.', 'error');
					setLoading(true);
					firebase.auth().sendPasswordResetEmail(e)
						.then(() => showMessage('Email de recuperação enviado. Verifique sua caixa de entrada.', 'success'))
						.catch((error) => showMessage(error.message || 'Erro ao enviar email de recuperação.', 'error'))
						.finally(() => setLoading(false));
				});
			}

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		clearMessage();
			const em = email.value.trim();
			const p = pass.value;
			if (!em || !p) {
				showMessage('Informe email e senha.', 'error');
				return;
			}

				// Autenticar com Firebase
				setLoading(true);
				firebase.auth().signInWithEmailAndPassword(em, p)
					.then((userCredential) => {
						showMessage('Login realizado. Redirecionando...', 'success');
						// redireciona para a página principal da aplicação (ajuste se necessário)
						setTimeout(() => window.location.href = 'index.html', 800);
					})
							.catch((error) => {
								console.error('Erro ao autenticar com Firebase Auth:', error);
								const code = error.code || '';
								const msgText = error.message || 'Erro ao autenticar.';
								if (code === 'auth/user-not-found' || code === 'auth/wrong-password'){
									showMessage('Email ou senha inválidos.', 'error');
								} else if (code === 'auth/invalid-email'){
									showMessage('Formato de email inválido.', 'error');
								} else if (code === 'auth/configuration-not-found'){
									showMessage('Falha de configuração do Auth (configuration-not-found). Verifique o Firebase Console e as APIs do Google Cloud.', 'error');
								} else {
									showMessage(msgText, 'error');
								}
							})
					.finally(() => setLoading(false));
	});

	function showMessage(text, kind){
		msg.textContent = text;
		msg.className = kind === 'success' ? 'msg-success' : 'msg-error';
	}
	function clearMessage(){ msg.textContent=''; msg.className=''; }
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
});
