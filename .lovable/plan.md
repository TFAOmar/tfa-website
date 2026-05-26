## Goal
Host the two attached images at stable public URLs on tfawealthplanning.com so they can be embedded in an email via `<img src="...">`.

## Approach
Per project convention (email assets must live in `/public/images/` for stable, unhashed URLs), copy both uploads into the `public/images/` folder. Once published, they'll be accessible at permanent URLs on the canonical domain.

## Files to add
- `public/images/yacht-party-2026.png` (from `Yacht_Party_2026.PNG`)
- `public/images/tfa-stacked-logo.png` (from `stacked_logo.png`)

## Resulting URLs (after publish)
- Flyer: `https://tfawealthplanning.com/images/yacht-party-2026.png`
- Logo: `https://tfawealthplanning.com/images/tfa-stacked-logo.png`

## Email-ready HTML snippet I'll provide
```html
<a href="https://tfawealthplanning.com/images/yacht-party-2026.png">
  <img src="https://tfawealthplanning.com/images/yacht-party-2026.png" alt="Yacht Party 2026 — Newport Beach" width="600" style="display:block;max-width:100%;height:auto;" />
</a>

<img src="https://tfawealthplanning.com/images/tfa-stacked-logo.png" alt="The Financial Architects" width="240" style="display:block;height:auto;" />
```

## Note
URLs go live only after you publish. I'll remind you to hit Publish once the files are added.
