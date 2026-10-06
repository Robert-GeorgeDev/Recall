La Octom vrem ca serviciul să poată fi utilizat de cât mai multe persoane, indiferent de modul în care interacționează cu dispozitivul sau cu interfața.

Încercăm să construim interfața astfel încât să fie utilizabilă inclusiv de persoanele care navighează cu tastatura, utilizează un cititor de ecran, folosesc funcții de mărire a textului sau accesează serviciul de pe dispozitive cu ecrane de dimensiuni diferite.

Accesibilitatea este un proces continuu, iar această pagină descrie abordarea noastră actuală.

## 1. Ce facem

În dezvoltarea Octom urmărim principii de accesibilitate precum:

### Structură semantică

Folosim, acolo unde este posibil, elemente HTML semantice și o structură logică a paginilor.

Titlurile, secțiunile, formularele, butoanele și controalele interactive sunt concepute pentru a putea fi identificate și utilizate mai ușor de persoane și tehnologii asistive.

### Navigare cu tastatura

Urmărim ca funcționalitățile principale ale serviciului să poată fi utilizate fără a fi necesară folosirea mouse-ului.

Elementele interactive trebuie să poată primi focus și să aibă o ordine de navigare logică.

### Indicatori vizibili de focus

Elementele interactive trebuie să aibă stări de focus vizibile, astfel încât utilizatorii care navighează cu tastatura să poată identifica elementul activ.

### Formulare și etichete

Încercăm să oferim etichete și instrucțiuni clare pentru câmpurile de formular și să asociem corect mesajele de eroare cu câmpurile relevante.

### Contrast și lizibilitate

Alegem culori și combinații vizuale ținând cont de lizibilitatea textului și de diferențierea elementelor importante.

Nu ne bazăm exclusiv pe culoare pentru transmiterea informațiilor esențiale atunci când este posibil să oferim o alternativă accesibilă.

### Reflow și dispozitive mobile

Interfața este concepută să funcționeze pe dimensiuni diferite de ecran și să permită utilizarea serviciului pe dispozitive mobile.

Urmărim ca informațiile și funcționalitățile principale să rămână accesibile atunci când utilizatorul mărește conținutul sau utilizează un ecran de dimensiuni reduse.

### Mișcare și animații

Acolo unde utilizăm animații sau efecte de mișcare, încercăm să respectăm preferința sistemului pentru reducerea mișcării (`prefers-reduced-motion`).

Atunci când dispozitivul sau browserul indică faptul că utilizatorul preferă reducerea mișcării, anumite animații și tranziții pot fi reduse sau eliminate.

### Mesaje și stări ale interfeței

Încercăm să facem vizibile și ușor de înțeles stările importante ale aplicației, precum:

* încărcarea;
* succesul unei operațiuni;
* erorile;
* validarea formularelor;
* confirmările;
* acțiunile care modifică sau șterg date.

---

## 2. Standardele pe care le urmărim

În proiectarea și dezvoltarea Octom urmărim principiile **Web Content Accessibility Guidelines (WCAG)**.

Obiectivul nostru este să ne apropiem de nivelul **WCAG 2.1 AA** pentru componentele relevante ale serviciului.

WCAG oferă recomandări privind accesibilitatea conținutului web și acoperă aspecte precum:

* posibilitatea de percepere a informațiilor;
* operabilitatea interfeței;
* înțelegerea conținutului și a interacțiunilor;
* compatibilitatea cu tehnologii asistive.

Urmărirea acestor principii nu înseamnă că toate componentele Octom sunt în prezent conforme cu fiecare criteriu WCAG.

---

## 3. Unde suntem

Accesibilitatea Octom este îmbunătățită continuu.

În prezent, **nu am efectuat un audit independent complet de accesibilitate** și nu declarăm că Octom este complet conform cu WCAG 2.1 AA.

Pot exista componente, pagini sau situații în care experiența de utilizare nu este încă optimă pentru anumite persoane sau tehnologii asistive.

De asemenea, accesibilitatea poate fi influențată de:

* browser;
* sistemul de operare;
* dispozitiv;
* tehnologia asistivă utilizată;
* configurația utilizatorului;
* servicii sau componente furnizate de terți.

Atunci când identificăm probleme de accesibilitate, încercăm să le evaluăm și să le remediem în funcție de gravitate și impact.

---

## 4. Limitele actuale

Deși depunem eforturi pentru îmbunătățirea accesibilității, nu putem garanta că fiecare componentă a serviciului va fi accesibilă tuturor utilizatorilor în orice combinație de dispozitiv, browser și tehnologie asistivă.

Anumite funcționalități noi sau aflate în dezvoltare pot avea probleme de accesibilitate care nu au fost încă identificate.

Serviciile și conținutul furnizate de terți pot avea, de asemenea, propriile limitări de accesibilitate care nu se află în totalitate sub controlul nostru.

---

## 5. Spune-ne despre o problemă

Feedbackul utilizatorilor ne ajută să identificăm probleme pe care testarea internă poate să nu le detecteze.

Dacă întâmpini o problemă de accesibilitate, te rugăm să ne contactezi la:

**[contact@octom.eu](mailto:contact@octom.eu)**

Poți utiliza și formularul de contact disponibil pe site.

Dacă este posibil, include:

* pagina sau funcționalitatea unde apare problema;
* descrierea problemei;
* dispozitivul utilizat;
* browserul și versiunea acestuia;
* tehnologia asistivă utilizată, dacă este cazul;
* pașii necesari pentru reproducerea problemei;
* orice altă informație care ne-ar putea ajuta să înțelegem situația.

Nu este necesar să furnizezi date medicale sau alte informații sensibile pentru a raporta o problemă de accesibilitate.

Vom analiza feedbackul și vom încerca să remediem problemele identificate într-un termen rezonabil, în funcție de gravitate, impact și complexitatea tehnică.

Dacă o anumită funcționalitate îți creează dificultăți, ne poți contacta și pentru a solicita o modalitate alternativă de acces la informația sau funcția respectivă, atunci când acest lucru este posibil.

---

## Contact

Pentru probleme sau sugestii privind accesibilitatea:

**[contact@octom.eu](mailto:contact@octom.eu)**

Ne dorim ca Octom să devină mai accesibil pe măsură ce produsul evoluează și apreciem orice feedback care ne ajută să îmbunătățim experiența utilizatorilor.
