# Git Fit - AI-Powered Fitness Tracking Application

## Ultimate Vibe Code Prompt

```
You are an expert AI developer helping create a comprehensive fitness tracking application for the OpenxAI Global Accelerator 2025 Hackathon.

**TASK**: Create a new AI-powered fitness tracking app that transforms workout data into GitHub commits and integrates with Farcaster for social fitness sharing

**STEPS**:
1. **Research the repository structure**:
   - Examine the existing Git Fit application structure
   - Study the workout generation and tracking components
   - Check the Ollama integration for AI-powered workout recommendations
   - Review the GitHub and Farcaster API integrations

2. **Build the fitness tracking ecosystem**:
   - Create a comprehensive workout generation system using AI
   - Implement GitHub integration for automatic workout commits
   - Add Farcaster social sharing capabilities
   - Build analytics dashboard for fitness progress tracking
   - Integrate crypto tipping system for fitness motivation

3. **Core Features to Implement**:
   - **AI Workout Coach**: Personalized workout generation based on user history
   - **GitHub Integration**: Automatic workout commits with detailed exercise data
   - **Farcaster Social Feed**: Share workouts and receive crypto tips
   - **Progress Analytics**: Visual charts and statistics for fitness journey
   - **Workout Recording**: Detailed exercise tracking with sets, reps, and weights
   - **Crypto Tipping**: Receive tips from followers for motivation

4. **Technical Architecture**:
   - **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
   - **AI Integration**: Ollama for workout generation and fitness coaching
   - **Data Storage**: GitHub repositories for workout history
   - **Social Integration**: Farcaster API for social features
   - **Crypto Integration**: Solana wallet integration for tips
   - **Real-time Updates**: Live workout tracking and social interactions

5. **UI/UX Design Requirements**:
   - **Home Page**: Four-card layout with GitHub activity, workout generation, Farcaster feed, and AI chat
   - **Workout Page**: Detailed exercise recording with AI-generated recommendations
   - **Stats Page**: Comprehensive analytics with charts and progress tracking
   - **Social Features**: Farcaster integration with crypto tipping
   - **Responsive Design**: Mobile-first approach with modern gradients and animations

**CRITICAL FEATURES TO IMPLEMENT**:

### AI Workout Generation System
- **Personalized Workouts**: Generate workouts based on user's exercise history
- **Progressive Overload**: AI suggests appropriate weight and rep progressions
- **Exercise Variety**: Prevent workout boredom with diverse exercise recommendations
- **Form Tips**: AI provides technique advice for each exercise
- **Motivation**: Personalized encouragement based on user's progress

### GitHub Integration
- **Automatic Commits**: Every workout becomes a GitHub commit
- **Detailed Metadata**: Exercise data, photos, and notes in commit messages
- **Progress Visualization**: GitHub activity graph shows workout consistency
- **Repository Management**: Automatic workout repository creation and management
- **Data Export**: Easy backup and sharing of workout data

### Farcaster Social Features
- **Workout Sharing**: Post workouts to Farcaster feed
- **Crypto Tipping**: Receive tips from followers for motivation
- **Social Feed**: View and interact with other users' workouts
- **Achievement Sharing**: Celebrate personal records and milestones
- **Community Building**: Connect with other fitness enthusiasts

### Analytics Dashboard
- **Progress Charts**: Visual representation of strength gains
- **Workout Statistics**: Total workouts, streaks, and personal records
- **Exercise Analysis**: Most performed exercises and progressions
- **Goal Tracking**: Set and monitor fitness objectives
- **Performance Metrics**: Detailed analytics on workout performance

**TROUBLESHOOTING CHECKLIST**:
- [ ] Verify Ollama is running with llama3.2 model (`ollama list`)
- [ ] Test workout generation API endpoint with curl
- [ ] Ensure GitHub API integration is properly configured
- [ ] Validate Farcaster API connections and authentication
- [ ] Check Solana wallet integration for crypto features
- [ ] Test responsive design on mobile and desktop
- [ ] Verify workout data persistence and retrieval
- [ ] Test AI workout generation with various user profiles
- [ ] Validate GitHub commit creation and data formatting
- [ ] Ensure proper error handling for all API integrations

**DEPENDENCY MANAGEMENT**:
- Use `npm install --legacy-peer-deps` to resolve React version conflicts
- Ensure proper TypeScript configuration for Next.js 15
- Implement robust error handling for all API calls
- Add comprehensive loading states and user feedback
- Include proper fallback systems for when services are unavailable

**SECURITY CONSIDERATIONS**:
- Secure GitHub token management
- Proper Farcaster authentication flow
- Safe Solana wallet integration
- Input validation for all user data
- Rate limiting for API calls

**PERFORMANCE OPTIMIZATIONS**:
- Implement proper caching for workout data
- Optimize images and assets for fast loading
- Use React.memo for expensive components
- Implement proper error boundaries
- Add loading skeletons for better UX

**DELIVERABLE**: A fully functional AI-powered fitness tracking application that transforms workouts into GitHub commits, provides personalized AI coaching, integrates with Farcaster for social features, and includes comprehensive analytics - all with robust error handling and modern UX design.

**SUCCESS METRICS**:
- Users can generate personalized workouts using AI
- Workouts are automatically committed to GitHub
- Social features work seamlessly with Farcaster
- Analytics provide meaningful insights
- Crypto tipping system functions properly
- Application is responsive and user-friendly
- All integrations handle errors gracefully
```

