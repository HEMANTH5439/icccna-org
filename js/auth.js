// Authentication Manager
(function() {
  const CURRENT_USER_KEY = 'icccna_user';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch(e) { return null; }
  }

  function setUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    updateUI();
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    updateUI();
  }

  function updateUI() {
    const container = document.getElementById('auth-nav-container');
    if (!container) return;

    const user = getUser();
    if (user) {
      container.innerHTML = `
        <div class="user-profile-badge">
          <span>👤 ${user.name || user.email}</span>
          <button class="btn-logout" id="auth-logout-btn">Logout</button>
        </div>
      `;
      document.getElementById('auth-logout-btn').addEventListener('click', logout);
    } else {
      container.innerHTML = `
        <button class="btn-login-trigger" id="auth-open-btn">🔑 Member Login</button>
      `;
      document.getElementById('auth-open-btn').addEventListener('click', openModal);
    }
  }

  function openModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  }

  function injectModalHTML() {
    if (document.getElementById('auth-modal')) return;

    const modalHTML = `
      <div id="auth-modal" class="auth-modal-overlay">
        <div class="auth-modal-box">
          <div class="auth-modal-header">
            <button class="auth-modal-close" id="auth-close-btn">&times;</button>
            <h3>ICCCNA Portal</h3>
          </div>
          <div class="auth-modal-body">
            <div class="auth-tabs">
              <button class="auth-tab active" id="tab-login">Sign In</button>
              <button class="auth-tab" id="tab-register">Register</button>
            </div>
            <form id="auth-form-login">
              <div class="auth-form-group">
                <label>Email Address</label>
                <input type="email" id="login-email" placeholder="member@icccna.org" required>
              </div>
              <div class="auth-form-group">
                <label>Password</label>
                <input type="password" id="login-password" placeholder="••••••••" required>
              </div>
              <button type="submit" class="auth-submit-btn">Sign In</button>
            </form>
            <form id="auth-form-register" style="display:none;">
              <div class="auth-form-group">
                <label>Full Name</label>
                <input type="text" id="reg-name" placeholder="John Doe" required>
              </div>
              <div class="auth-form-group">
                <label>Email Address</label>
                <input type="email" id="reg-email" placeholder="member@icccna.org" required>
              </div>
              <div class="auth-form-group">
                <label>Password</label>
                <input type="password" id="reg-password" placeholder="••••••••" required>
              </div>
              <button type="submit" class="auth-submit-btn">Create Account</button>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('auth-close-btn').addEventListener('click', closeModal);
    document.getElementById('auth-modal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');
    const formLogin = document.getElementById('auth-form-login');
    const formReg = document.getElementById('auth-form-register');

    tabLogin.addEventListener('click', function() {
      tabLogin.classList.add('active');
      tabReg.classList.remove('active');
      formLogin.style.display = 'block';
      formReg.style.display = 'none';
    });

    tabReg.addEventListener('click', function() {
      tabReg.classList.add('active');
      tabLogin.classList.remove('active');
      formReg.style.display = 'block';
      formLogin.style.display = 'none';
    });

    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      setUser({ email: email, name: email.split('@')[0] });
      closeModal();
    });

    formReg.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      setUser({ name: name, email: email });
      closeModal();
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    injectModalHTML();
    updateUI();
  });
})();
