const DEFAULT_APPWRITE_AUTH_CONFIG = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '69b443ad0007ac25103a',
  sdkUrl: 'https://cdn.jsdelivr.net/npm/appwrite@13.0.1'
};

let APPWRITE_AUTH_CONFIG = { ...DEFAULT_APPWRITE_AUTH_CONFIG };

const authState = {
  appwrite: null,
  account: null,
  user: null,
  configLoaded: false,
  ready: false,
  error: ''
};

window.appwriteAuthState = authState;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripDiacritics(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function autoTranslatePortugueseToEnglish(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';

  let translated = stripDiacritics(raw.toLowerCase());

  const phraseMap = [
    ['em tempo real', 'in real time'],
    ['sem necessidade de', 'without needing'],
    ['sem servidor', 'serverless'],
    ['de baixa latencia', 'low-latency'],
    ['de longo prazo', 'long-term'],
    ['de dados', 'of data'],
    ['de seguranca', 'security'],
    ['de suporte', 'support'],
    ['na nuvem', 'in the cloud'],
    ['para a aws', 'to AWS'],
    ['com base em', 'based on'],
    ['com boas praticas', 'with best practices'],
    ['com seguranca', 'securely'],
    ['por etapas', 'step by step'],
    ['linha de comando', 'command line'],
    ['conta aws', 'AWS account'],
    ['base de conhecimento', 'knowledge base'],
    ['fora do escopo', 'out of scope'],
    ['fora do exame', 'out of the exam scope'],
    ['em escala', 'at scale'],
    ['com aws', 'with AWS'],
    ['para aws', 'for AWS'],
    ['com redis', 'with Redis'],
    ['de acesso', 'access'],
    ['de criptografia', 'encryption'],
    ['de custos', 'cost']
  ];

  phraseMap.forEach(([from, to]) => {
    translated = translated.replace(new RegExp(escapeRegExp(from), 'g'), to);
  });

  const tokenMap = {
    interfaces: 'interfaces',
    permite: 'allows',
    permitem: 'allow',
    comunicacao: 'communication',
    entre: 'between',
    sistemas: 'systems',
    sistema: 'system',
    aplicacoes: 'applications',
    aplicacao: 'application',
    reducao: 'reduction',
    custos: 'costs',
    custo: 'cost',
    escalabilidade: 'scalability',
    agilidade: 'agility',
    seguranca: 'security',
    aprimorada: 'improved',
    orientacoes: 'guidance',
    para: 'for',
    planejar: 'plan',
    implementar: 'implement',
    adocao: 'adoption',
    nuvem: 'cloud',
    conjunto: 'set',
    certificacoes: 'certifications',
    programas: 'programs',
    mostram: 'show',
    aderencia: 'compliance',
    padroes: 'standards',
    legais: 'regulatory',
    e: 'and',
    uso: 'use',
    recursos: 'resources',
    processamento: 'processing',
    como: 'such as',
    executar: 'run',
    ferramentas: 'tools',
    controlar: 'control',
    gastos: 'spending',
    servicos: 'services',
    servico: 'service',
    armazenar: 'store',
    consultar: 'query',
    dados: 'data',
    estruturados: 'structured',
    diferentes: 'different',
    opcoes: 'options',
    compra: 'purchase',
    instancia: 'instance',
    sob: 'under',
    demanda: 'demand',
    reservadas: 'reserved',
    spot: 'spot',
    estrutura: 'structure',
    fisica: 'physical',
    aws: 'AWS',
    dividida: 'divided',
    em: 'into',
    regioes: 'regions',
    zonas: 'zones',
    disponibilidade: 'availability',
    pontos: 'points',
    locais: 'local',
    gerenciamento: 'management',
    via: 'via',
    codigo: 'code',
    base: 'base',
    artigos: 'articles',
    respostas: 'answers',
    perguntas: 'questions',
    frequentes: 'frequent',
    monitoramento: 'monitoring',
    controle: 'control',
    organizacao: 'organization',
    move: 'move',
    mover: 'move',
    trafego: 'traffic',
    ecossistema: 'ecosystem',
    empresas: 'companies',
    certificadas: 'certified',
    oferecem: 'offer',
    solucoes: 'solutions',
    boas: 'good',
    praticas: 'practices',
    sugestoes: 'recommendations',
    automaticas: 'automatic',
    fornecidas: 'provided',
    calculadora: 'calculator',
    oficial: 'official',
    estimar: 'estimate',
    consultoria: 'consulting',
    especializada: 'specialized',
    propria: 'own',
    grandes: 'large',
    projetos: 'projects',
    forum: 'forum',
    comunidade: 'community',
    tirar: 'resolve',
    duvidas: 'questions',
    tecnicas: 'technical',
    kits: 'kits',
    desenvolvimento: 'development',
    programar: 'program',
    usando: 'using',
    varias: 'multiple',
    linguagens: 'languages',
    proteger: 'protect',
    acesso: 'access',
    canal: 'channel',
    atualizacoes: 'updates',
    painel: 'dashboard',
    centralizado: 'centralized',
    informacoes: 'information',
    conta: 'account',
    cliente: 'customer',
    cuida: 'handles',
    especialistas: 'specialists',
    ajudam: 'help',
    clientes: 'customers',
    projetar: 'design',
    escalaveis: 'scalable',
    guardar: 'store',
    central: 'center',
    usuarios: 'users',
    acessam: 'access',
    planos: 'plans',
    suporte: 'support',
    casos: 'cases',
    abertos: 'open',
    historico: 'history',
    atendimento: 'support',
    niveis: 'levels',
    tecnico: 'technical',
    oferecidos: 'offered',
    criar: 'create',
    arquiteturas: 'architectures',
    eficientes: 'efficient',
    consulta: 'query',
    usando: 'using',
    sql: 'SQL',
    necessidade: 'need',
    compartilha: 'shares',
    consome: 'consumes',
    terceiros: 'third-party',
    processamento: 'processing',
    larga: 'large',
    escala: 'scale',
    coleta: 'collects',
    analisa: 'analyzes',
    logs: 'logs',
    streams: 'streams',
    gerenciado: 'managed',
    pesquisa: 'search',
    analise: 'analysis',
    visualizacao: 'visualization',
    paineis: 'dashboards',
    interativos: 'interactive',
    warehouse: 'warehouse',
    conecta: 'connects',
    aplicativos: 'applications',
    eventos: 'events',
    mensagens: 'messages',
    notificacoes: 'notifications',
    fila: 'queue',
    desacopladas: 'decoupled',
    orquestracao: 'orchestration',
    fluxos: 'workflows',
    trabalho: 'work',
    central: 'center',
    atendimento: 'support',
    baseada: 'based',
    envio: 'sending',
    emails: 'emails',
    transacionais: 'transactional',
    marketing: 'marketing',
    organiza: 'organizes',
    personaliza: 'customizes',
    cobrancas: 'billing',
    define: 'defines',
    alertas: 'alerts',
    detalhado: 'detailed',
    relatorio: 'report',
    visualiza: 'visualizes',
    analisa: 'analyzes',
    loja: 'store',
    online: 'online',
    softwares: 'software',
    prontos: 'ready',
    executa: 'runs',
    tarefas: 'tasks',
    computacao: 'compute',
    lotes: 'batches',
    instancias: 'instances',
    servidores: 'servers',
    virtuais: 'virtual',
    implanta: 'deploys',
    web: 'web',
    automaticamente: 'automatically',
    hospedagem: 'hosting',
    simples: 'simple',
    menores: 'smaller',
    expande: 'extends',
    perto: 'closer',
    usuario: 'user',
    final: 'end',
    entregues: 'delivered',
    data: 'data',
    centers: 'centers',
    baixa: 'low',
    latencia: 'latency',
    borda: 'edge'
  };

  translated = translated.replace(/\b[a-z0-9]+\b/g, word => tokenMap[word] || word);
  translated = translated.replace(/\s+/g, ' ').trim();
  translated = translated.replace(/\s+([,.;:!?])/g, '$1');

  if (!translated) return '';

  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

function getDefinitionPt(entry) {
  return String(entry.definition_pt || entry.definitionPt || entry.definition || '').trim();
}

function getDefinitionEn(entry) {
  const fromData = String(entry.definition_en || entry.definitionEn || entry.englishDefinition || '').trim();
  if (fromData) return fromData;

  const translated = autoTranslatePortugueseToEnglish(getDefinitionPt(entry));
  return translated || 'English translation not available yet.';
}

function normalizeVocabularyItem(entry) {
  const normalized = { ...entry };
  normalized.definitionPt = getDefinitionPt(entry);
  normalized.definitionEn = getDefinitionEn(entry);
  normalized.definition = normalized.definitionPt;
  return normalized;
}

function parseAuthError(error) {
  if (!error) return 'Unexpected authentication error.';
  if (typeof error === 'string') return error;

  const origin = window && window.location
    ? (window.location.protocol === 'file:' ? 'file://' : (window.location.origin || '(unknown origin)'))
    : '(unknown origin)';

  if (typeof error.message === 'string' && error.message.trim()) {
    const message = error.message.trim();
    const normalizedMessage = message.toLowerCase();
    if (normalizedMessage.includes('failed to fetch') || normalizedMessage.includes('networkerror')) {
      if (origin === 'file://') {
        return 'Authentication is blocked on file://. Start a local server and open the app on http://localhost:5500 (or another allowed host).';
      }
      return `Could not reach Appwrite from ${origin}. Add this host as a Web Platform in Appwrite and try again.`;
    }
    return message;
  }

  if (error.response && typeof error.response.message === 'string') {
    const responseMessage = error.response.message;
    if (String(error.response.type || '').trim() === 'general_unknown_origin') {
      return `Invalid Origin for ${origin}. Add this host as a Web Platform in Appwrite.`;
    }
    return responseMessage;
  }

  return 'Authentication request failed.';
}

function getCurrentPageMode() {
  return document.body && document.body.dataset ? document.body.dataset.auth || 'public' : 'public';
}

function getCurrentRelativePath() {
  const pathName = window.location.pathname.split('/').pop() || 'index.html';
  return `${pathName}${window.location.search}${window.location.hash}`;
}

function normalizeRelativePath(path) {
  const raw = String(path || '').trim();
  if (!raw) return '';

  const clean = raw.startsWith('/') ? raw.slice(1) : raw;
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('//')) return '';
  if (clean.includes('..') || clean.includes('\\')) return '';

  const allowed = /^[a-zA-Z0-9._/-]+(?:\?[a-zA-Z0-9=&._-]*)?(?:#[a-zA-Z0-9._-]*)?$/;
  if (!allowed.test(clean)) return '';
  return clean;
}

function getSafeNextPath(defaultPath = 'dashboard.html') {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  const safe = normalizeRelativePath(next);
  return safe || defaultPath;
}

function buildLoginUrl(nextPath) {
  const normalized = normalizeRelativePath(nextPath);
  if (!normalized) return 'login.html';
  return `login.html?next=${encodeURIComponent(normalized)}`;
}

function applyRuntimeAuthConfig(rawConfig) {
  if (!rawConfig || typeof rawConfig !== 'object') return;

  APPWRITE_AUTH_CONFIG = {
    endpoint: String(rawConfig.endpoint || APPWRITE_AUTH_CONFIG.endpoint || '').trim(),
    projectId: String(rawConfig.projectId || APPWRITE_AUTH_CONFIG.projectId || '').trim(),
    sdkUrl: String(rawConfig.sdkUrl || APPWRITE_AUTH_CONFIG.sdkUrl || '').trim()
  };
}

async function loadRuntimeAuthConfig() {
  if (authState.configLoaded) return;
  authState.configLoaded = true;

  if (window.__APPWRITE_CONFIG__ && typeof window.__APPWRITE_CONFIG__ === 'object') {
    applyRuntimeAuthConfig(window.__APPWRITE_CONFIG__);
    return;
  }

  try {
    const response = await fetch('appwrite-config.json', { cache: 'no-store' });
    if (!response.ok) return;
    const jsonConfig = await response.json();
    applyRuntimeAuthConfig(jsonConfig);
  } catch (error) {
    // Keep default config.
  }
}

function loadAppwriteSdk() {
  return new Promise((resolve, reject) => {
    if (window.Appwrite && window.Appwrite.Client) {
      resolve(window.Appwrite);
      return;
    }

    const existingScript = document.querySelector('script[data-appwrite-sdk="true"]');
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        if (window.Appwrite && window.Appwrite.Client) {
          resolve(window.Appwrite);
        } else {
          reject(new Error('Appwrite SDK loaded without expected objects.'));
        }
        return;
      }

      if (existingScript.dataset.loaded === 'error') {
        existingScript.remove();
      } else {
        existingScript.addEventListener('load', () => {
          if (window.Appwrite && window.Appwrite.Client) {
            resolve(window.Appwrite);
          } else {
            reject(new Error('Appwrite SDK loaded without expected objects.'));
          }
        }, { once: true });

        existingScript.addEventListener('error', () => {
          reject(new Error('Failed to load Appwrite SDK.'));
        }, { once: true });
        return;
      }
    }

    const script = document.createElement('script');
    script.src = APPWRITE_AUTH_CONFIG.sdkUrl;
    script.defer = true;
    script.dataset.appwriteSdk = 'true';
    script.onload = () => {
      script.dataset.loaded = 'true';
      if (window.Appwrite && window.Appwrite.Client) {
        resolve(window.Appwrite);
      } else {
        reject(new Error('Appwrite SDK loaded without expected objects.'));
      }
    };
    script.onerror = () => {
      script.dataset.loaded = 'error';
      reject(new Error('Failed to load Appwrite SDK.'));
    };
    document.head.appendChild(script);
  });
}

