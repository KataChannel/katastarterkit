# 🎯 Root Path Configuration - Visual Guide

**Date**: October 24, 2025

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  http://localhost:13000/                                   │
│            ↓                                                │
│  ┌────────────────────────────────────────────────────┐   │
│  │  src/app/page.tsx                                 │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ 1. Load page                                │ │   │
│  │  │ 2. useEffect triggers                       │ │   │
│  │  │ 3. Check siteConfig.rootRedirect            │ │   │
│  │  │ 4. If !== '/', router.push(rootRedirect)   │ │   │
│  │  │ 5. Show loading screen                      │ │   │
│  │  │ 6. Navigate to configured page              │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                 ↓                                    │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  src/config/site.config.ts                   │ │   │
│  │  │                                              │ │   │
│  │  │  export const siteConfig = {                 │ │   │
│  │  │    rootRedirect: '/website',  ← Change this  │ │   │
│  │  │    ...                                       │ │   │
│  │  │  }                                           │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                 ↓                                    │   │
│  │  http://localhost:13000/website                     │   │
│  │                                                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Diagram

```
User Access
    ↓
http://localhost:13000/
    ↓
Load src/app/page.tsx
    ↓
useEffect Hook Triggered
    ↓
┌─── Check Condition ───┐
│                       │
rootRedirect     rootRedirect
  === '/'         !== '/'
  │                  │
  ↓                  ↓
Show           router.push(
Dashboard      rootRedirect)
              │
              ↓
         Show Loading Screen
              │
              ↓
         Redirect Complete
              │
              ↓
         Load New Page
```

---

## 📁 File Structure

```
frontend/src/
│
├── config/
│   └── site.config.ts ................... Configuration file
│       ├── rootRedirect: '/website'
│       ├── name: 'Kata Office'
│       ├── navigation
│       └── features
│
└── app/
    ├── page.tsx ......................... Root page (Updated)
    │   ├── useRouter hook
    │   ├── useEffect redirect
    │   └── Loading screen
    │
    ├── website/
    │   ├── page.tsx ..................... Website page
    │   └── ...
    │
    ├── admin/
    │   ├── page.tsx ..................... Admin page
    │   └── ...
    │
    ├── lms/
    │   ├── page.tsx ..................... LMS page
    │   └── ...
    │
    └── ketoan/
        ├── page.tsx ..................... Accounting page
        └── ...
```

---

## 🎛️ Configuration Options

```
rootRedirect: '/website'  ─┬─→ http://localhost:13000/website
                          │
rootRedirect: '/admin'    ─┼─→ http://localhost:13000/admin
                          │
rootRedirect: '/lms'      ─┼─→ http://localhost:13000/lms
                          │
rootRedirect: '/ketoan'   ─┼─→ http://localhost:13000/ketoan
                          │
rootRedirect: '/'         ─┴─→ http://localhost:13000/ (No redirect)
```

---

## ⚡ Loading Screen States

### State 1: Initial Load (SSR)
```
┌─────────────────────────────────┐
│  Connecting...                  │
│  Preparing page...              │
└─────────────────────────────────┘
```

### State 2: Redirect Triggered (Client-side)
```
┌─────────────────────────────────┐
│                                 │
│        🔄 (Spinning)            │
│                                 │
│ Đang chuyển hướng tới           │
│ /website...                     │
│                                 │
└─────────────────────────────────┘
```

### State 3: Page Loaded
```
┌─────────────────────────────────┐
│  Website Page Content           │
│  - Sidebar                      │
│  - Products                     │
│  - etc.                         │
└─────────────────────────────────┘
```

---

## 🔀 Redirect Scenarios

### Scenario 1: Website as Root
```
User Visit         Internal       Final Page
─────────────      ────────       ──────────
http://localhost   Check config:  http://localhost
     :13000/   →   rootRedirect   :13000/website
                   = '/website'

Timeline:
0s ─── 0.1s ──── 0.2s ──── 0.5s
Load  Check   Redirect  Show page
     Config
```

### Scenario 2: Admin as Root
```
User Visit         Internal       Final Page
─────────────      ────────       ──────────
http://localhost   Check config:  http://localhost
     :13000/   →   rootRedirect   :13000/admin
                   = '/admin'
```

### Scenario 3: No Redirect
```
User Visit         Internal       Final Page
─────────────      ────────       ──────────
http://localhost   Check config:  http://localhost
     :13000/   →   rootRedirect   :13000/
                   = '/' → Skip
```

---

## 📊 Decision Tree

