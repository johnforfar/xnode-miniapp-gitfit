# Git Fit - Multi-User Fitness Tracker

**Get fit with Git!** Track your workouts, commit your progress to GitHub, and get tipped by your Farcaster followers to stay motivated.

## 🚀 **Simplified User Flow (No Forking Required!)**

### **For Users:**
1. **Visit**: `https://gitfit.johnforfar.com`
2. **Connect**: Farcaster wallet (one click)
3. **Connect**: GitHub account (OAuth with limited permissions)
4. **Start**: Recording workouts immediately
5. **Share**: On Farcaster and get tips

### **For You (App Owner):**
1. **Deploy once**: Your server hosts all users
2. **Manage users**: All users connect to your server
3. **Receive tips**: Direct crypto to your wallet
4. **Open source**: Code available for forking/modification

## 🏗️ **Architecture**

**Multi-User Server**: One deployment serves all users
- Each user gets their own GitHub repository (`username-gitfit-workouts`)
- GitHub OAuth with limited permissions (repo creation only)
- Users can't access each other's data
- All users can tip you directly

## 🔄 **How It Works**

**User Flow:**
1. Visit `gitfit.johnforfar.com` → Connect Farcaster wallet → Connect GitHub
2. Server creates `username-gitfit-workouts` repository automatically
3. Record workout → Commit to GitHub → Share on Farcaster
4. Followers tip you directly via crypto

## 📁 **User Repository Structure**

Each user gets their own GitHub repository automatically created:

```
username-gitfit-workouts/
├── sessions/
│   ├── 2024/
│   │   ├── 01-january/
│   │   │   ├── 2024-01-15-morning/
│   │   │   │   ├── workout.json
│   │   │   │   ├── photo-1.jpg
│   │   │   │   └── photo-2.jpg
│   │   │   └── 2024-01-16-evening/
│   │   └── 02-february/
│   └── 2025/
├── stats/
│   ├── personal-records.json
│   └── monthly-summary.json
└── media/
    └── workout-videos/
```

## 💪 Features

**For Users:** Track workouts, commit to GitHub, share on Farcaster, receive crypto tips
**For You:** One server, multiple users, direct tips, open source code

## 🔄 Workflow

Record workout → Commit to GitHub → Share on Farcaster → Receive tips

## 📊 Workout Data Structure

```json
{
  "id": "2024-01-15-morning",
  "date": "2024-01-15",
  "time": "08:30",
  "session": "morning",
  "exercises": [
    {
      "name": "Deadlift",
      "sets": [
        {"reps": 8, "weight": 80, "unit": "kg"},
        {"reps": 6, "weight": 100, "unit": "kg"},
        {"reps": 5, "weight": 120, "unit": "kg"}
      ],
      "notes": "Felt strong today"
    }
  ],
  "totalDuration": "45 minutes",
  "notes": "Great workout!",
  "photos": ["photo-1.jpg", "photo-2.jpg"],
  "videos": [],
  "farcasterCastHash": "0x123...",
  "githubCommitHash": "abc123def456"
}
```

## 🎨 Customization

Update app name, domain, and styling. Configure environment variables for your GitHub OAuth and domain.

## 🔐 Security

Farcaster wallet authentication, GitHub OAuth with limited permissions, no database needed, encrypted storage, rate limiting.

## 💰 Tipping System

**Supported:** USD stablecoins, ETH. **Amounts:** $0.01, $0.10, $1.00, $10.00, $100.00
**Flow:** Follower clicks tip → Wallet connection → Transaction → Direct crypto to your wallet

## 🚀 Deployment

**Xnode:** `nix run` after configuring environment variables
**Self-hosted:** `npm install && npm run build && npm start`

**Environment Variables:**
```bash
NEXT_PUBLIC_URL=https://your-app.yourdomain.com
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REPO=your-username/your-workouts-repo
GITHUB_USERNAME=your-github-username
GITHUB_REPO_URL=https://github.com/your-username/your-repo-name
FARCASTER_USERNAME=your-farcaster-username
FARCASTER_PROFILE_URL=https://farcaster.xyz/your-farcaster-username
DATABASE_URL=file:./gitfit.db
ENCRYPTION_KEY=your_encryption_key
OWNER_WALLET_ADDRESS=0x123...
```

## 📦 Xnode App Store

Template metadata, Xnode configuration, environment variables, deployment requirements, customization options.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 📄 License

MIT License - Feel free to fork, modify, and deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: This README

## 🙏 Acknowledgments

Forked from [OpenXAI miniapp template](https://github.com/OpenxAI-Network/xnode-miniapp-template) - Thanks to the OpenXAI team for the excellent foundation!

---

**Ready to get fit with Git?** 🏋️‍♂️💻

Fork this template, customize it for your needs, and start your fitness journey today!