async function refreshCurrentUser() {
  if (!authState.account) {
    authState.user = null;
    return;
  }

  try {
    authState.user = await authState.account.get();
  } catch (error) {
    authState.user = null;
  }
}

async function initAuthClient() {
  try {
    await loadRuntimeAuthConfig();
    if (!APPWRITE_AUTH_CONFIG.endpoint || !APPWRITE_AUTH_CONFIG.projectId) {
      throw new Error('Missing Appwrite config. Generate appwrite-config.json from .env.');
    }

    authState.appwrite = await loadAppwriteSdk();
    const client = new authState.appwrite.Client();
    client
      .setEndpoint(APPWRITE_AUTH_CONFIG.endpoint)
      .setProject(APPWRITE_AUTH_CONFIG.projectId);

    authState.account = new authState.appwrite.Account(client);
    await refreshCurrentUser();
    authState.ready = true;
    authState.error = '';
  } catch (error) {
    authState.ready = false;
    authState.error = parseAuthError(error);
  }
}

function emitAuthStateChanged() {
  document.dispatchEvent(new Event('auth-state-updated'));
}

async function createAuthSession(email, password) {
  if (!authState.account) {
    throw new Error('Appwrite account client is not initialized.');
  }

  if (typeof authState.account.createEmailPasswordSession === 'function') {
    return authState.account.createEmailPasswordSession(email, password);
  }

  if (typeof authState.account.createEmailSession === 'function') {
    return authState.account.createEmailSession(email, password);
  }

  throw new Error('Email/password session method not found in SDK.');
}

async function createAuthAccount(name, email, password) {
  if (!authState.account || !authState.appwrite || !authState.appwrite.ID) {
    throw new Error('Appwrite account client is not initialized.');
  }

  return authState.account.create(authState.appwrite.ID.unique(), email, password, name);
}

async function sendPasswordRecoveryEmail(email, redirectUrl) {
  if (!authState.account) {
    throw new Error('Appwrite account client is not initialized.');
  }

  if (typeof authState.account.createRecovery === 'function') {
    return authState.account.createRecovery(email, redirectUrl);
  }

  throw new Error('Password recovery method not found in SDK.');
}

async function completePasswordRecovery(userId, secret, password, confirmPassword) {
  if (!authState.account) {
    throw new Error('Appwrite account client is not initialized.');
  }

  if (typeof authState.account.updateRecovery === 'function') {
    return authState.account.updateRecovery(userId, secret, password, confirmPassword);
  }

  throw new Error('Password recovery update method not found in SDK.');
}

async function logoutCurrentSession() {
  if (!authState.account) {
    throw new Error('Appwrite account client is not initialized.');
  }

  if (typeof authState.account.deleteSession === 'function') {
    return authState.account.deleteSession('current');
  }

  if (typeof authState.account.deleteSessions === 'function') {
    return authState.account.deleteSessions();
  }

  throw new Error('Logout method not found in SDK.');
}

function applyRouteGuard() {
  const mode = getCurrentPageMode();

  if (mode === 'protected' && !authState.user) {
    window.location.replace(buildLoginUrl(getCurrentRelativePath()));
    return false;
  }

  if (mode === 'guest-only' && authState.user) {
    window.location.replace(getSafeNextPath('dashboard.html'));
    return false;
  }

  return true;
}

function initTopNavigation() {
  const userLabel = document.getElementById('nav-user-name');
  if (userLabel && authState.user) {
    userLabel.textContent = authState.user.name || authState.user.email || 'Authenticated user';
  }

  const logoutButtons = document.querySelectorAll('[data-logout-btn]');
  logoutButtons.forEach(button => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await logoutCurrentSession();
      } catch (error) {
        // Ignore and force redirect.
      } finally {
        authState.user = null;
        emitAuthStateChanged();
        window.location.href = 'index.html';
      }
    });
  });
}

