

## Plan: Add Calendly Link to Cayla Dee Porter's ScheduleModal

The `ScheduleModal` component already supports a `schedulingLink` prop — when provided, it opens the link after form submission. Currently, Cayla Dee's modal is missing this prop.

### Change — `src/pages/AdvisorCaylaDeePorter.tsx` (line 333–340)

Add `schedulingLink="https://calendly.com/cayladee"` to the `ScheduleModal` component:

```tsx
<ScheduleModal
  open={scheduleModalOpen}
  onOpenChange={setScheduleModalOpen}
  advisorName="Cayla Dee Porter"
  advisorEmail="cayladee@tfainsuranceadvisors.com"
  advisorImage={caylaDeePorterImg}
  advisorSlug="cayla-dee-porter"
  schedulingLink="https://calendly.com/cayladee"
/>
```

Also update the `schedulingLink` in `src/data/advisors.ts` for her directory entry if not already set.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/AdvisorCaylaDeePorter.tsx` | Add `schedulingLink` prop to ScheduleModal |
| `src/data/advisors.ts` | Confirm `schedulingLink` is set on her entry |

