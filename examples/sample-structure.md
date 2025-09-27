# Sample Workout Repository Structure

## Create Your Personal Workout Repository

After forking this template, create a separate repository for your personal workout data:

**Repository Name**: `your-username-gitfit-workouts`

## Directory Structure

```
your-workouts-repo/
├── README.md                    # Your fitness journey description
├── sessions/                    # All workout sessions
│   ├── 2024/                    # Year folders
│   │   ├── 01-january/          # Month folders
│   │   │   ├── 2024-01-15-morning/  # Session folders (date-time)
│   │   │   │   ├── workout.json     # Workout data
│   │   │   │   ├── photo-1.jpg     # Workout photos
│   │   │   │   └── photo-2.jpg
│   │   │   ├── 2024-01-15-evening/
│   │   │   │   ├── workout.json
│   │   │   │   └── video-1.mp4     # Workout videos
│   │   │   └── 2024-01-16-morning/
│   │   └── 02-february/
│   └── 2025/
├── stats/                       # Progress statistics
│   ├── personal-records.json    # Personal bests
│   ├── monthly-summary.json     # Monthly progress
│   └── progress-charts.json     # Chart data
└── media/                       # Media files
    ├── profile-photos/          # Profile pictures
    └── workout-videos/          # Video files
```

## File Naming Convention

### Session Folders
- Format: `YYYY-MM-DD-session`
- Examples: `2024-01-15-morning`, `2024-01-15-evening`

### Workout Files
- `workout.json` - Main workout data
- `photo-1.jpg`, `photo-2.jpg` - Workout photos
- `video-1.mp4` - Workout videos

### Stats Files
- `personal-records.json` - Personal bests
- `monthly-summary.json` - Monthly progress
- `progress-charts.json` - Chart data

## Example Workout Data

See `sample-workout.json` for the complete workout data structure.

## Setup Instructions

1. **Fork this template repository**
2. **Create your personal workout repository** (separate from template)
3. **Configure environment variables** to point to your personal repo
4. **Start recording workouts!**

## Privacy Note

- **Template repository**: Contains only code and examples
- **Personal repository**: Contains only your workout data
- **Clean separation**: No personal data in template