function setAuthPageMessage(message, type = 'info') {
  const box = document.getElementById('auth-page-message');
  if (!box) return;

  box.className = `auth-page-message ${type}`;
  box.textContent = message;
}

function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const recoveryForm = document.getElementById('recovery-form');
  const pageTitle = document.getElementById('login-page-title');
  const pageSubtitle = document.getElementById('login-page-subtitle');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const showPasswordCheckbox = document.getElementById('login-show-password');
  const forgotPasswordButton = document.getElementById('forgot-password-btn');

  const params = new URLSearchParams(window.location.search);
  const recoveryUserId = String(params.get('userId') || '').trim();
  const recoverySecret = String(params.get('secret') || '').trim();
  const hasRecoveryTokens = Boolean(recoveryUserId && recoverySecret);

  if (hasRecoveryTokens && recoveryForm) {
    loginForm.hidden = true;
    recoveryForm.hidden = false;
    if (pageTitle) pageTitle.textContent = 'Reset Password';
    if (pageSubtitle) pageSubtitle.textContent = 'Create a new password for your account.';
  } else if (recoveryForm) {
    recoveryForm.hidden = true;
    loginForm.hidden = false;
    if (pageTitle) pageTitle.textContent = 'Login';
    if (pageSubtitle) pageSubtitle.textContent = 'Sign in to access your AWS Cloud Practitioner study panel.';
  }

  if (passwordInput && showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', () => {
      passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
  }

  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener('click', async () => {
      if (!authState.ready) {
        setAuthPageMessage(authState.error || 'Authentication is not ready yet.', 'error');
        return;
      }

      const email = String(emailInput && emailInput.value ? emailInput.value : '').trim();
      if (!email) {
        setAuthPageMessage('Enter your email first, then click "Forgot password?".', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      const originalText = forgotPasswordButton.textContent;
      forgotPasswordButton.disabled = true;
      forgotPasswordButton.textContent = 'Sending...';
      setAuthPageMessage('Sending password reset email...', 'info');

      try {
        const recoveryUrl = `${window.location.origin}${window.location.pathname}`;
        await sendPasswordRecoveryEmail(email, recoveryUrl);
        setAuthPageMessage('Password reset email sent. Check your inbox and spam folder.', 'success');
      } catch (error) {
        setAuthPageMessage(parseAuthError(error), 'error');
      } finally {
        forgotPasswordButton.disabled = false;
        forgotPasswordButton.textContent = originalText || 'Forgot password?';
      }
    });
  }

  if (!authState.ready && authState.error) {
    setAuthPageMessage(authState.error, 'error');
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
      setAuthPageMessage('Enter both email and password.', 'error');
      return;
    }

    const submitButton = loginForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setAuthPageMessage('Signing in...', 'info');

    try {
      await createAuthSession(email, password);
      await refreshCurrentUser();
      emitAuthStateChanged();
      window.location.href = getSafeNextPath('dashboard.html');
    } catch (error) {
      setAuthPageMessage(parseAuthError(error), 'error');
      if (submitButton) submitButton.disabled = false;
    }
  });

  if (recoveryForm && hasRecoveryTokens) {
    recoveryForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(recoveryForm);
      const password = String(formData.get('password') || '');
      const confirmPassword = String(formData.get('confirmPassword') || '');

      if (password.length < 8) {
        setAuthPageMessage('Password must have at least 8 characters.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        setAuthPageMessage('Password confirmation does not match.', 'error');
        return;
      }

      const submitButton = recoveryForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      setAuthPageMessage('Updating password...', 'info');

      try {
        await completePasswordRecovery(recoveryUserId, recoverySecret, password, confirmPassword);
        setAuthPageMessage('Password updated successfully. You can log in now.', 'success');
        recoveryForm.reset();
        recoveryForm.hidden = true;
        loginForm.hidden = false;
        if (pageTitle) pageTitle.textContent = 'Login';
        if (pageSubtitle) pageSubtitle.textContent = 'Sign in to access your AWS Cloud Practitioner study panel.';
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        setAuthPageMessage(parseAuthError(error), 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
}

function initRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;

  if (!authState.ready && authState.error) {
    setAuthPageMessage(authState.error, 'error');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!name || !email || !password) {
      setAuthPageMessage('Fill name, email, and password.', 'error');
      return;
    }

    if (password.length < 8) {
      setAuthPageMessage('Password must have at least 8 characters.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setAuthPageMessage('Password confirmation does not match.', 'error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setAuthPageMessage('Creating account...', 'info');

    try {
      await createAuthAccount(name, email, password);
      await createAuthSession(email, password);
      await refreshCurrentUser();
      emitAuthStateChanged();
      window.location.href = getSafeNextPath('dashboard.html');
    } catch (error) {
      setAuthPageMessage(parseAuthError(error), 'error');
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function initDashboardPage() {
  const welcomeName = document.getElementById('dashboard-user-name');
  if (!welcomeName || !authState.user) return;
  welcomeName.textContent = authState.user.name || authState.user.email || 'Cloud Learner';
}

function initLandingPage() {
  const info = document.getElementById('landing-auth-info');
  if (!info) return;

  if (authState.user) {
    info.innerHTML = `Already signed in as <strong>${escapeHtml(authState.user.email || authState.user.name || 'user')}</strong>. <a class="landing-inline-link" href="dashboard.html">Open dashboard</a>.`;
  } else {
    info.textContent = 'Create an account to access the full AWS Cloud Practitioner study dashboard.';
  }
}

const EXAM_TIPS_CHECKLIST_STORAGE_PREFIX = 'aws-cloud-quizlet-exam-tips-checklist';

function normalizeStudySearchText(value) {
  return stripDiacritics(String(value || '').toLowerCase()).trim();
}

function updateStudyCounter(counterEl, visibleCount, totalCount, label) {
  if (!counterEl) return;
  counterEl.textContent = `Showing ${visibleCount}/${totalCount} ${label}`;
}

function setDetailsOpenState(detailsList, shouldOpen) {
  detailsList.forEach(detail => {
    if (!detail.hidden) detail.open = shouldOpen;
  });
}

function focusStudySection(detail) {
  detail.open = true;
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  detail.classList.add('study-focus-highlight');
  window.setTimeout(() => {
    detail.classList.remove('study-focus-highlight');
  }, 700);
}

function initStudyDetailsExperience({
  pageId,
  detailsSelector,
  searchInputId,
  expandBtnId,
  collapseBtnId,
  clearBtnId,
  counterId,
  counterLabel,
  emptyStateId,
  quickNavId
}) {
  const page = document.getElementById(pageId);
  if (!page) return;

  const details = Array.from(page.querySelectorAll(detailsSelector));
  if (!details.length) return;

  const searchInput = document.getElementById(searchInputId);
  const expandBtn = document.getElementById(expandBtnId);
  const collapseBtn = document.getElementById(collapseBtnId);
  const clearBtn = document.getElementById(clearBtnId);
  const counterEl = document.getElementById(counterId);
  const emptyState = document.getElementById(emptyStateId);
  const quickNav = document.getElementById(quickNavId);

  details.forEach((detail, idx) => {
    const summary = detail.querySelector('summary');
    const summaryText = summary ? summary.textContent.trim() : `Section ${idx + 1}`;
    detail.dataset.searchText = normalizeStudySearchText(`${summaryText} ${detail.textContent}`);
  });

  function applyFilter() {
    const query = normalizeStudySearchText(searchInput ? searchInput.value : '');
    let visibleCount = 0;

    details.forEach(detail => {
      const haystack = detail.dataset.searchText || '';
      const match = !query || haystack.includes(query);
      detail.hidden = !match;
      detail.classList.toggle('is-hidden-by-filter', !match);
      if (query && match) {
        detail.open = true;
      }
      if (match) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
    updateStudyCounter(counterEl, visibleCount, details.length, counterLabel);
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      setDetailsOpenState(details, true);
    });
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      setDetailsOpenState(details, false);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!searchInput) return;
      searchInput.value = '';
      applyFilter();
      searchInput.focus();
    });
  }

  if (quickNav) {
    quickNav.innerHTML = '';
    details.forEach((detail, idx) => {
      const summary = detail.querySelector('summary');
      const title = summary ? summary.textContent.trim() : `Section ${idx + 1}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'study-chip';
      button.textContent = title;
      button.addEventListener('click', () => {
        if (detail.hidden && searchInput) {
          searchInput.value = '';
          applyFilter();
        }
        focusStudySection(detail);
      });
      quickNav.appendChild(button);
    });
  }

  applyFilter();
}

function getExamTipsChecklistStorageKey() {
  const userId = authState.user && authState.user.$id ? authState.user.$id : 'guest';
  return `${EXAM_TIPS_CHECKLIST_STORAGE_PREFIX}:${userId}`;
}

function loadExamTipsChecklistState() {
  try {
    const raw = localStorage.getItem(getExamTipsChecklistStorageKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch (error) {
    return {};
  }
}

function saveExamTipsChecklistState(state) {
  try {
    localStorage.setItem(getExamTipsChecklistStorageKey(), JSON.stringify(state));
  } catch (error) {
    // Ignore storage write failures.
  }
}

function initExamTipsChecklist() {
  const checklist = document.getElementById('exam-day-checklist');
  if (!checklist) return;

  const state = loadExamTipsChecklistState();
  const items = Array.from(checklist.querySelectorAll('input[data-check-id]'));
  const resetBtn = document.getElementById('exam-checklist-reset');

  items.forEach(input => {
    const key = String(input.dataset.checkId || '').trim();
    if (!key) return;
    input.checked = Boolean(state[key]);
    input.addEventListener('change', () => {
      state[key] = Boolean(input.checked);
      saveExamTipsChecklistState(state);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      items.forEach(input => {
        input.checked = false;
      });
      saveExamTipsChecklistState({});
    });
  }
}

function initKeyConceptsPage() {
  initStudyDetailsExperience({
    pageId: 'key-concepts-page',
    detailsSelector: 'details.concept-domain',
    searchInputId: 'key-concepts-search',
    expandBtnId: 'key-concepts-expand-all',
    collapseBtnId: 'key-concepts-collapse-all',
    clearBtnId: 'key-concepts-clear-search',
    counterId: 'key-concepts-counter',
    counterLabel: 'domains',
    emptyStateId: 'key-concepts-empty',
    quickNavId: 'key-concepts-quick-nav'
  });
}

function initExamTipsPage() {
  initStudyDetailsExperience({
    pageId: 'exam-tips-page',
    detailsSelector: 'details.exam-tip-section',
    searchInputId: 'exam-tips-search',
    expandBtnId: 'exam-tips-expand-all',
    collapseBtnId: 'exam-tips-collapse-all',
    clearBtnId: 'exam-tips-clear-search',
    counterId: 'exam-tips-counter',
    counterLabel: 'sections',
    emptyStateId: 'exam-tips-empty',
    quickNavId: 'exam-tips-quick-nav'
  });

  initExamTipsChecklist();
}

// Vocabulary Loader with search and grouping
let vocabulary = [];
async function loadVocabulary() {
  const res = await fetch('data/vocabulary.json');
  const raw = await res.json();
  vocabulary = raw.map(item => normalizeVocabularyItem(item));
  const search = document.getElementById('search-input');
  if (search) {
    search.addEventListener('input', () => renderVocabulary(search.value));
  }
  renderVocabulary('');
}

function renderVocabulary(filter) {
  const container = document.getElementById('vocab-list');
  if (!container) return;
  container.innerHTML = '';
  const normalizedFilter = String(filter || '').toLowerCase();
  const filtered = vocabulary.filter(v => {
    const text = `${v.term} ${v.definitionPt} ${v.definitionEn}`.toLowerCase();
    return text.includes(normalizedFilter);
  });
  const groups = {};
  filtered.forEach(v => {
    const cat = v.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(v);
  });
  Object.keys(groups).sort().forEach(cat => {
    const details = document.createElement('details');
    details.open = true;
    details.className = 'mb-4';
    const summary = document.createElement('summary');
    summary.className = 'font-semibold cursor-pointer mb-2';
    summary.textContent = cat;
    details.appendChild(summary);
    groups[cat].forEach(v => {
      const div = document.createElement('div');
      div.className = 'card mb-2 vocab-entry-card';
      div.innerHTML = `
        <p class="vocab-entry-term">${escapeHtml(v.term)}</p>
        <p class="vocab-definition-line vocab-definition-pt"><span class="vocab-definition-label">PT:</span> ${escapeHtml(v.definitionPt)}</p>
        <p class="vocab-definition-line vocab-definition-en"><span class="vocab-definition-label">EN:</span> ${escapeHtml(v.definitionEn)}</p>
      `;
      details.appendChild(div);
    });
    container.appendChild(details);
  });
}

// Flashcards
const FLASHCARD_STATUS_STORAGE_PREFIX = 'aws-cloud-quizlet-flashcard-status';

let flashcards = [];
let flashFiltered = [];
let flashIndex = 0;
let flashFilter = 'all';
let flashcardStatus = {};
let flashKeyboardBound = false;

function getFlashcardStatusStorageKey() {
  const userId = authState.user && authState.user.$id ? authState.user.$id : 'guest';
  return `${FLASHCARD_STATUS_STORAGE_PREFIX}:${userId}`;
}

function loadFlashcardStatus() {
  try {
    const raw = localStorage.getItem(getFlashcardStatusStorageKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch (error) {
    return {};
  }
}

function saveFlashcardStatus() {
  try {
    localStorage.setItem(getFlashcardStatusStorageKey(), JSON.stringify(flashcardStatus));
  } catch (error) {
    // Ignore storage write failures.
  }
}

function getFlashStatusById(cardId) {
  return flashcardStatus[cardId] || 'unseen';
}

function getFlashStatusLabel(status) {
  if (status === 'known') return 'Known';
  if (status === 'review') return 'Need Review';
  return 'Unseen';
}

function getFilteredFlashcards() {
  if (flashFilter === 'all') return [...flashcards];
  return flashcards.filter(card => getFlashStatusById(card._id) === flashFilter);
}

function updateFlashcardDeck(resetIndex = false) {
  const currentCard = flashFiltered[flashIndex];
  const currentCardId = currentCard ? currentCard._id : '';

  flashFiltered = getFilteredFlashcards();

  if (resetIndex) {
    flashIndex = 0;
    return;
  }

  if (!flashFiltered.length) {
    flashIndex = 0;
    return;
  }

  if (currentCardId) {
    const sameIndex = flashFiltered.findIndex(card => card._id === currentCardId);
    if (sameIndex >= 0) {
      flashIndex = sameIndex;
      return;
    }
  }

  if (flashIndex >= flashFiltered.length) {
    flashIndex = flashFiltered.length - 1;
  }
}

function setFlashStatusText(status) {
  const statusEl = document.getElementById('flash-status-text');
  if (!statusEl) return;
  statusEl.className = `flash-status-text flash-status-${status}`;
  statusEl.textContent = `Status: ${getFlashStatusLabel(status)}`;
}

function updateFlashStats() {
  const knownCount = flashcards.filter(card => getFlashStatusById(card._id) === 'known').length;
  const reviewCount = flashcards.filter(card => getFlashStatusById(card._id) === 'review').length;
  const unseenCount = Math.max(0, flashcards.length - knownCount - reviewCount);

  const knownEl = document.getElementById('flash-known-count');
  const reviewEl = document.getElementById('flash-review-count');
  const unseenEl = document.getElementById('flash-unseen-count');

  if (knownEl) knownEl.textContent = String(knownCount);
  if (reviewEl) reviewEl.textContent = String(reviewCount);
  if (unseenEl) unseenEl.textContent = String(unseenCount);
}

function bindFlashcardControls() {
  const filterSelect = document.getElementById('flash-filter');
  if (filterSelect) {
    filterSelect.value = flashFilter;
    filterSelect.addEventListener('change', () => {
      flashFilter = filterSelect.value;
      updateFlashcardDeck(true);
      showFlashcard();
    });
  }

  const card = document.getElementById('flashcard');
  if (card) {
    card.addEventListener('click', () => {
      flipCard();
    });
  }

  if (!flashKeyboardBound) {
    document.addEventListener('keydown', handleFlashcardKeyboardShortcuts);
    flashKeyboardBound = true;
  }
}

function handleFlashcardKeyboardShortcuts(event) {
  if (!document.getElementById('flashcard')) return;

  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

  const key = event.key.toLowerCase();

  if (key === ' ' || key === 'f') {
    event.preventDefault();
    flipCard();
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextCard();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    prevCard();
    return;
  }

  if (key === 's') {
    event.preventDefault();
    shuffleCards();
    return;
  }

  if (key === 'k') {
    event.preventDefault();
    markKnown();
    return;
  }

  if (key === 'r') {
    event.preventDefault();
    markReview();
  }
}

async function initFlashcards() {
  const res = await fetch('data/vocabulary.json');
  const rawCards = await res.json();
  flashcards = rawCards.map((card, idx) => {
    const base = String(card.term || `card-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const normalizedCard = normalizeVocabularyItem(card);
    return {
      ...normalizedCard,
      _id: `card-${idx}-${base}`
    };
  });
  flashcardStatus = loadFlashcardStatus();
  bindFlashcardControls();
  updateFlashcardDeck(true);
  showFlashcard();
}

function flipCard() {
  const card = document.getElementById('flashcard');
  if (!card) return;
  card.classList.toggle('is-flipped');
}

function showFlashcard() {
  const card = document.getElementById('flashcard');
  if (!card) return;

  const front = card.querySelector('.flashcard-front');
  const back = card.querySelector('.flashcard-back');
  const progress = document.getElementById('flash-progress');
  const category = document.getElementById('flash-category');
  const sessionBar = document.getElementById('flash-session-bar');

  updateFlashStats();

  if (!flashFiltered.length) {
    card.classList.remove('is-flipped');
    if (front) front.textContent = 'No cards in this filter.';
    if (back) back.textContent = 'Change your filter to continue studying.';
    if (progress) progress.textContent = 'Card 0 of 0';
    if (category) category.textContent = 'No category';
    setFlashStatusText('unseen');
    if (sessionBar) sessionBar.style.width = '0%';
    return;
  }

  if (flashIndex >= flashFiltered.length) {
    flashIndex = flashFiltered.length - 1;
  }

  const item = flashFiltered[flashIndex];
  if (!item) return;

  card.classList.remove('is-flipped');
  if (front) front.textContent = item.term;
  if (back) {
    back.innerHTML = `
      <div class="flashcard-definition-wrap">
        <p class="flashcard-definition-label">PT</p>
        <p class="flashcard-definition-text">${escapeHtml(item.definitionPt || '')}</p>
        <p class="flashcard-definition-label flashcard-definition-label-en">EN</p>
        <p class="flashcard-definition-text flashcard-definition-text-en">${escapeHtml(item.definitionEn || '')}</p>
      </div>
    `;
  }

  if (progress) {
    progress.textContent = `Card ${flashIndex + 1} of ${flashFiltered.length}`;
  }
  if (category) {
    category.textContent = item.category || 'General';
  }

  const status = getFlashStatusById(item._id);
  setFlashStatusText(status);

  if (sessionBar) {
    const width = flashFiltered.length ? ((flashIndex + 1) / flashFiltered.length) * 100 : 0;
    sessionBar.style.width = `${width}%`;
  }
}

function nextCard() {
  if (!flashFiltered.length) return;
  flashIndex = (flashIndex + 1) % flashFiltered.length;
  showFlashcard();
}

function prevCard() {
  if (!flashFiltered.length) return;
  flashIndex = (flashIndex - 1 + flashFiltered.length) % flashFiltered.length;
  showFlashcard();
}

function shuffleCards() {
  if (!flashFiltered.length) return;
  for (let i = flashFiltered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashFiltered[i], flashFiltered[j]] = [flashFiltered[j], flashFiltered[i]];
  }
  flashIndex = 0;
  showFlashcard();
}

function randomCard() {
  if (!flashFiltered.length) return;
  flashIndex = Math.floor(Math.random() * flashFiltered.length);
  showFlashcard();
}

function setCurrentFlashcardStatus(status) {
  if (!flashFiltered.length) return;
  const current = flashFiltered[flashIndex];
  if (!current) return;

  flashcardStatus[current._id] = status;
  saveFlashcardStatus();

  updateFlashcardDeck(false);
  if (flashFiltered.length > 1) {
    flashIndex = (flashIndex + 1) % flashFiltered.length;
  }
  showFlashcard();
}

function markKnown() {
  setCurrentFlashcardStatus('known');
}

function markReview() {
  setCurrentFlashcardStatus('review');
}

function resetFlashcardsProgress() {
  if (!window.confirm('Reset all flashcard progress for this user?')) return;
  flashcardStatus = {};
  saveFlashcardStatus();
  updateFlashcardDeck(true);
  showFlashcard();
}

// Exam Logic
const EXAM_DURATION_SECONDS = 5400; // 90 minutes
const REVIEW_STORAGE_PREFIX = 'aws-cloud-quizlet-review-history';

let exam = [];
let currentExamFile = '';
let currentQuestion = 0;
let answers = [];
let timer;
let timeLeft = EXAM_DURATION_SECONDS;
let latestAttemptId = null;

function initExamPage() {
  if (!document.getElementById('start-screen')) return;
  updateTimerText();
  renderExamReviewHistory();
  document.addEventListener('auth-state-updated', () => {
    renderExamReviewHistory();
  });
}

function showScreen(screenId) {
  const screenIds = ['start-screen', 'exam-screen', 'result-screen', 'review-screen'];
  screenIds.forEach(id => {
    const screen = document.getElementById(id);
    if (!screen) return;
    screen.style.display = id === screenId ? 'block' : 'none';
  });
}

function formatDuration(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatDateTime(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-US');
}

function formatExamName(examFile) {
  const match = String(examFile || '').match(/exam(\d+)\.json/i);
  if (!match) return String(examFile || 'Practice Exam');
  return `Practice Exam ${match[1]}`;
}

function getReviewStorageKey() {
  const userId = authState.user && authState.user.$id ? authState.user.$id : 'guest';
  return `${REVIEW_STORAGE_PREFIX}:${userId}`;
}

function loadReviewHistory() {
  try {
    const raw = localStorage.getItem(getReviewStorageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveReviewHistory(history) {
  try {
    localStorage.setItem(getReviewStorageKey(), JSON.stringify(history.slice(0, 40)));
  } catch (error) {
    // Ignore storage write failures.
  }
}

function clearReviewHistory() {
  if (!document.getElementById('review-history-list')) return;
  if (!window.confirm('Clear all review history for the current user?')) return;
  localStorage.removeItem(getReviewStorageKey());
  renderExamReviewHistory();
}

function renderExamReviewHistory() {
  const list = document.getElementById('review-history-list');
  if (!list) return;

  const history = loadReviewHistory();
  list.innerHTML = '';

  if (!history.length) {
    list.innerHTML = '<p class="text-gray-600">No completed attempts yet.</p>';
    return;
  }

  history.forEach(attempt => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'review-history-item';
    button.innerHTML = `
      <div class="review-history-main">
        <strong>${escapeHtml(formatExamName(attempt.examFile))}</strong>
        <span>${escapeHtml(String(attempt.percent))}%</span>
      </div>
      <div class="review-history-sub">
        <span>${escapeHtml(String(attempt.score))}/${escapeHtml(String(attempt.total))}</span>
        <span>${escapeHtml(formatDateTime(attempt.completedAt))}</span>
      </div>
    `;
    button.addEventListener('click', () => {
      openReviewAttempt(attempt.id);
    });
    list.appendChild(button);
  });
}

function updateTimerText() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  timerEl.textContent = formatDuration(timeLeft);
}

function updateTimer() {
  timeLeft -= 1;
  updateTimerText();
  if (timeLeft <= 0) {
    timeLeft = 0;
    clearInterval(timer);
    finishExam(true);
  }
}

function isAnswered(answer) {
  if (Array.isArray(answer)) return answer.length > 0;
  return typeof answer === 'string' && answer.length > 0;
}

function extractOptionLetter(optionText) {
  const match = String(optionText).match(/^\s*([A-Z])\./);
  if (match) return match[1];
  return String(optionText).trim().charAt(0).toUpperCase();
}

function stripOptionPrefix(optionText) {
  return String(optionText).replace(/^\s*[A-Z]\.\s*/, '').trim();
}

function getOptionTextByLetter(question, letter) {
  if (!question || !Array.isArray(question.options)) return '';
  const found = question.options.find(opt => extractOptionLetter(opt) === letter);
  return found ? stripOptionPrefix(found) : '';
}

function getAnswerLetters(answer) {
  if (Array.isArray(answer)) return [...answer];
  if (typeof answer === 'string' && answer) return [answer];
  return [];
}

function formatAnswerWithText(question, answer) {
  const letters = getAnswerLetters(answer);
  if (!letters.length) return 'No answer';
  return letters
    .map(letter => {
      const text = getOptionTextByLetter(question, letter);
      return text ? `${letter}. ${text}` : letter;
    })
    .join(' | ');
}

function isAnswerCorrect(question, answer) {
  if (!question) return false;
  if (Array.isArray(question.correctAnswer)) {
    if (!Array.isArray(answer)) return false;
    const user = [...new Set(answer)].sort();
    const correct = [...new Set(question.correctAnswer)].sort();
    if (user.length !== correct.length) return false;
    return user.every((value, idx) => value === correct[idx]);
  }

  return typeof answer === 'string' && answer === question.correctAnswer;
}

function buildQuestionExplanation(question) {
  if (question && typeof question.explanation === 'string' && question.explanation.trim()) {
    return question.explanation.trim();
  }

  const correct = formatAnswerWithText(question, question.correctAnswer);
  if (Array.isArray(question.correctAnswer)) {
    return `The correct options are ${correct}. This question requires the exact combination that satisfies the requirement.`;
  }
  return `The correct option is ${correct} because it best satisfies the requirement described in the question.`;
}

function updateProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar || !exam.length) return;
  const answered = answers.filter(isAnswered).length;
  bar.style.width = `${(answered / exam.length) * 100}%`;
}

function renderQuestionNavigator() {
  const nav = document.getElementById('question-nav-grid');
  if (!nav) return;
  nav.innerHTML = '';

  exam.forEach((_, idx) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'question-nav-btn';
    if (idx === currentQuestion) {
      button.classList.add('is-current');
    } else if (isAnswered(answers[idx])) {
      button.classList.add('is-answered');
    }
    button.textContent = String(idx + 1);
    button.addEventListener('click', () => {
      currentQuestion = idx;
      showQuestion();
    });
    nav.appendChild(button);
  });
}

function updateExamActionButtons() {
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  const finishBtn = document.getElementById('finish-btn');

  if (backBtn) {
    backBtn.disabled = currentQuestion === 0;
  }

  const isLastQuestion = currentQuestion === exam.length - 1;
  if (nextBtn) {
    nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
  }
  if (finishBtn) {
    finishBtn.style.display = isLastQuestion ? 'inline-block' : 'none';
  }
}

function updateAnswerWarning() {
  const warning = document.getElementById('answer-warning');
  if (!warning) return;

  if (isAnswered(answers[currentQuestion])) {
    warning.textContent = 'Answer saved. Click Next Question (or Previous Question) to navigate.';
  } else {
    warning.textContent = 'Select an option and click Next Question to continue.';
  }
}

function showQuestion() {
  const q = exam[currentQuestion];
  if (!q) return;

  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const qNumEl = document.getElementById('question-number');

  if (!questionEl || !optionsEl || !qNumEl) return;

  qNumEl.textContent = `Question ${currentQuestion + 1} of ${exam.length}`;
  questionEl.innerHTML = `
    <p class="font-semibold mb-2">${currentQuestion + 1}.</p>
    <p>${escapeHtml(q.question)}</p>
  `;

  optionsEl.innerHTML = '';
  const isMultiAnswer = Array.isArray(q.correctAnswer);
  const selectedAnswer = answers[currentQuestion];

  q.options.forEach(optionText => {
    const letter = extractOptionLetter(optionText);
    const label = document.createElement('label');
    label.className = 'option-label';

    const input = document.createElement('input');
    input.type = isMultiAnswer ? 'checkbox' : 'radio';
    input.name = isMultiAnswer ? `exam-option-${currentQuestion}` : 'exam-option';
    input.value = letter;
    input.className = 'option-input';

    if (isMultiAnswer && Array.isArray(selectedAnswer) && selectedAnswer.includes(letter)) {
      input.checked = true;
      label.classList.add('is-selected');
    }
    if (!isMultiAnswer && selectedAnswer === letter) {
      input.checked = true;
      label.classList.add('is-selected');
    }

    const span = document.createElement('span');
    span.textContent = optionText;

    input.addEventListener('change', () => {
      if (isMultiAnswer) {
        const selected = [...optionsEl.querySelectorAll('input:checked')]
          .map(el => el.value)
          .sort();
        answers[currentQuestion] = selected.length ? selected : null;
      } else {
        answers[currentQuestion] = input.value;
      }
      showQuestion();
    });

    label.appendChild(input);
    label.appendChild(span);
    optionsEl.appendChild(label);
  });

  renderQuestionNavigator();
  updateExamActionButtons();
  updateProgress();
  updateAnswerWarning();
}

async function startExam(examFile) {
  const response = await fetch(`data/${examFile}`);
  const loadedExam = await response.json();

  exam = loadedExam.slice(0, 65);
  currentExamFile = examFile;
  currentQuestion = 0;
  answers = new Array(exam.length).fill(null);
  timeLeft = EXAM_DURATION_SECONDS;
  latestAttemptId = null;

  clearInterval(timer);
  showScreen('exam-screen');
  updateTimerText();
  renderQuestionNavigator();
  showQuestion();
  timer = setInterval(updateTimer, 1000);
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    showQuestion();
  }
}

function nextQuestion() {
  if (currentQuestion < exam.length - 1) {
    currentQuestion += 1;
    showQuestion();
  }
}

function persistAttempt(attempt) {
  const history = loadReviewHistory();
  history.unshift(attempt);
  saveReviewHistory(history);
  renderExamReviewHistory();
}

function buildAttemptData(score, percent) {
  const attemptId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const durationSeconds = EXAM_DURATION_SECONDS - Math.max(0, timeLeft);

  return {
    id: attemptId,
    examFile: currentExamFile,
    score,
    total: exam.length,
    percent,
    completedAt: new Date().toISOString(),
    durationSeconds,
    answers: answers.map(answer => {
      if (Array.isArray(answer)) return [...answer];
      return answer || null;
    })
  };
}

function finishExam(fromTimer = false) {
  if (!exam.length) return;

  clearInterval(timer);

  let score = 0;
  exam.forEach((question, idx) => {
    if (isAnswerCorrect(question, answers[idx])) {
      score += 1;
    }
  });

  const percent = Math.round((score / exam.length) * 100);
  const attempt = buildAttemptData(score, percent);
  persistAttempt(attempt);
  latestAttemptId = attempt.id;

  showScreen('result-screen');

  const scoreEl = document.getElementById('score');
  const passFailEl = document.getElementById('passfail');
  const resultMetaEl = document.getElementById('result-meta');

  if (scoreEl) {
    scoreEl.textContent = `Score: ${score}/${exam.length} (${percent}%)`;
  }
  if (passFailEl) {
    passFailEl.textContent = percent >= 70 ? 'Status: Pass' : 'Status: Fail';
  }
  if (resultMetaEl) {
    const timeoutNote = fromTimer ? ' | Time expired.' : '';
    resultMetaEl.textContent = `${formatExamName(currentExamFile)} | ${formatDateTime(attempt.completedAt)} | Time used: ${formatDuration(attempt.durationSeconds)}${timeoutNote}`;
  }
}

function backToExamList() {
  clearInterval(timer);
  showScreen('start-screen');
  renderExamReviewHistory();
}

async function retryExam() {
  if (!currentExamFile) {
    backToExamList();
    return;
  }
  await startExam(currentExamFile);
}

function openLatestReview() {
  if (!latestAttemptId) {
    const history = loadReviewHistory();
    if (!history.length) return;
    latestAttemptId = history[0].id;
  }
  openReviewAttempt(latestAttemptId);
}

async function openReviewAttempt(attemptId) {
  const history = loadReviewHistory();
  const attempt = history.find(item => item.id === attemptId);
  if (!attempt) return;

  let attemptExam = [];
  try {
    const response = await fetch(`data/${attempt.examFile}`);
    attemptExam = (await response.json()).slice(0, 65);
  } catch (error) {
    return;
  }

  const reviewTitle = document.getElementById('review-title');
  const reviewMeta = document.getElementById('review-meta');
  const reviewQuestions = document.getElementById('review-questions');
  if (!reviewTitle || !reviewMeta || !reviewQuestions) return;

  reviewTitle.textContent = `Review - ${formatExamName(attempt.examFile)}`;
  reviewMeta.textContent = `Score ${attempt.score}/${attempt.total} (${attempt.percent}%) | ${formatDateTime(attempt.completedAt)}`;
  reviewQuestions.innerHTML = '';

  attemptExam.forEach((question, idx) => {
    const answer = attempt.answers && idx < attempt.answers.length ? attempt.answers[idx] : null;
    const correct = isAnswerCorrect(question, answer);

    const article = document.createElement('article');
    article.className = `review-question card ${correct ? 'review-correct' : 'review-wrong'}`;

    const userAnswerText = formatAnswerWithText(question, answer);
    const correctAnswerText = formatAnswerWithText(question, question.correctAnswer);
    const explanation = buildQuestionExplanation(question);

    article.innerHTML = `
      <p class="font-semibold mb-2">Question ${idx + 1}</p>
      <p class="mb-3">${escapeHtml(question.question)}</p>
      <p><strong>Your answer:</strong> ${escapeHtml(userAnswerText)}</p>
      <p><strong>Correct answer:</strong> ${escapeHtml(correctAnswerText)}</p>
      ${correct ? '' : `<p class="review-explanation"><strong>Comment:</strong> ${escapeHtml(explanation)}</p>`}
    `;

    reviewQuestions.appendChild(article);
  });

  showScreen('review-screen');
}

// Mastery Mode
const MASTERY_STORAGE_PREFIX = 'aws-cloud-quizlet-mastery-progress';
const MASTERY_EXAM_FILES = Array.from({ length: 13 }, (_, idx) => `exam${idx + 1}.json`);

let masteryQuestions = [];
let masteryQuestionsById = new Map();
let masteryKnown = {};
let masteryQueue = [];
let masteryCurrentQuestion = null;
let masteryCurrentResolution = '';
let masterySessionAttempts = 0;
let masterySessionCorrect = 0;
let masteryCorrectStreak = 0;
let masteryControlsBound = false;

function hashString(value) {
  let hash = 2166136261;
  const input = String(value || '');
  for (let idx = 0; idx < input.length; idx += 1) {
    hash ^= input.charCodeAt(idx);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function shuffleArrayInPlace(items) {
  for (let idx = items.length - 1; idx > 0; idx -= 1) {
    const randomIndex = Math.floor(Math.random() * (idx + 1));
    [items[idx], items[randomIndex]] = [items[randomIndex], items[idx]];
  }
}

function buildMasteryQuestionKey(question) {
  const normalized = normalizeStudySearchText(question && question.question ? question.question : '');
  return normalized.replace(/\s+/g, ' ').trim();
}

function buildMasteryQuestionId(question) {
  const questionKey = buildMasteryQuestionKey(question);
  if (questionKey) {
    return `mq-${hashString(questionKey)}`;
  }

  const fallback = `${String(question && question.question ? question.question : '').trim()}|${String(question && question.correctAnswer ? question.correctAnswer : '').trim()}`;
  return `mq-${hashString(fallback)}`;
}

function isValidMasteryQuestion(question) {
  if (!question || typeof question !== 'object') return false;
  if (typeof question.question !== 'string' || !question.question.trim()) return false;
  if (!Array.isArray(question.options) || !question.options.length) return false;

  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.length > 0 && question.correctAnswer.every(answer => typeof answer === 'string' && answer.trim());
  }
  return typeof question.correctAnswer === 'string' && question.correctAnswer.trim().length > 0;
}

async function loadMasteryQuestionBank() {
  const loadedSets = await Promise.all(
    MASTERY_EXAM_FILES.map(async (fileName) => {
      const response = await fetch(`data/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName}.`);
      }
      const questions = await response.json();
      return Array.isArray(questions) ? questions : [];
    })
  );

  const deduplicated = new Map();
  loadedSets.flat().forEach((question) => {
    if (!isValidMasteryQuestion(question)) return;

    const questionKey = buildMasteryQuestionKey(question);
    if (!questionKey) return;
    if (deduplicated.has(questionKey)) return;

    const masteryId = buildMasteryQuestionId(question);
    deduplicated.set(questionKey, {
      ...question,
      _id: masteryId
    });
  });

  return [...deduplicated.values()];
}

function getMasteryStorageKey() {
  const userId = authState.user && authState.user.$id ? authState.user.$id : 'guest';
  return `${MASTERY_STORAGE_PREFIX}:${userId}`;
}

function loadMasteryProgress() {
  try {
    const raw = localStorage.getItem(getMasteryStorageKey());
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.knownIds)) return {};

    return parsed.knownIds.reduce((accumulator, questionId) => {
      if (typeof questionId === 'string' && questionId.trim()) {
        accumulator[questionId] = true;
      }
      return accumulator;
    }, {});
  } catch (error) {
    return {};
  }
}

