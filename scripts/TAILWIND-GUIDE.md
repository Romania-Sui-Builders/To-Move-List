# 🎨 Tailwind CSS Guide for To-Move-List

This project includes Tailwind CSS v3.4+ with custom Sui blockchain theming.

## 🚀 Quick Start

Tailwind is already installed and configured. Just import the styles:

```typescript
import './styles/tailwind.css';
```

## 🎨 Custom Sui Color Palette

```css
/* Available colors */
sui-blue: #4DA2FF    /* Primary brand color */
sui-dark: #1F1F1F    /* Dark backgrounds */
sui-light: #F7F9FB   /* Light backgrounds */
```

### Usage Examples

```tsx
// Text colors
<h1 className="text-sui-blue">Sui dApp</h1>

// Background colors
<div className="bg-sui-dark text-white p-4">Dark section</div>
<div className="bg-sui-light">Light section</div>

// Hover effects
<button className="bg-sui-blue hover:bg-blue-600">Click me</button>
```

## 🧩 Pre-built Component Classes

### Buttons

```tsx
// Primary button (Sui blue)
<button className="btn-primary">
  Create Board
</button>

// Secondary button (gray)
<button className="btn-secondary">
  Cancel
</button>

// Custom variations
<button className="btn-primary disabled:opacity-50">
  Submit
</button>
```

**CSS Definition:**
```css
.btn-primary {
  @apply bg-sui-blue text-white font-semibold py-2 px-4 
         rounded-lg hover:bg-blue-600 transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 font-semibold py-2 px-4 
         rounded-lg hover:bg-gray-300 transition-colors duration-200;
}
```

### Cards

```tsx
// Container card
<div className="card">
  <h2 className="text-xl font-bold mb-4">Board Name</h2>
  <p className="text-gray-600">Description...</p>
</div>
```

**CSS Definition:**
```css
.card {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
}
```

### Input Fields

```tsx
// Form input
<input 
  type="text" 
  className="input-field" 
  placeholder="Task title"
/>

// Textarea
<textarea 
  className="input-field" 
  rows={4}
  placeholder="Task description"
/>
```

**CSS Definition:**
```css
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-sui-blue 
         focus:border-transparent;
}
```

## 🏷️ Task Status Badges

Visual indicators for task states with color coding:

```tsx
// Helper function
function getStatusBadgeClass(status: number): string {
  const classes = [
    'badge badge-todo',           // 0: TODO (gray)
    'badge badge-in-progress',    // 1: IN_PROGRESS (blue)
    'badge badge-awaiting-check', // 2: AWAITING_CHECK (yellow)
    'badge badge-verified',       // 3: VERIFIED (green)
    'badge badge-failed',         // 4: FAILED (red)
  ];
  return classes[status] || 'badge';
}

// Usage
<span className={getStatusBadgeClass(task.status)}>
  {getStatusName(task.status)}
</span>
```

### Badge Variations

```tsx
// TODO - Gray
<span className="badge badge-todo">To Do</span>

// In Progress - Blue
<span className="badge badge-in-progress">In Progress</span>

// Awaiting Check - Yellow
<span className="badge badge-awaiting-check">Awaiting Check</span>

// Verified - Green
<span className="badge badge-verified">✓ Verified</span>

// Failed - Red
<span className="badge badge-failed">✗ Failed</span>
```

**CSS Definitions:**
```css
.badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.badge-todo { @apply bg-gray-100 text-gray-800; }
.badge-in-progress { @apply bg-blue-100 text-blue-800; }
.badge-awaiting-check { @apply bg-yellow-100 text-yellow-800; }
.badge-verified { @apply bg-green-100 text-green-800; }
.badge-failed { @apply bg-red-100 text-red-800; }
```

## 📋 Complete Example

Here's a full example of a Task Card component:

```tsx
interface TaskCardProps {
  title: string;
  description: string;
  status: number;
  assignees: string[];
}

function TaskCard({ title, description, status, assignees }: TaskCardProps) {
  const statusNames = ['To Do', 'In Progress', 'Awaiting Check', 'Verified', 'Failed'];
  
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <span className={getStatusBadgeClass(status)}>
          {statusNames[status]}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>
      
      {/* Assignees */}
      {assignees.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>👤</span>
          <span>{assignees.length} assigned</span>
        </div>
      )}
      
      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="btn-primary text-sm">
          View Details
        </button>
        <button className="btn-secondary text-sm">
          Edit
        </button>
      </div>
    </div>
  );
}
```

## 🎯 Board View Example

```tsx
function BoardView({ boardId }: { boardId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  return (
    <div className="min-h-screen bg-sui-light p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sui-dark mb-2">
          My Board
        </h1>
        <p className="text-gray-600">
          Manage your tasks and collaborate with your team
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">To Do</div>
          <div className="text-2xl font-bold text-gray-800">5</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">3</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Awaiting Check</div>
          <div className="text-2xl font-bold text-yellow-600">2</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Verified</div>
          <div className="text-2xl font-bold text-green-600">10</div>
        </div>
      </div>
      
      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
      
      {/* Create Button */}
      <button className="fixed bottom-8 right-8 btn-primary shadow-lg">
        + New Task
      </button>
    </div>
  );
}
```

## 📝 Form Example

```tsx
function CreateTaskForm({ boardId }: { boardId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  return (
    <form className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Task
      </h2>
      
      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="input-field"
          rows={4}
          placeholder="Describe the task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select className="input-field">
          <option>Bug Fix</option>
          <option>Feature</option>
          <option>Documentation</option>
        </select>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button type="button" className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Create Task
        </button>
      </div>
    </form>
  );
}
```

## 🔧 Configuration Files

### `tailwind.config.js`

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        sui: {
          blue: '#4DA2FF',
          dark: '#1F1F1F',
          light: '#F7F9FB',
        },
      },
    },
  },
  plugins: [],
}
```

### `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 💡 Utility Classes

### Layout

```tsx
// Containers
<div className="container mx-auto px-4">Content</div>

// Flex layouts
<div className="flex items-center justify-between gap-4">...</div>

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">...</div>
```

### Spacing

```tsx
// Padding
<div className="p-4">All sides</div>
<div className="px-6 py-4">Horizontal & vertical</div>

// Margin
<div className="m-4">All sides</div>
<div className="mb-6">Bottom only</div>
```

### Typography

```tsx
// Size
<h1 className="text-3xl font-bold">Large heading</h1>
<p className="text-sm">Small text</p>

// Weight
<span className="font-semibold">Semi-bold</span>
<span className="font-light">Light</span>

// Color
<p className="text-gray-600">Gray text</p>
<p className="text-sui-blue">Sui blue text</p>
```

### Effects

```tsx
// Shadows
<div className="shadow-md hover:shadow-lg">Card</div>

// Transitions
<button className="transition-all duration-200 hover:scale-105">
  Hover me
</button>

// Opacity
<div className="opacity-50 hover:opacity-100">Fades in</div>
```

## 📱 Responsive Design

```tsx
// Mobile-first approach
<div className="
  w-full           /* Full width on mobile */
  md:w-1/2         /* Half width on tablets */
  lg:w-1/3         /* Third width on desktop */
  xl:w-1/4         /* Quarter width on large screens */
">
  Responsive container
</div>

// Hide/show at breakpoints
<div className="hidden md:block">
  Only visible on tablets and up
</div>

<div className="block md:hidden">
  Only visible on mobile
</div>
```

## 🎨 Dark Mode (Optional)

To add dark mode support later:

```javascript
// In tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ... rest of config
}
```

```tsx
// Usage
<div className="bg-white dark:bg-sui-dark text-gray-900 dark:text-white">
  Supports dark mode
</div>
```

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Heroicons](https://heroicons.com/) - SVG icons
- [Headless UI](https://headlessui.com/) - Unstyled components

## 🚀 Next Steps

1. Import `./styles/tailwind.css` in your main file
2. Use pre-built component classes (`btn-primary`, `card`, etc.)
3. Customize colors in `tailwind.config.js` if needed
4. Build responsive layouts with utility classes
5. Add custom components in `src/styles/tailwind.css`

Happy styling! 🎨
