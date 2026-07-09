# Kinofedia media library

Put final exported media in these folders, then update `src/data/portfolio.js`.

```text
media/
├── portfolio/
│   ├── videos/posters/       # 16:9 JPG/WebP poster per restaurant video
│   ├── photos/               # High-resolution JPG/WebP food and restaurant photos
│   ├── ai-images/            # AI-generated still images
│   ├── ai-videos/posters/    # 16:9 JPG/WebP poster per AI video
│   └── flyers/               # Portrait flyer exports, preferably 4:5 or original ratio
└── behind-the-scenes/posters/# 16:9 JPG/WebP poster per BTS video
```

Use web-ready filenames such as `restaurant-film-01.webp`. Reference a file as
`/media/portfolio/videos/posters/restaurant-film-01.webp`. Videos stay on
YouTube; only their posters belong here.