function saveMasteryProgress() {
  try {
    const knownIds = Object.keys(masteryKnown).filter(questionId => masteryKnown[questionId] && masteryQuestionsById.has(questionId));
    localStorage.setItem(getMasteryStorageKey(), JSON.stringify({ knownIds }));
  } catch (error) {
    // Ignore storage write failures.
  }
}

function getMasteryKnownCount() {
  return masteryQuestions.reduce((count, question) => {
    if (masteryKnown[question._id]) return count + 1;
    return count;
  }, 0);
}

function setMasteryFeedback(message, type = 'info') {
  const feedback = document.getElementById('mastery-feedback');
  if (!feedback) return;
  feedback.className = `mastery-feedback ${type}`;
  feedback.textContent = message;
}

function renderMasteryKnownItems() {
  const container = document.getElementById('mastery-known-items');
  if (!container) return;

  const knownQuestions = masteryQuestions.filter(question => masteryKnown[question._id]);
  if (!knownQuestions.length) {
    container.innerHTML = '<p class="mastery-known-item">No mastered questions yet.</p>';
    return;
  }

  container.innerHTML = '';
  knownQuestions.forEach((question, idx) => {
    const row = document.createElement('p');
    row.className = 'mastery-known-item';
    row.textContent = `${idx + 1}. ${question.question}`;
    container.appendChild(row);
  });
}

