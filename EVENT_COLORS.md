# Event Category Color System

## Overview

A comprehensive, centralized color system has been implemented for event categories throughout the Wendessen website. This provides consistent visual identification for different types of events across all components.

## Event Categories & Colors

### 🔵 **Sitzung** (Meeting)

-   **Background**: `bg-blue-500`
-   **Light Background**: `bg-blue-100`
-   **Text**: `text-blue-600`
-   **Icon**: 👥 (Users)
-   **Usage**: Official meetings, council sessions

### 🟢 **Veranstaltung** (Event)

-   **Background**: `bg-green-500`
-   **Light Background**: `bg-green-100`
-   **Text**: `text-green-600`
-   **Icon**: 🎉 (Calendar)
-   **Usage**: Community events, celebrations

### 🟠 **Sport** (Sports)

-   **Background**: `bg-orange-500`
-   **Light Background**: `bg-orange-100`
-   **Text**: `text-orange-600`
-   **Icon**: ⚽ (Zap/Lightning)
-   **Usage**: Sports events, tournaments

### 🟣 **Kultur** (Culture)

-   **Background**: `bg-purple-500`
-   **Light Background**: `bg-purple-100`
-   **Text**: `text-purple-600`
-   **Icon**: 🎭 (Music)
-   **Usage**: Cultural events, concerts, arts

### 🔴 **Notfall** (Emergency)

-   **Background**: `bg-red-500`
-   **Light Background**: `bg-red-100`
-   **Text**: `text-red-600`
-   **Icon**: 🚨 (Emergency emoji)
-   **Usage**: Emergency notices, urgent announcements

### ⚫ **Sonstiges** (Other)

-   **Background**: `bg-gray-500`
-   **Light Background**: `bg-gray-100`
-   **Text**: `text-gray-600`
-   **Icon**: 📅 (Calendar)
-   **Usage**: Default/miscellaneous events

## Implementation

### Central Utility File

**Location**: `lib/event-utils.ts`

The utility provides:

-   **Type-safe category definitions**
-   **Consistent color mappings**
-   **Multiple color variants** (solid, light, text, borders)
-   **German display names**
-   **Icon mappings**

### Key Functions

#### `getCategoryColors(category: EventCategory)`

Returns complete color object with all variants:

```typescript
{
    bg: 'bg-blue-500',           // Solid background
    bgLight: 'bg-blue-100',      // Light background
    text: 'text-blue-600',       // Text color
    textDark: 'text-blue-800',   // Dark text
    border: 'border-blue-200',   // Border color
    hover: 'hover:bg-blue-50',   // Hover state
}
```

#### `getCategoryBackgroundColor(category: string)`

Returns solid background color for calendar events.

#### `getCategoryBadgeClasses(category: string)`

Returns light background + text color combination for badges/chips.

#### `getCategoryDisplayName(category: string)`

Returns German display name (e.g., "sitzung" → "Sitzung").

#### `getCategoryIconEmoji(category: string)`

Returns emoji icon for the category.

## Updated Components

### 1. **Admin Events Calendar** (`app/admin/events/AdminEventsCalendar.tsx`)

-   ✅ **Calendar events** now use centralized colors
-   ✅ **Solid backgrounds** for calendar grid display
-   ✅ **Consistent with main events page**

### 2. **Events Page** (`app/was-steht-an/page.tsx`)

-   ✅ **Calendar view** uses centralized background colors
-   ✅ **List view** uses light background + text combinations
-   ✅ **Modal view** uses consistent badge styling
-   ✅ **Display names** use German translations
-   ✅ **All categories** including "notfall" are supported

### 3. **Database Integration** (`lib/database.ts`)

-   ✅ **Type definitions** include all 6 categories
-   ✅ **Consistent with utility functions**

## Visual Consistency

### Calendar Grid View

-   **Solid colors** for event blocks
-   **White text** for readability
-   **All 6 categories** properly colored

### List/Card View

-   **Light backgrounds** with colored text
-   **Rounded badges** for category identification
-   **Consistent spacing** and typography

### Modal/Detail View

-   **Badge-style** category indicators
-   **German category names**
-   **Matching color schemes**

## Benefits

### 🎨 **Design Consistency**

-   Unified color scheme across all event displays
-   Professional, cohesive visual identity
-   Easy category recognition

### 🛠️ **Developer Experience**

-   Centralized color management
-   Type-safe category handling
-   Reusable utility functions
-   Single source of truth

### 📱 **User Experience**

-   Clear visual hierarchy
-   Intuitive category identification
-   Consistent interaction patterns
-   Accessible color contrasts

### 🔧 **Maintainability**

-   Easy to update colors globally
-   No hardcoded values scattered across files
-   Scalable for new categories
-   Centralized documentation

## Usage Examples

### Basic Badge

```tsx
<div className={`p-2 rounded-lg ${getCategoryBadgeClasses(event.category)}`}>
    {event.title}
</div>
```

### Calendar Event

```tsx
<div
    className={`${getCategoryBackgroundColor(
        event.category
    )} text-white p-2 rounded`}
>
    {event.title}
</div>
```

### Category Display

```tsx
<span className="font-medium">{getCategoryDisplayName(event.category)}</span>
```

## Future Enhancements

### Potential Additions

-   **Gradient backgrounds** for premium events
-   **Custom icons** instead of emojis
-   **Dark mode variants**
-   **Animation classes** for hover states
-   **Accessibility improvements** (high contrast mode)

### Easy Extensions

-   Add new categories by updating the utility file
-   Modify colors globally from single location
-   Extend with additional color variants
-   Add category-specific behaviors

## File Structure

```
lib/
├── event-utils.ts          # Central color system
├── database.ts             # Type definitions

app/
├── was-steht-an/page.tsx   # Main events page (updated)
└── admin/events/
    └── AdminEventsCalendar.tsx  # Admin calendar (updated)
```

## Conclusion

The event category color system provides a robust, maintainable, and visually consistent approach to categorizing and displaying events throughout the Wendessen website. All components now use the same color scheme, ensuring a professional and cohesive user experience.

The centralized approach makes it easy to maintain and extend the system as new requirements emerge, while the type-safe implementation prevents category-related bugs and ensures consistency across the codebase.
