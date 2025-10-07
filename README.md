# ConvoSpace

A modern, real-time chat application built with Next.js 14+, TypeScript, Tailwind CSS, and Zustand for state management.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🌓 Dark mode support
- 💬 Real-time messaging interface
- 👤 User authentication (login/register pages)
- 📱 Responsive design
- ⚡ Fast performance with Next.js App Router
- 🎯 Type-safe with TypeScript
- 🔄 State management with Zustand

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** React Icons
- **Future:** Pusher/WebSocket for real-time features

## Project Structure

```
📦 ConvoSpace
 ┣ 📁 app                    # Next.js App Router pages
 ┃ ┣ 📁 (auth)              # Authentication routes
 ┃ ┃ ┣ 📁 login
 ┃ ┃ ┗ 📁 register
 ┃ ┣ 📁 (chat)              # Chat routes
 ┃ ┃ ┣ 📁 [chatId]
 ┃ ┃ ┗ 📜 page.tsx
 ┃ ┣ 📜 layout.tsx
 ┃ ┗ 📜 page.tsx
 ┣ 📁 components            # Reusable components
 ┃ ┣ 📁 chat               # Chat-related components
 ┃ ┣ 📁 common             # Common UI components
 ┃ ┗ 📜 index.ts
 ┣ 📁 store                 # Zustand state management
 ┃ ┣ 📜 chatStore.ts
 ┃ ┣ 📜 userStore.ts
 ┃ ┗ 📜 uiStore.ts
 ┣ 📁 hooks                 # Custom React hooks
 ┣ 📁 lib                   # Utility functions and mock data
 ┣ 📁 styles                # Global styles
 ┣ 📁 types                 # TypeScript type definitions
 ┣ 📁 constants             # App constants
 ┗ 📁 public                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## State Management

The app uses Zustand for state management with three main stores:

- **chatStore**: Manages chat messages, conversations, and selection
- **userStore**: Handles user authentication and profile data
- **uiStore**: Controls UI state (theme, modals, sidebar)

## Future Enhancements

- [ ] Real-time messaging with Pusher or WebSocket
- [ ] User presence indicators
- [ ] File sharing and media messages
- [ ] Group chat functionality
- [ ] Message reactions and emoji support
- [ ] Push notifications
- [ ] Voice and video calls

## License

MIT

## Author

Built with ❤️ using Next.js and TypeScript