function updateMasteryCounters() {
  const total = masteryQuestions.length;
  const mastered = getMasteryKnownCount();
  const learning = Math.max(0, total - mastered);
  const percent = total ? Math.round((mastered / total) * 100) : 0;

  const totalEl = document.getElementById('mastery-total-count');
  const masteredEl = document.getElementById('mastery-mastered-count');
  const learningEl = document.getElementById('mastery-learning-count');
  const progressFill = document.getElementById('mastery-progress-fill');
  const progressText = document.getElementById('mastery-progress-text');
  const sessionText = document.getElementById('mastery-session-text');
  const completeText = document.getElementById('mastery-complete-text');

  if (totalEl) totalEl.textContent = String(total);
  if (masteredEl) masteredEl.textContent = String(mastered);
  if (learningEl) learningEl.textContent = String(learning);
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `${percent}% mastered (${mastered}/${total})`;
  if (sessionText) sessionText.textContent = `Session accuracy: ${masterySessionCorrect}/${masterySessionAttempts} | Streak: ${masteryCorrectStreak}`;
  if (completeText) completeText.textContent = `You mastered ${mastered} out of ${total} questions in this bank.`;
}

function buildMasteryQueue() {
  masteryQueue = masteryQuestions.filter(question => !masteryKnown[question._id]);
  shuffleArrayInPlace(masteryQueue);
  masteryCurrentQuestion = masteryQueue.length ? masteryQueue[0] : null;
  masteryCurrentResolution = '';
}

