# Șabloane email Octom (Supabase Auth)

Design premium, bilingv (RO implicit, EN când contul are `lang = en`).

## Cum le instalezi
Supabase Dashboard → **Authentication → Emails → Templates**. Pentru fiecare șablon: lipește conținutul fișierului HTML și setează subiectul de mai jos.

| Șablon Supabase | Fișier | Subiect (Subject) |
|---|---|---|
| Confirm signup | `confirm-signup.html` | Confirmă-ți contul Octom · Confirm your Octom account |
| Invite user | `invite-user.html` | Ai fost invitat în Octom · You're invited to Octom |
| Magic link | `magic-link.html` | Link-ul tău de autentificare Octom · Your Octom sign-in link |
| Change email address | `change-email.html` | Confirmă noua adresă de email · Confirm your new email address |
| Reset password | `reset-password.html` | Resetează-ți parola Octom · Reset your Octom password |
| Reauthentication | `reauthentication.html` | Codul tău de verificare Octom · Your Octom verification code |

Subiectele sunt statice în Supabase, de aceea sunt bilingve.

## Limba
La înregistrare, aplicația salvează `lang` în metadatele utilizatorului. Șabloanele folosesc `{{ .Data.lang }}`; dacă lipsește, se afișează în română.

## Setări necesare
- **Authentication → URL Configuration**: `Site URL` = domeniul real; la *Redirect URLs* adaugă `https://<domeniu>/reset-password` și `https://<domeniu>/**`.
- **Authentication → SMTP**: folosește Resend (domeniu verificat), altfel emailurile pleacă din serverul implicit, limitat și cu risc de spam.
- Testează cu o înregistrare reală și o resetare de parolă.

## Resetare parolă (important)
Șablonul `reset-password.html` folosește `{{ .SiteURL }}/reset-password?token_hash={{ .TokenHash }}&type=recovery`, nu `{{ .ConfirmationURL }}`. Tokenul se consumă doar când omul apasă „Continuă” pe site, deci scanerele de email (Gmail, Outlook) care deschid linkurile în avans nu îl mai strică ("otp_expired"). `Site URL` trebuie să fie exact adresa folosită de utilizatori (ex. `https://www.octom.eu`).
