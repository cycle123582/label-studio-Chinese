# Django QuerySet Iteration

For iterating over large Django QuerySets, use `iterate_queryset()` from `core.utils.iterators` instead of `.iterator()`:

```python
from core.utils.iterators import iterate_queryset

# Good
for obj in iterate_queryset(queryset):
    process(obj)

# Avoid
for obj in queryset.iterator():
    process(obj)
```

**Note:** `iterate_queryset()` doesn't preserve ordering - if order matters, don't use it.