function updateMasteryOptionSelectionState() {
  const optionsContainer = document.getElementById('mastery-options');
  if (!optionsContainer) return;

  optionsContainer.querySelectorAll('.mastery-option').forEach((label) => {
    const input = label.querySelector('input');
    label.classList.toggle('is-selected', Boolean(input && input.checked));
  });
}

function getMasteryCurrentAnswer() {
  if (!masteryCurrentQuestion) return null;
  const optionsContainer = document.getElementById('mastery-options');
  if (!optionsContainer) return null;

  if (Array.isArray(masteryCurrentQuestion.correctAnswer)) {
    const selected = [...optionsContainer.querySelectorAll('input:checked')]
      .map(input => input.value)
      .sort();
    return selected.length ? selected : null;
  }

  const selected = optionsContainer.querySelector('input:checked');
  return selected ? selected.value : null;
}

function revealMasteryAnswer(answer) {
  if (!masteryCurrentQuestion) return;

  const correctLetters = getAnswerLetters(masteryCurrentQuestion.correctAnswer);
  const selectedLetters = getAnswerLetters(answer);
  const optionsContainer = document.getElementById('mastery-options');
  if (!optionsContainer) return;

  optionsContainer.querySelectorAll('.mastery-option').forEach((label) => {
    const optionLetter = String(label.dataset.letter || '').trim();
    const input = label.querySelector('input');

    label.classList.remove('is-selected');
    if (correctLetters.includes(optionLetter)) {
      label.classList.add('is-correct');
    }
    if (selectedLetters.includes(optionLetter) && !correctLetters.includes(optionLetter)) {
      label.classList.add('is-wrong');
    }

    if (input) input.disabled = true;
  });
}

