import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfnttpkuicpqepphjas.supabase.co',
  'YOUR_SUPABASE_PUBLISHABLE_KEY'
);

async function continueAsGuest() {
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    alert('Guest login failed: ' + error.message);
    return;
  }

  const guestId = data.user.id;

  alert('Welcome, Guest!\nYour Guest ID: ' + guestId);
}
