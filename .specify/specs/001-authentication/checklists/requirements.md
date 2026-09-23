# Auth requirements checklist

- [x] Spec states login JSON shape
- [x] Spec states session cookie name and attributes
- [x] Spec states frontend must not write cookies
- [x] Spec states refresh is cookie-only (no Bearer required)
- [x] Spec states boot refresh + silent failure when logged out
- [x] Spec states 401 retry mutex
- [x] Spec states logout clears cookie
- [x] Local HTTP vs HTTPS `Secure` called out
- [x] Vite proxy / host-only `Domain` called out
- [ ] SC-001 cookie visible after login (blocked on backend T001)
- [ ] SC-003 reload stays authenticated
