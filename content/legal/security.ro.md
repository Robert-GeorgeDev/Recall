La Octom tratăm securitatea datelor ca parte integrantă a modului în care proiectăm și operăm serviciul.

Implementăm măsuri tehnice și organizatorice menite să protejeze conturile, datele și infrastructura Octom împotriva accesului neautorizat, pierderii, modificării sau divulgării neautorizate.

Niciun serviciu online nu poate garanta securitate absolută. Din acest motiv, această pagină descrie principalele măsuri pe care le utilizăm fără a constitui o garanție că serviciul va fi lipsit de vulnerabilități sau incidente de securitate.

## 1. Izolarea datelor

Octom este conceput astfel încât datele spațiilor de lucru să fie separate logic.

Accesul la date este controlat prin mecanisme de autorizare și reguli aplicate la nivelul bazei de date, astfel încât un utilizator să poată accesa numai datele pentru care are permisiune.

Pentru funcționalitățile bazate pe spații de lucru, apartenența utilizatorului la spațiul respectiv este verificată înainte de permiterea accesului la datele asociate acestuia.

Aceste mecanisme au rolul de a reduce riscul ca un utilizator să poată accesa accidental sau intenționat date aparținând unui alt spațiu de lucru.

---

## 2. Conexiuni criptate

Comunicațiile dintre browserul utilizatorului și infrastructura Octom sunt transmise prin conexiuni securizate **HTTPS/TLS**.

Acest lucru ajută la protejarea datelor în timpul transmiterii între dispozitivul utilizatorului și serviciile Octom.

De asemenea, conexiunile către furnizorii externi utilizați de Octom sunt realizate prin mecanisme securizate puse la dispoziție de furnizorii respectivi, acolo unde acestea sunt disponibile și aplicabile.

---

## 3. Autentificare și sesiuni

Autentificarea utilizatorilor și gestionarea credențialelor de autentificare sunt furnizate prin infrastructura **Supabase Authentication**.

Octom nu are acces la parola utilizatorului în format lizibil.

Accesul la cont este bazat pe mecanisme de autentificare și sesiune furnizate de infrastructura de autentificare.

Sesiunile de autentificare sunt utilizate pentru a determina dacă un utilizator este autentificat înainte de accesarea funcționalităților protejate.

Îți recomandăm să:

* utilizezi o parolă unică pentru Octom;
* nu comunici datele de autentificare altor persoane;
* te deconectezi de pe dispozitivele pe care nu le controlezi;
* ne contactezi dacă suspectezi acces neautorizat la cont.

---

## 4. Controlul accesului

Octom utilizează controale de acces pentru a limita accesul la date și funcționalități.

În funcție de rolul și apartenența utilizatorului, accesul poate fi limitat la anumite spații de lucru și funcționalități.

Operațiunile care pot avea efecte importante asupra contului sau datelor nu se bazează exclusiv pe interfața vizibilă în browser.

Acolo unde este aplicabil, autorizația este verificată și pe server înainte de executarea operațiunii.

---

## 5. Verificări pe server și API

Operațiunile efectuate prin API și operațiunile cu impact asupra datelor sunt supuse verificărilor de autorizare corespunzătoare.

Aceste verificări sunt importante în special pentru operațiuni precum:

* modificarea datelor;
* ștergerea datelor;
* ștergerea contului;
* gestionarea abonamentului;
* funcționalitățile AI;
* operațiunile administrative;
* alte acțiuni care pot afecta datele sau contul.

Nu considerăm interfața browserului drept un mecanism suficient de autorizare.

Permisiunile sunt verificate pe partea de server atunci când operațiunea și arhitectura serviciului o impun.

---

## 6. Protecția împotriva abuzurilor

Implementăm limite tehnice pentru anumite funcționalități pentru a reduce riscul de abuz, automatizare excesivă și utilizare neautorizată.

Aceste mecanisme pot include limitarea numărului de solicitări și alte controale tehnice.

În special, anumite funcționalități publice sau sensibile, precum asistentul AI și formularele publice, pot avea limite de utilizare.

Limitele pot fi ajustate în funcție de evoluția serviciului și de riscurile de securitate identificate.

În cazul identificării unei utilizări abuzive, putem limita temporar accesul la anumite funcționalități sau la cont, în conformitate cu Termenii și condițiile.

