# Șabloane email OCTOM One (Supabase Auth)

Design premium, bilingv (RO implicit, EN când contul are `lang = en`).

## Cum le instalezi
Supabase Dashboard → **Authentication → Emails → Templates**. Pentru fiecare șablon: lipește conținutul fișierului HTML și setează subiectul de mai jos.

| Șablon Supabase | Fișier | Subiect (Subject) |
|---|---|---|
| Confirm signup | `confirm-signup.html` | Confirmă-ți contul OCTOM One · Confirm your OCTOM One account |
| Invite user | `invite-user.html` | Ai fost invitat în OCTOM One · You're invited to OCTOM One |
| Magic link | `magic-link.html` | Link-ul tău de autentificare OCTOM One · Your OCTOM One sign-in link |
| Change email address | `change-email.html` | Confirmă noua adresă de email · Confirm your new email address |
| Reset password | `reset-password.html` | Resetează-ți parola OCTOM One · Reset your OCTOM One password |
| Reauthentication | `reauthentication.html` | Codul tău de verificare OCTOM One · Your OCTOM One verification code |

Subiectele sunt statice în Supabase, de aceea sunt bilingve.

## Limba
La înregistrare, aplicația salvează `lang` în metadatele utilizatorului. Șabloanele folosesc `{{ .Data.lang }}`; dacă lipsește, se afișează în română.

## Setări necesare
- **Authentication → URL Configuration**: `Site URL` = `https://one.octom.eu` (aplicația); la *Redirect URLs* adaugă `https://one.octom.eu/**` (poți păstra și `https://octom.eu/**`, `https://www.octom.eu/**`).
- **Authentication → SMTP**: folosește Resend (domeniu verificat), altfel emailurile pleacă din serverul implicit, limitat și cu risc de spam.
- Testează cu o înregistrare reală și o resetare de parolă.

## Resetare parolă (important)
Șablonul `reset-password.html` folosește `{{ .SiteURL }}/reset-password?token_hash={{ .TokenHash }}&type=recovery`, nu `{{ .ConfirmationURL }}`. Tokenul se consumă doar când omul apasă „Continuă” pe site, deci scanerele de email (Gmail, Outlook) care deschid linkurile în avans nu îl mai strică ("otp_expired"). `Site URL` trebuie să fie exact adresa folosită de utilizatori (`https://one.octom.eu`).