```
                    User accesses /
                          ↓
                   ┌──────────────┐
                   │ page.tsx     │
                   │ mounts       │
                   └──────────────┘
                          ↓
                   ┌──────────────────────┐
                   │ useEffect triggers   │
                   └──────────────────────┘
                          ↓
            ┌─────────────────────────────┐
            │ Is rootRedirect set?        │
            └──────┬──────────────┬───────┘
                  NO              YES
                   │               │
                   ↓               ↓
            Show Current     ┌──────────────────┐
            Dashboard        │ Is rootRedirect  │
                            │ !== '/'?         │
                            └──┬───────────┬───┘
                              NO          YES
                               │           │
                               ↓           ↓
                          Show      Show Loading
                          Current   Screen
                          Page            │
                                    ↓
                              router.push(
                              rootRedirect)
                                    │
                                    ↓
                              Load New Page
```

---

## 🔧 Customization Example

### Before (No Configuration)
```typescript
// Root always shows dashboard
http://localhost:13000/
```

### After (With Configuration)
```typescript
// src/config/site.config.ts
export const siteConfig = {
  rootRedirect: '/website',  ← Change this value
  // ...
};

// Result:
// http://localhost:13000/ → http://localhost:13000/website
```

---

## 🚀 Implementation Checklist

```
┌─────────────────────────────────────────────────┐
│  Root Path Configuration Implementation        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✅ Create config file                         │
│     └─ frontend/src/config/site.config.ts     │
│                                                 │
│  ✅ Update page.tsx                            │
│     ├─ Import useRouter                        │
│     ├─ Import useEffect                        │
│     ├─ Import siteConfig                       │
│     ├─ Add redirect logic                      │
│     └─ Add loading screen                      │
│                                                 │
│  ✅ Test locally                               │
│     ├─ npm run dev                             │
│     ├─ Visit http://localhost:13000           │
│     └─ Verify redirect works                   │
│                                                 │
│  ✅ Documentation created                      │
│     ├─ Configuration guide                     │
│     ├─ Quick reference                         │
│     └─ Implementation summary                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 💾 Configuration Hierarchy

```
siteConfig
│
├── rootRedirect ........................ Root path redirect
│   └─ Values: '/website', '/admin', '/lms', '/ketoan', '/'
│
├── name .............................. App name
│   └─ Default: 'Kata Office'
│
├── description ....................... App description
│   └─ Default: 'E-commerce & Business Platform'
│
├── navigation ........................ Navigation config
│   └─ main: Array of nav items
│
└── features .......................... Feature flags
    ├─ enableWebsite .................. Boolean
    ├─ enableAdmin .................... Boolean
    ├─ enableLMS ...................... Boolean
    └─ enableKeToan ................... Boolean
```

---

## 🔍 Detailed Flow

```
┌──────────────────────────────────────────────────────────────┐
│                  Complete Request Flow                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. HTTP Request                                             │
│     GET http://localhost:13000/                             │
│                                                              │
│  2. Server Process                                           │
│     ↓                                                        │
│     Route: src/app/page.tsx                                 │
│     ↓                                                        │
│     Component: Home()                                       │
│                                                              │
│  3. Client-side Initialization                              │
│     ↓                                                        │
│     'use client' directive                                  │
│     ↓                                                        │
│     Import modules:                                         │
│       - useRouter                                           │
│       - useEffect                                           │
│       - siteConfig                                          │
│                                                              │
│  4. Component Mount                                          │
│     ↓                                                        │
│     State initialization:                                   │
│       - selectedVote                                        │
│       - currentQuote                                        │
│       - currentTime                                         │
│       - mounted                                             │
│       - router                                              │
│                                                              │
│  5. Effect Hook Execution                                    │
│     ↓                                                        │
│     useEffect(() => {                                       │
│       if (siteConfig.rootRedirect                           │
│           && siteConfig.rootRedirect !== '/'              │
│       ) {                                                   │
│         router.push(siteConfig.rootRedirect)               │
│       }                                                     │
│     }, [router])                                            │
│                                                              │
│  6. Conditional Render                                       │
│     ↓                                                        │
│     if (redirect && !mounted) return <Loading />            │
│     else return <Dashboard /> or <MainPage />               │
│                                                              │
│  7. Navigation                                               │
│     ↓                                                        │
│     Browser redirect to:                                    │
│     http://localhost:13000/website                          │
│                                                              │
│  8. New Route Load                                           │
│     ↓                                                        │
│     Route: src/app/website/page.tsx                         │
│     ↓                                                        │
│     Display Website Page                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timeline

```
Event                          Time      Duration
─────────────────────────────────────────────────
HTTP Request                   0ms       
Server Processing              0-50ms    ~50ms
Client Hydration               50-100ms  ~50ms
useEffect Hook Trigger         100ms     
Config Check                   100-110ms ~10ms
router.push()                  110ms     
Loading Screen Render          110-150ms ~40ms
Navigation Processing          150-200ms ~50ms
New Page Load                  200-500ms ~300ms
Page Render Complete           500ms+    
```

---

**Created**: October 24, 2025  
**Status**: ✅ Complete  
**Version**: 1.0
