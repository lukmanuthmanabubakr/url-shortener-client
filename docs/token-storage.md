# Token Storage Decision

## What we store, and where

- **Access token**: kept in memory only (a module-level variable in `src/api/tokenStore.ts`). Never written to localStorage, sessionStorage, or cookies.
- **Refresh token**: stored in `localStorage`, since it needs to survive a page reload.

## Why this split

The realistic threat for a project like this is XSS, a malicious or compromised script running on the page and reading whatever's in browser storage. `localStorage` is readable by any script on the page, so anything stored there is exposed if that ever happens.

Keeping the access token in memory only means it disappears the moment the page is closed or reloaded, and it's never sitting in a place a generic `localStorage.getItem` sweep could find it. The cost is that a page reload always requires a fresh token before the user can make an authenticated request again.

The refresh token has to live somewhere that survives a reload, or every page refresh would force a full logout. `localStorage` is where it lives. This is a real trade-off, not risk-free, but it's bounded: refresh tokens are single-use and rotated on every use (see backend contract), so even if one is read by an attacker's script, using it once invalidates it for legitimate reuse and rotation.

## The alternative we didn't pick

httpOnly cookies would fully close the XSS-read risk for the refresh token, since JavaScript can't read them at all. We didn't use this because it requires the backend to issue and read cookies instead of JSON tokens, a real backend contract change, not something to make unilaterally from the frontend. Worth revisiting if this were a production app handling real user data at scale.

## Rehydration on load

On app start, `AuthContext` checks `localStorage` for a refresh token. If one exists, it attempts a single silent refresh before resolving auth state, this is what lets a returning user's session survive a page reload without forcing a fresh login every time.