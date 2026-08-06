// Admin Authentication & Content Management System
(function() {
  const ADMIN_USERS = [
    {
      email: "chellamhemanth@gmail.com",
      name: "Hemanth Chellam",
      // SHA-256 hash for 'Pikachu'
      hash: "a7c280e773d1d2e4f243d88f2e1a5665aff97694f741cbd78ee9edf62954612c"
    }
  ];

  const SESSION_KEY = 'icccna_admin_session';

  async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch(e) { return null; }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    updateNavUI();
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    updateNavUI();
  }

  function updateNavUI() {
    const container = document.getElementById('auth-nav-container');
    if (!container) return;

    const session = getSession();
    if (session) {
      container.innerHTML = `
        <div class="user-profile-badge">
          <span>⚙️ Admin: ${session.name}</span>
          <button class="btn-logout" id="auth-logout-btn">Logout</button>
        </div>
      `;
      document.getElementById('auth-logout-btn').addEventListener('click', function() {
        clearSession();
        window.location.reload();
      });
    } else {
      container.innerHTML = `
        <button class="btn-login-trigger" id="auth-open-btn">Sign In</button>
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
            <h3>ICCCNA Admin Portal</h3>
          </div>
          <div class="auth-modal-body">
            <form id="auth-form-login">
              <div class="auth-form-group">
                <label>Admin Email</label>
                <input type="email" id="login-email" placeholder="chellamhemanth@gmail.com" required>
              </div>
              <div class="auth-form-group">
                <label>Password</label>
                <input type="password" id="login-password" placeholder="••••••••" required>
              </div>
              <div id="auth-error-msg" style="color:red; font-size:12px; margin-bottom:10px; display:none;"></div>
              <button type="submit" class="auth-submit-btn">Sign In to Dashboard</button>
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

    document.getElementById('auth-form-login').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;
      const errorDiv = document.getElementById('auth-error-msg');

      const passHash = await hashPassword(password);
      const matchedUser = ADMIN_USERS.find(u => u.email.toLowerCase() === email && u.hash === passHash);

      if (matchedUser) {
        errorDiv.style.display = 'none';
        setSession({ email: matchedUser.email, name: matchedUser.name });
        closeModal();
        // Enable live page inline editing for admin
        enableInlineEditing();
      } else {
        errorDiv.textContent = 'Invalid Admin Credentials.';
        errorDiv.style.display = 'block';
      }
    });
  }

  function enableInlineEditing() {
    const session = getSession();
    if (!session) return;

    // Make paragraphs and headings editable for logged in admin
    document.querySelectorAll('p, h1, h2, h3, span.style2').forEach(el => {
      el.contentEditable = true;
      el.style.outline = '1px dashed #0088cc';
    });

    if (!document.getElementById('admin-bar')) {
      const adminBar = `
        <div id="admin-bar" style="position:fixed; bottom:15px; right:15px; background:#0088cc; color:#fff; padding:10px 20px; border-radius:30px; box-shadow:0 4px 15px rgba(0,0,0,0.3); z-index:99999; font-family:sans-serif; font-size:13px;">
          ✍️ Admin Mode Active — Click any text to edit directly on screen!
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', adminBar);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    injectModalHTML();
    updateNavUI();
    enableInlineEditing();
  });
})();