---

## 7. Plăți

Plățile pentru planurile plătite sunt procesate prin **Stripe**.

Datele complete ale cardului sunt introduse și procesate prin infrastructura Stripe și nu sunt stocate în baza de date Octom.

Octom primește și stochează numai informațiile necesare pentru administrarea abonamentului și evidența plăților, conform Politicii de confidențialitate.

Pentru mai multe informații despre modul în care sunt procesate plățile, consultă **Politica de facturare, anulare și rambursări**.

---

## 8. Backup și disponibilitate

Datele Octom sunt găzduite folosind infrastructura furnizorilor noștri de servicii.

În funcție de infrastructura și configurația utilizată, pot fi realizate copii de siguranță pentru recuperarea datelor în cazul unor incidente tehnice.

Backup-urile nu sunt considerate o alternativă la controalele de securitate și nu elimină complet riscul de pierdere a datelor.

Copiile de siguranță pot fi păstrate pentru o perioadă diferită de datele active, în conformitate cu politicile furnizorilor și cu configurația tehnică a serviciului.

---

## 9. Gestionarea incidentelor

Monitorizăm serviciul și infrastructura în măsura necesară pentru identificarea și investigarea problemelor tehnice și de securitate.

Dacă identificăm un incident de securitate care implică date cu caracter personal, vom evalua situația și vom lua măsurile prevăzute de legislația aplicabilă.

În cazul în care GDPR sau alte norme aplicabile impun notificarea unei autorități sau informarea utilizatorilor afectați, vom efectua notificările în termenele și condițiile prevăzute de lege.

Putem lua măsuri precum:

* limitarea temporară a accesului;
* izolarea componentelor afectate;
* revocarea sesiunilor sau a credențialelor compromise;
* investigarea cauzei incidentului;
* remedierea vulnerabilității;
* recuperarea serviciului;
* implementarea unor măsuri suplimentare de prevenire.

---

## 10. Raportarea vulnerabilităților

Dacă descoperi o posibilă vulnerabilitate de securitate în Octom, te rugăm să ne contactezi cât mai repede la:

**[contact@octom.eu](mailto:contact@octom.eu)**

Poți folosi și raportarea privată de vulnerabilități din fila „Security” a [repository-ului public](https://github.com/Robert-GeorgeDev/octom). Informațiile de contact sunt disponibile și în fișierul [security.txt](/.well-known/security.txt). Te rugăm să nu publici vulnerabilitatea înainte să o putem remedia.

Atunci când raportezi o vulnerabilitate, este util să incluzi:

* descrierea problemei;
* pașii necesari pentru reproducere;
* URL-ul sau componenta afectată;
* impactul observat;
* capturi de ecran sau exemple tehnice, atunci când acestea sunt relevante;
* orice alte informații care ne pot ajuta să verificăm problema.

Te rugăm să nu accesezi, copiezi, modifici sau divulgi date aparținând altor utilizatori.

Te rugăm, de asemenea, să nu efectuezi teste care pot afecta disponibilitatea serviciului sau datele altor utilizatori.

Atunci când raportezi cu bună-credință o vulnerabilitate, îți recomandăm să ne acorzi un termen rezonabil pentru investigare și remediere înainte de a face publice informațiile despre vulnerabilitate.

Nu solicita sau utiliza datele altor utilizatori pentru a demonstra existența unei vulnerabilități.

---

## Ce nu promitem

Securitatea este un proces continuu și nu poate fi garantată absolut.

Nu afirmăm că:

* Octom este complet lipsit de vulnerabilități;
* serviciul va fi disponibil permanent;
* niciun incident de securitate nu poate apărea;
* orice atac va fi detectat sau prevenit;
* datele nu pot fi pierdute în nicio circumstanță.

În schimb, ne angajăm să menținem și să îmbunătățim măsurile tehnice și organizatorice utilizate pentru protejarea serviciului și a datelor.

Pentru informații despre modul în care datele cu caracter personal sunt prelucrate, consultă **Politica de confidențialitate**.

---

## Contact

Pentru probleme de securitate:

**[contact@octom.eu](mailto:contact@octom.eu)**

Pentru probleme privind datele cu caracter personal, scrie-ne la aceeași adresă.