function renderMasteryQuestion() {
  const loadingCard = document.getElementById('mastery-loading');
  const questionCard = document.getElementById('mastery-question-card');
  const completeCard = document.getElementById('mastery-complete-card');

  if (loadingCard) loadingCard.hidden = true;
  if (!questionCard || !completeCard) return;

  if (!masteryQueue.length) {
    masteryCurrentQuestion = null;
    questionCard.hidden = true;
    completeCard.hidden = false;
    updateMasteryCounters();
    renderMasteryKnownItems();
    return;
  }

  completeCard.hidden = true;
  questionCard.hidden = false;

  masteryCurrentQuestion = masteryQueue[0];
  const question = masteryCurrentQuestion;
  if (!question) return;

  const questionCounter = document.getElementById('mastery-question-counter');
  const questionType = document.getElementById('mastery-question-type');
  const questionText = document.getElementById('mastery-question-text');
  const optionsContainer = document.getElementById('mastery-options');
  const checkButton = document.getElementById('mastery-check-btn');
  const dontKnowButton = document.getElementById('mastery-dont-know-btn');
  const nextButton = document.getElementById('mastery-next-btn');

  if (questionCounter) {
    questionCounter.textContent = `Learning queue: ${masteryQueue.length} remaining`;
  }
  if (questionType) {
    questionType.textContent = Array.isArray(question.correctAnswer) ? 'Multiple answer' : 'Single answer';
  }
  if (questionText) {
    questionText.textContent = question.question;
  }

  if (!optionsContainer) return;

  optionsContainer.innerHTML = '';
  const isMultiAnswer = Array.isArray(question.correctAnswer);

  question.options.forEach((optionText) => {
    const optionLetter = extractOptionLetter(optionText);
    const label = document.createElement('label');
    label.className = 'mastery-option';
    label.dataset.letter = optionLetter;

    const input = document.createElement('input');
    input.type = isMultiAnswer ? 'checkbox' : 'radio';
    input.name = isMultiAnswer ? `mastery-option-${question._id}` : 'mastery-option';
    input.value = optionLetter;

    const text = document.createElement('span');
    text.textContent = optionText;

    input.addEventListener('change', () => {
      updateMasteryOptionSelectionState();
    });

    label.appendChild(input);
    label.appendChild(text);
    optionsContainer.appendChild(label);
  });

  updateMasteryOptionSelectionState();
  masteryCurrentResolution = '';

  if (checkButton) checkButton.disabled = false;
  if (dontKnowButton) dontKnowButton.disabled = false;
  if (nextButton) nextButton.hidden = true;

  setMasteryFeedback(`Select ${isMultiAnswer ? 'one or more options' : 'one option'} and click Check Answer.`, 'info');
  updateMasteryCounters();
  renderMasteryKnownItems();
}

