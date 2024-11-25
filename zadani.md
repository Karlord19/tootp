# Návrh na téma projektu

Bude se jednat o nový projekt, ne o začlenění autentizace do stávajícího projektu.

## Téma projektu

Stránka bude poskytovat autentizaci uživatelů díky TOTP.
Uživatelé se budou moct registrovat, načíst QR kód do své oblíbené aplikace.
Uživatelé se pak budou moct přihlásit pomocí vygenerovaného kódu.

### Registrace

Uživatel vyplní:

    - username
    - heslo
    - délku expirace kódu v sekundách

Pokud je username unikátní, registrace je úspěšná. Jinak je uživatel vyzván k vyplnění jiného username.

Do databáze uživatelů se uloží:

    - id
    - username
    - hash hesla
    - totp secret
    - délka expirace kódu v sekundách

Do databáze logu se uloží:

    - id uživatele
    - timestamp
    - zpráva o registraci

Uživateli se zobrazí QR kód, který si načte do své oblíbené aplikace.

### Přihlášení

Uživatel vyplní:

    - username
    - heslo

Ověří se heslo a zda uživatel existuje dle databáze uživatelů:

    - username
    - hash hesla

Do databáze logu se uloží:

    - id uživatele
    - timestamp
    - zpráva o pokusu o přihlášení s heslem
    - úspěšnost

Pokud je přihlášení úspěšné, uživatel vyplní:

    - kód z aplikace

Ověří se správnost kódu dle databáze uživatelů:

    - id
    - totp secret
    - délka expirace kódu v sekundách

Do databáze logu se uloží:

    - id uživatele
    - timestamp
    - zpráva o pokusu o přihlášení s kódem
    - úspěšnost

Pokud je kód nesprávný, uživatel dostane nový pokus.

Po úspěšném přihlášení se uživatel dostane na hlavní stránku, kde bude možné se odhlásit.

## Technologie

Aplikace bude napsána v Next.js.
Bude uložena v GitHubu a propojena s Vercel.
Tam bude možné ji vidět na veřejné URL.
Jako databáze bude použita Supabase.

Plán na použití knihoven:

    - `@supabase/supabase-js` pro komunikaci s databází
    - `otplib` pro generování TOTP kódu
    - `qrcode` pro generování QR kódu
    - `bcrypt` pro hashování hesel
    - `fetch` pro HTTP komunikaci
