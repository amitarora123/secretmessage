# 🔐 SecretMessage

SecretMessage is a privacy-first messaging app built with **Next.js** where users can register and receive a **unique link** that allows others to send them secret or anonymous messages — **no login required** for senders.

✨ Plus, it comes with a smart **AI assistant** that helps senders craft creative and thoughtful messages!

---

## 🚀 Features

- 📝 **User Authentication with NextAuth.js**  
  Secure signup and login using `NextAuth.js` for session management and social/email logins (if enabled).

- 🔗 **Unique Shareable Links**  
  After registering, users receive a unique link to share with others.

- 🕵️‍♂️ **Anonymous Messaging**  
  Anyone with your link can send you a message — no account needed.

- 🤖 **AI-Powered Message Suggestions**  
  Stuck on what to say? The built-in AI suggests fun, friendly, or mysterious messages to help spark creativity.

- 📬 **Clean Inbox Interface**  
  Registered users can view messages sent to them from their personal dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Backend**: Next.js API Routes
- **Database**: MongoDB / PostgreSQL *(update based on your project)*
- **AI Integration**: OpenAI API / other AI models *(mention the one you're using)*

---

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/amitarora123/secretmessage.git
cd secretmessage

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Add NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL, and any AI API keys

# Start the development server
npm run dev
