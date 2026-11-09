<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Keep every payment-creation and payment-status call inside `src/lib/payments.ts`; pages must only consume the `Payment` object it returns, so a real payment gateway can be swapped in at that single point without touching the UI.

- Hotmart checkout config (offer code, script loader) lives only in `src/lib/hotmart.ts`; the `/checkout` page consumes it so the offer code changes in one place.
