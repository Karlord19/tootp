# Dokumentace projektu tootp

Aplikace je dostupná na adrese [tootp.vercel.app](https://tootp.vercel.app/).

## Téma projektu

Jedná se nový projekt, který poskytuje autentizaci uživatelů díky TOTP.

## Struktura projektu

Projekt jde primárně dle struktury aplikace v Next.js.

- V adresáři `public` je ikona Vercelu.
- V adresáři `src/pages` jsou jednotlivé stránky aplikace.
- V adresáři `src/pages/api` jsou API endpointy.
- V adresáři `src/lib` jsou pomocné funkce, zde se jedná pouze o připojení k databázi.
- V adresáři `src/styles` jsou styly.
- V root adresáři jsou konfigurační soubory.

## Technologie

Projekt je napsán v jazyce JavaScript s využitím Next.js.
Jako databáze je využita Supabase.
Deployment je vyřešen pomocí GitHubu a Vercelu.

## Supabase

Vybíráme Supabase, protože je zdarma pro takovýto projekt a poskytuje všechny potřebné funkce.

### Schéma

Tabulky jsou ve schématu `tootp_users`.

Tabulka `users` obsahuje:

- `id` - uuid
- `username` - text
- `password` - text (hash hesla)
- `totp_secret` - text
- `totp_expiry` - int2 (délka expirace kódu v sekundách)
- `deleted` - bool (nakonec nepoužito)

Tabulka `log` obsahuje:

- `id` - uuid
- `user_id` - uuid (cizí klíč)
- `timestamp` - timestamp
- `message` - text (login/register)
- `success` - bool (úspěšnost akce)

### Připojení

Pro připojení k databázi je využita knihovna `@supabase/supabase-js`.
Soubor s připojením je [src/lib/supabase.ts](src/lib/supabase.ts).
V Supabase je vytvořen service key, který má plná práva pro čtení a zápis do schématu `tootp_users`, kde jsou uživatelé i logy.
Díky tomuto klíči může serverová část aplikace provádět operace nad databází, uživatelé žádná práva nemají.

## Vercel

Vybíráme Vercel, protože je zdarma pro takovýto projekt a poskytuje všechny potřebné funkce.
Je propojen s GitHubem s tímto repozitářem, při pushi se automaticky deployne.
V projektu jsou nastavené environment variables pro připojení k databázi.

### Home page

Soubor s domovskou stránkou je [src/pages/index.tsx](src/pages/index.tsx).
Domovská stránka nabízí odkazy na registraci a přihlášení.
Zobrazuje seznam uživatelů, který je načten z `api/users`.

V souboru [src/pages/api/users.ts](src/pages/api/users.ts) je endpoint, který se připojí k databázi a vrátí všechna uživatelská jména.

### Registrace

Soubor s registrační stránkou je [src/pages/register.tsx](src/pages/register.tsx).
Na začátku obsahuje formulář pro registraci.
Ten se pošle na endpoint `api/register`.
V případě neúspěchu se zobrazí chybová hláška.
V případě úspěchu endpoint vrátí QR kód, ten se zobrazí uživateli namísto formuláře.

Endpoint `api/register` je v souboru [src/pages/api/register.ts](src/pages/api/register.ts).
Zkontroluje validnost vstupních dat a zjistí, jestli uživatel s tímto jménem již neexistuje.
Heslo se zahashuje pomocí `bcrypt`.
Nastaví se expirace kódu a vygeneruje se TOTP secret pomocí `authenticator` z knihovny `otplib`.
Uživatel se vloží do databáze a registrace se zapíše do logu.
Pomocí `qrcode` se vygeneruje QR kód, který se vrátí z tohoto endpointu.

### Přihlášení

Soubor s přihlašovací stránkou je [src/pages/login.tsx](src/pages/login.tsx).
Na začátku obsahuje formulář se jménem a heslem.
To se pošle na endpoint `api/login-step1`.
V případě neúspěchu se zobrazí chybová hláška.
V případě úspěchu se zobrazí formulář pro zadání TOTP kódu.
Ten se pošle na endpoint `api/login-step2`.
Uživatel má neomezený počet pokusů na zadání údajů.
Po úspěšném přihlášení je uživatel přesměrován na jeho stránku, v souboru [src/pages/user.tsx](src/pages/user.tsx).
Odtam už se dá jen odhlásit.
Neřešíme zde už další obsah uživatelovy stránky ani nic víc.

Endpoint `api/login-step1` je v souboru [src/pages/api/login-step1.ts](src/pages/api/login-step1.ts).
Z databáze načte uživatele podle jména.
Pomocí `bcrypt` zkontroluje heslo.
Akci zaznamená do logu.

Endpoint `api/login-step2` je v souboru [src/pages/api/login-step2.ts](src/pages/api/login-step2.ts).
Dostane id uživatele, heslo a TOTP kód.
Z databáze načte uživatele podle id.
Pomocí `bcrypt` zkontroluje heslo a pomocí `authenticator` z `otplib` zkontroluje TOTP kód.
Akci zaznamená do logu.
V případě úspěchu se nastaví cookie s uživatelským jménem.

## Překonané problémy

Aplikace Authy nedovoluje jinou dobu expirace kódu než 30 sekund.
Stačí zvolit jinou aplikaci, která si při načtení QR kódu uloží i správnou dobu expirace.
Na stránce je přímo doporučena např. aplikace `Aegis Authenticator`.
