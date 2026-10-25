import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  'https://lmfnttpkuicpqepphjas.supabase.co',
  'sb_publishable_yC8lnkiUdjwp-fWZEqN8gw_o8AFbyYp'
);


const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submitButton');
const guestButton = document.getElementById('guestButton');
const message = document.getElementById('message');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');

let mode = 'login';


function showMessage(text, isError = false) {
  if (!message) return;

  message.textContent = text;
  message.className = isError
    ? 'mt-4 text-sm text-red-400'
    : 'mt-4 text-sm text-brand';
}


function setMode(newMode) {
  mode = newMode;

  if (submitButton) {
    submitButton.textContent =
      mode === 'login' ? 'Sign In' : 'Create Account';
  }

  if (loginTab && signupTab) {
    loginTab.classList.toggle('bg-brand', mode === 'login');
    signupTab.classList.toggle('bg-brand', mode === 'signup');

    loginTab.classList.toggle('text-white', mode === 'login');
    signupTab.classList.toggle('text-white', mode === 'signup');

    loginTab.classList.toggle('text-zinc-400', mode !== 'login');
    signupTab.classList.toggle('text-zinc-400', mode !== 'signup');
  }

  showMessage('');
}

loginTab?.addEventListener('click', () => setMode('login'));
signupTab?.addEventListener('click', () => setMode('signup'));

// Email and password login / registration
authForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput?.value.trim();
  const password = passwordInput?.value;

  if (!email || !password) {
    showMessage('Please enter your email and password.', true);
    return;
  }

  if (password.length < 6 && mode === 'signup') {
    showMessage('Password must be at least 6 characters.', true);
    return;
  }

  submitButton.disabled = true;
  showMessage(mode === 'login' ? 'Signing in...' : 'Creating account...');

  try {
    let result;

    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({
        email,
        password
      });
    } else {
      result = await supabase.auth.signUp({
        email,
        password
      });
    }

    if (result.error) {
      throw result.error;
    }

    if (mode === 'signup' && !result.data.session) {
      showMessage('Account created! Check your email to confirm your account.');
      return;
    }

    const user = result.data.user;

    if (user) {
      showMessage('Welcome to ZEX! Your ID: ' + user.id);

      // When you create a dashboard, redirect here:
      // window.location.href = './dashboard.html';
    }
  } catch (error) {
    showMessage(error.message || 'Authentication failed.', true);
  } finally {
    submitButton.disabled = false;
  }
});

// Guest login
guestButton?.addEventListener('click', async () => {
  guestButton.disabled = true;
  showMessage('Creating guest account...');

  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw error;
    }

    const guestId = data.user.id;

    showMessage('Welcome to ZEX Guest! Your ID: ' + guestId);

    // When you create a dashboard, redirect here:
    // window.location.href = './dashboard.html';
  } catch (error) {
    showMessage(
      error.message || 'Guest login failed. Check Supabase settings.',
      true
    );
  } finally {
    guestButton.disabled = false;
  }
});

// Check existing session
async function checkSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Session error:', error.message);
    return;
  }

  if (data.session) {
    console.log('Signed-in ZEX user:', data.session.user.id);
  }
}

checkSession();