function resolveMasteryCurrentQuestionAs(shouldMaster) {
  if (!masteryQueue.length) return;
  const current = masteryQueue.shift();
  if (!current) return;

  if (!shouldMaster) {
    masteryQueue.push(current);
  }

  masteryCurrentQuestion = masteryQueue.length ? masteryQueue[0] : null;
}

function handleMasteryCheckAnswer() {
  if (!masteryCurrentQuestion) return;

  const answer = getMasteryCurrentAnswer();
  if (!isAnswered(answer)) {
    setMasteryFeedback("Select an option first, or click \"I don't know yet\".", 'error');
    return;
  }

  masterySessionAttempts += 1;
  const isCorrect = isAnswerCorrect(masteryCurrentQuestion, answer);
  revealMasteryAnswer(answer);

  const checkButton = document.getElementById('mastery-check-btn');
  const dontKnowButton = document.getElementById('mastery-dont-know-btn');
  const nextButton = document.getElementById('mastery-next-btn');

  if (checkButton) checkButton.disabled = true;
  if (dontKnowButton) dontKnowButton.disabled = true;
  if (nextButton) nextButton.hidden = false;

  if (isCorrect) {
    masteryCurrentResolution = 'correct';
    masteryCorrectStreak += 1;
    masterySessionCorrect += 1;
    masteryKnown[masteryCurrentQuestion._id] = true;
    saveMasteryProgress();
    setMasteryFeedback(`Correct. Moved to mastered list. Streak: ${masteryCorrectStreak}.`, 'success');
  } else {
    masteryCurrentResolution = 'wrong';
    masteryCorrectStreak = 0;
    const explanation = buildQuestionExplanation(masteryCurrentQuestion);
    setMasteryFeedback(`Not correct. ${explanation}`, 'error');
  }

  updateMasteryCounters();
  renderMasteryKnownItems();
}

function handleMasteryDontKnow() {
  if (!masteryQueue.length) return;

  masterySessionAttempts += 1;
  masteryCorrectStreak = 0;

  resolveMasteryCurrentQuestionAs(false);
  renderMasteryQuestion();
  setMasteryFeedback('No problem. This question remains in your learning queue.', 'info');
}

function handleMasteryNextQuestion() {
  if (!masteryQueue.length) return;

  resolveMasteryCurrentQuestionAs(masteryCurrentResolution === 'correct');
  masteryCurrentResolution = '';
  renderMasteryQuestion();
}

function handleMasteryShuffleQueue() {
  if (masteryQueue.length < 2) {
    setMasteryFeedback('Queue is too short to shuffle right now.', 'info');
    return;
  }

  const currentQuestionId = masteryCurrentQuestion ? masteryCurrentQuestion._id : '';
  shuffleArrayInPlace(masteryQueue);

  if (currentQuestionId) {
    const idx = masteryQueue.findIndex(question => question._id === currentQuestionId);
    if (idx > 0) {
      [masteryQueue[0], masteryQueue[idx]] = [masteryQueue[idx], masteryQueue[0]];
    }
  }

  renderMasteryQuestion();
  setMasteryFeedback('Learning queue shuffled.', 'info');
}

function resetMasteryProgress() {
  masteryKnown = {};
  masterySessionAttempts = 0;
  masterySessionCorrect = 0;
  masteryCorrectStreak = 0;
  saveMasteryProgress();
  buildMasteryQueue();
  renderMasteryQuestion();
}

function handleMasteryResetProgress() {
  if (!window.confirm('Reset all mastered questions for the current user?')) return;
  resetMasteryProgress();
}

function bindMasteryControls() {
  if (masteryControlsBound) return;

  const checkButton = document.getElementById('mastery-check-btn');
  const dontKnowButton = document.getElementById('mastery-dont-know-btn');
  const nextButton = document.getElementById('mastery-next-btn');
  const shuffleButton = document.getElementById('mastery-shuffle-btn');
  const resetButton = document.getElementById('mastery-reset-btn');
  const restartButton = document.getElementById('mastery-restart-btn');

  if (checkButton) checkButton.addEventListener('click', handleMasteryCheckAnswer);
  if (dontKnowButton) dontKnowButton.addEventListener('click', handleMasteryDontKnow);
  if (nextButton) nextButton.addEventListener('click', handleMasteryNextQuestion);
  if (shuffleButton) shuffleButton.addEventListener('click', handleMasteryShuffleQueue);
  if (resetButton) resetButton.addEventListener('click', handleMasteryResetProgress);
  if (restartButton) restartButton.addEventListener('click', () => {
    resetMasteryProgress();
  });

  masteryControlsBound = true;
}

async function initMasteryPage() {
  const container = document.getElementById('mastery-mode-page');
  if (!container) return;

  const loadingCard = document.getElementById('mastery-loading');
  const questionCard = document.getElementById('mastery-question-card');
  const completeCard = document.getElementById('mastery-complete-card');

  bindMasteryControls();

  if (loadingCard) {
    loadingCard.hidden = false;
    loadingCard.className = 'card static-card mastery-loading-card';
    loadingCard.textContent = 'Loading question bank...';
  }
  if (questionCard) questionCard.hidden = true;
  if (completeCard) completeCard.hidden = true;

  try {
    masteryQuestions = await loadMasteryQuestionBank();
    masteryQuestionsById = new Map(masteryQuestions.map(question => [question._id, question]));

    masteryKnown = loadMasteryProgress();
    Object.keys(masteryKnown).forEach((questionId) => {
      if (!masteryQuestionsById.has(questionId)) {
        delete masteryKnown[questionId];
      }
    });
    saveMasteryProgress();

    buildMasteryQueue();
    updateMasteryCounters();
    renderMasteryKnownItems();
    renderMasteryQuestion();
  } catch (error) {
    if (loadingCard) {
      loadingCard.hidden = false;
      loadingCard.className = 'card static-card mastery-loading-card';
      loadingCard.textContent = `Could not load mastery questions. ${error && error.message ? error.message : ''}`.trim();
    }
    if (questionCard) questionCard.hidden = true;
    if (completeCard) completeCard.hidden = true;
  }
}

async function bootstrapApp() {
  await initAuthClient();
  if (!applyRouteGuard()) return;

  initTopNavigation();
  initLandingPage();
  initLoginPage();
  initRegisterPage();
  initDashboardPage();
  initExamPage();
  initKeyConceptsPage();
  initExamTipsPage();
  initMasteryPage();

  if (document.getElementById('vocab-list')) {
    loadVocabulary();
  }
  if (document.getElementById('flashcard')) {
    initFlashcards();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();
});
