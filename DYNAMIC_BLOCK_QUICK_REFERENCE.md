# 🎯 Dynamic Block Quick Reference Card

**Print this and keep it handy!** ✅

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Seed demo data
cd backend && npx ts-node scripts/seed-dynamic-block-demo.ts

# 2. Start dev server
cd .. && bun run dev

# 3. Open browser
# http://localhost:3000 → Create Page → Add Dynamic Block
```

---

## 📊 Data Sources

| Source | When to Use | Example |
|--------|------------|---------|
| **Static** | Demo, static lists | Menu items, features |
| **API** | External endpoints | Weather, news feeds |
| **GraphQL** | Your backend | Custom queries |
| **Database** | Prisma tables | Products, users |

---

## 📝 Template Syntax

```handlebars
{{variable}}           # Output variable
{{#each array}}...{{/each}}  # Loop
{{#if condition}}...{{/if}}  # Conditional
```

### Examples
```html
<!-- Product Card -->
<div class="card">
  <h3>{{name}}</h3>
  <p>${{price}}</p>
</div>

<!-- List with Loop -->
<ul>
  {{#each items}}
  <li>{{title}}</li>
  {{/each}}
</ul>

<!-- Conditional Display -->
{{#if featured}}
<span class="badge">⭐ Featured</span>
{{/if}}
```

---

## ⚙️ Configuration Steps

### 1. Choose Data Source
- Select one: Static, API, GraphQL, Database

### 2. Configure Source (varies by type)
**Static:** Paste JSON object
```json
{"products": [{"name": "Item 1"}, {"name": "Item 2"}]}
```

**API:** Enter endpoint URL
```
https://api.example.com/products
```

**GraphQL:** Write query
```graphql
query {
  products {
    id name price
  }
}
```

**Database:** Select model
```
Model: Product
Filter: {"isActive": true}
```

### 3. Write Template
Use handlebars syntax with variable names from your data

### 4. Enable Repeater (if looping)
- Toggle: ON
- Data Path: "products" (or path to array in response)

### 5. Save & Preview
Click "Save" then "Preview" to test

---

## 🔥 Common Templates

### Product Grid
```html
<div class="grid grid-cols-3 gap-4">
  {{#each products}}
  <div class="border p-4 rounded">
    <img src="{{image}}" class="w-full h-40 object-cover">
    <h3 class="font-bold mt-2">{{name}}</h3>
    <p class="text-green-600 font-bold">${{price}}</p>
  </div>
  {{/each}}
</div>
```

### Testimonials
```html
<div class="space-y-4">
  {{#each testimonials}}
  <div class="border-l-4 border-blue-500 pl-4">
    {{#if featured}}
    <span class="badge">⭐ Featured</span>
    {{/if}}
    <p>{{quote}}</p>
    <p class="font-bold">— {{author}}</p>
  </div>
  {{/each}}
</div>
```

### Blog Posts
```html
{{#each posts}}
<article class="mb-6 pb-6 border-b">
  <h2 class="text-2xl font-bold">{{title}}</h2>
  <p class="text-gray-600 text-sm">{{date}}</p>
  <p>{{excerpt}}</p>
  <a href="/blog/{{slug}}" class="text-blue-600">Read More →</a>
</article>
{{/each}}
```

### Price Table
```html
<table class="w-full">
  <thead>
    <tr class="border-b bg-gray-100">
      <th class="p-2 text-left">Plan</th>
      <th class="p-2 text-right">Price</th>
      <th class="p-2 text-center">Users</th>
    </tr>
  </thead>
  <tbody>
    {{#each plans}}
    <tr class="border-b hover:bg-gray-50">
      <td class="p-2">{{name}}</td>
      <td class="p-2 text-right font-bold">${{price}}/mo</td>
      <td class="p-2 text-center">{{maxUsers}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>
```

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Variables not showing | Check spelling matches data |
| Loop not working | Verify "Enable Repeater" is ON, check Data Path |
| No data shows | Check data source endpoint/query works |
| Template errors | Verify all `{{` have closing `}}` |
| Icons missing | Check lucide-react is imported |

---

## 💡 Pro Tips

✅ **Use data path:** For nested data, use path like `"data.products"` or `"response.items"`

✅ **Test often:** Use "Preview" button frequently while editing

✅ **Validate JSON:** Paste data into jsonlint.com before using

✅ **Cache results:** Higher refresh interval = faster page loads

✅ **Limit items:** Use GraphQL `first: 10` or SQL `LIMIT 10` for performance

---

## 🎓 Learning Resources

| Resource | Time | Link |
|----------|------|------|
| Quick Start | 15 min | [DYNAMIC_BLOCK_QUICK_START.md](DYNAMIC_BLOCK_QUICK_START.md) |
| Full Guide | 1 hour | [DYNAMIC_BLOCK_GUIDE.md](DYNAMIC_BLOCK_GUIDE.md) |
| Documentation | 5 min | [DYNAMIC_BLOCK_INDEX.md](DYNAMIC_BLOCK_INDEX.md) |
| Verification | - | [DYNAMIC_BLOCK_VERIFICATION_CHECKLIST.md](DYNAMIC_BLOCK_VERIFICATION_CHECKLIST.md) |

---

## 📦 24 Available Block Types

**Content:** Text, Image, Video, Code, Rich Text, Divider  
**Layout:** Container, Grid, Section, FlexRow, FlexColumn  
**Utility:** Button, Spacer, Tab, Accordion, Card, Badge  
**Dynamic:** Dynamic Block ⭐

---

## 🚀 Next Steps

1. **Now:** Bookmark this card
2. **Next:** Read [DYNAMIC_BLOCK_QUICK_START.md](DYNAMIC_BLOCK_QUICK_START.md)
3. **Then:** Run seed script and test
4. **Finally:** Build your first Dynamic Block!

---

**Questions?** Check the docs or see troubleshooting above! 💪

*Keep building amazing things! 🎨*
