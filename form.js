  const ids = ['name', 'email', 'role', 'password'];

  const validators = {
    name:     v => v.trim().length >= 2,
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    role:     v => v !== '',
    password: v => v.length >= 8,
  };

  const state = { name: false, email: false, role: false, password: false };

  // Validate one field, return true/false
  function validate(id) {
    try {
      const el  = document.getElementById(id);
      const val = el.value;
      const ok  = validators[id](val);
      const err = document.getElementById(`${id}-err`);

      el.classList.toggle('err', !ok);
      el.classList.toggle('ok',   ok);
      err.classList.toggle('show', !ok);
      state[id] = ok;
    } catch (e) {
      state[id] = false;
    }
    updateProgress();
    updateBtn();
  }

  // Progress bar — one segment per field
  function updateProgress() {
    ids.forEach((id, i) => {
      document.getElementById(`s${i}`).classList.toggle('done', state[id]);
    });
  }

  // Enable submit only when all fields valid
  function updateBtn() {
    document.getElementById('submit-btn').disabled = !ids.every(id => state[id]);
  }

  // Password strength meter
  document.getElementById('password').addEventListener('input', function () {
    const pw = this.value;
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const cls   = ['', 'weak', 'weak', 'fair', 'strong'];
    const label = ['Enter a password', 'Weak', 'Fair', 'Strong', 'Very strong'];

    for (let i = 0; i < 4; i++) {
      const bar = document.getElementById(`b${i}`);
      bar.className = 'bar' + (i < score ? ` ${cls[score]}` : '');
    }
    document.getElementById('bar-label').textContent = pw ? label[score] : label[0];

    if (document.getElementById('password').classList.contains('err')) validate('password');
    updateProgress();
    updateBtn();
  });

  // Blur + re-check on input if already errored
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur',  () => { if (el.value) validate(id); });
    el.addEventListener('input', () => { if (el.classList.contains('err')) validate(id); updateProgress(); updateBtn(); });
    el.addEventListener('change', () => validate(id)); // for select
  });

  // Submit
  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    ids.forEach(validate);
    if (!ids.every(id => state[id])) return;

    try {
      const payload = {
        name:     document.getElementById('name').value.trim(),
        email:    document.getElementById('email').value.trim(),
        role:     document.getElementById('role').value,
        password: '[REDACTED]',
        at:       new Date().toISOString(),
      };
      console.log('Submitted:', payload);

      document.getElementById('form-wrap').style.display = 'none';
      document.getElementById('success').classList.add('show');
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  });

  // Reset
  document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('form').reset();
    ids.forEach(id => {
      document.getElementById(id).classList.remove('err', 'ok');
      document.getElementById(`${id}-err`).classList.remove('show');
      state[id] = false;
    });
    for (let i = 0; i < 4; i++) document.getElementById(`b${i}`).className = 'bar';
    document.getElementById('bar-label').textContent = 'Enter a password';
    updateProgress();
    updateBtn();
  });

  // Send another
  document.getElementById('again').addEventListener('click', () => {
    document.getElementById('form-wrap').style.display = 'block';
    document.getElementById('success').classList.remove('show');
    document.getElementById('reset-btn').click();
  });