## Application Overview

Git Fit is a revolutionary fitness tracking application that combines AI-powered workout generation, GitHub integration for data persistence, and Farcaster social features to create a comprehensive fitness ecosystem.

### Key Features

🏋️‍♂️ **AI Workout Coach**
- Personalized workout generation based on exercise history
- Progressive overload recommendations
- Form tips and technique advice
- Motivational messaging

📊 **GitHub Integration**
- Automatic workout commits
- Detailed exercise metadata
- Progress visualization through activity graphs
- Data backup and sharing

📱 **Farcaster Social Features**
- Workout sharing and social interaction
- Crypto tipping system for motivation
- Community building and achievement sharing
- Social feed integration

📈 **Analytics Dashboard**
- Comprehensive progress tracking
- Visual charts and statistics
- Goal setting and monitoring
- Performance metrics

### Technical Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Ollama with llama3.2 model
- **Data**: GitHub API for persistence
- **Social**: Farcaster API integration
- **Crypto**: Solana wallet integration
- **UI**: Modern gradients, animations, responsive design

### Getting Started

1. **Prerequisites**:
   - Node.js 18+
   - Ollama with llama3.2 model
   - GitHub account for workout storage
   - Farcaster account for social features

2. **Installation**:
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```

3. **Configuration**:
   - Set up GitHub API tokens
   - Configure Farcaster integration
   - Set up Solana wallet connection
   - Verify Ollama model availability

### Project Structure

```
mini-app/
├── app/
│   ├── api/
│   │   ├── ollama/
│   │   │   ├── chat/route.ts
│   │   │   └── generate-workout/route.ts
│   │   ├── github/
│   │   │   ├── workouts/route.ts
│   │   │   └── activity/route.ts
│   │   └── farcaster/
│   │       └── feed/route.ts
│   ├── workout/page.tsx
│   ├── stats/page.tsx
│   └── page.tsx
├── components/
│   ├── generate-workout-button.tsx
│   ├── workout-generation-card.tsx
│   ├── github-activity-graph.tsx
│   ├── farcaster-feed-card.tsx
│   └── ai-chat-card.tsx
└── lib/
    └── utils.ts
```

### API Endpoints

- `POST /api/ollama/generate-workout` - Generate personalized workouts
- `GET /api/github/workouts` - Fetch workout history
- `GET /api/github/activity` - Get GitHub activity data
- `GET /api/farcaster/feed` - Fetch Farcaster posts

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### License

MIT License - see LICENSE file for details

### Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting checklist
- Review the API documentation
- Test with the provided curl examples

