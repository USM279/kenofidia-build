// Portfolio content manifest
// Replace `src` values with files from /public/media and paste final YouTube
// URLs into `youtubeUrl`. Keep IDs stable so layout and links remain intact.

const placeholderPhotos = [
  ['table-story', 'A candlelit restaurant table', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85'],
  ['shared-table', 'A generous shared table of food', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=85'],
  ['restaurant-room', 'A warmly lit restaurant interior', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=85'],
  ['chef-at-work', 'A chef working in a restaurant kitchen', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1600&q=85'],
  ['dining-room', 'An intimate contemporary dining room', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1600&q=85'],
  ['breakfast-plate', 'A styled breakfast plate', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1600&q=85'],
  ['evening-terrace', 'An atmospheric restaurant terrace', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=85'],
  ['pancake-detail', 'A detailed food composition', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=85'],
  ['kitchen-portrait', 'A portrait of a chef in the kitchen', 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1600&q=85'],
  ['creative-studio', 'Creative production in progress', 'https://images.unsplash.com/photo-1611095210561-67f37abd9dac?w=1600&q=85'],
  ['burger-closeup', 'A close-up restaurant dish', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1600&q=85'],
  ['plated-course', 'An editorial plated course', 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1600&q=85'],
  ['pasta-detail', 'Fresh pasta styled for camera', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600&q=85'],
  ['colourful-bowl', 'A colourful overhead food scene', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=85'],
  ['green-plate', 'A fresh plated dish', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=85'],
  ['vegetable-study', 'A vivid ingredient study', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1600&q=85'],
  ['salad-study', 'An editorial salad composition', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&q=85'],
  ['dessert-detail', 'A refined dessert detail', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600&q=85'],
  ['grill-scene', 'Food being prepared over a grill', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85'],
  ['restaurant-detail', 'Restaurant atmosphere and details', 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=1600&q=85'],
].map(([id, alt, src], index) => ({
  id,
  title: `Restaurant Story ${String(index + 1).padStart(2, '0')}`,
  category: index % 3 === 0 ? 'Atmosphere' : index % 3 === 1 ? 'Food' : 'People',
  src,
  alt,
  isPlaceholder: true,
}))

const video = (id, title, category, posterIndex, options = {}) => ({
  id,
  title,
  category,
  poster: options.poster ?? placeholderPhotos[posterIndex].src,
  posterAlt: options.posterAlt ?? placeholderPhotos[posterIndex].alt,
  format: options.format ?? 'landscape',
  width: options.width,
  height: options.height,
  youtubeUrl: '', // TODO: Paste the final private/unlisted YouTube URL.
  isPlaceholder: !options.poster,
})

const photoDimensions = [
  [2400, 1347], [2400, 1596], [2400, 1600], [1602, 2400], [1644, 2400],
  [1600, 2400], [2400, 1600], [2400, 1600], [1600, 2400], [2400, 1600],
  [2400, 1185], [1713, 2400], [1600, 2400], [2400, 1215], [2400, 1600],
  [2400, 1600], [2400, 1600], [2400, 1600], [2400, 1600], [2400, 1600],
  [1600, 2400], [2400, 1600], [2400, 1600], [1648, 2400], [2400, 1650],
  [2400, 2053],
]

const portfolioPhotos = photoDimensions.map(([width, height], index) => ({
  id: `restaurant-photo-${String(index + 1).padStart(2, '0')}`,
  title: `Restaurant Story ${String(index + 1).padStart(2, '0')}`,
  category: 'Food & Restaurant',
  src: `/media/portfolio/photos/photo-${String(index + 1).padStart(2, '0')}.avif`,
  alt: `Kenofidia food and restaurant photography ${index + 1}`,
  width,
  height,
  isPlaceholder: false,
}))

const behindScenesDimensions = [
  [708, 1240], [2210, 1216], [698, 1242], [696, 1238], [700, 1232],
  [704, 1248], [710, 1246], [702, 1236], [704, 1250], [716, 1248],
]

const behindScenesVideos = behindScenesDimensions.map(([width, height], index) => video(
  `bts-${String(index + 1).padStart(2, '0')}`,
  `Behind the Scenes ${String(index + 1).padStart(2, '0')}`,
  'Behind the Scenes',
  index,
  {
    poster: `/media/behind-the-scenes/posters/bts-${String(index + 1).padStart(2, '0')}.avif`,
    posterAlt: `Behind-the-scenes video poster ${index + 1}`,
    format: width > height ? 'landscape' : 'portrait',
    width,
    height,
  },
))

export const portfolioMedia = {
  restaurantVideos: [
    ...Array.from({ length: 8 }, (_, index) => video(
      `restaurant-film-${String(index + 1).padStart(2, '0')}`,
      `Restaurant Film ${String(index + 1).padStart(2, '0')}`,
      'Restaurant Reel',
      index,
      {
        poster: `/media/portfolio/videos/posters/video-${String(index + 1).padStart(2, '0')}.png`,
        posterAlt: `Poster for restaurant film ${index + 1}`,
        format: 'portrait',
      },
    )),
  ],
  photos: portfolioPhotos,
  aiImages: [
    { id: 'ai-image-01', title: 'AI Study 01', category: 'AI Generated', src: '/media/portfolio/ai-images/ai-image-01.png', alt: 'AI-generated mixed grill plate and cola on a rustic table', width: 970, height: 1288 },
    { id: 'ai-image-02', title: 'AI Study 02', category: 'AI Generated', src: '/media/portfolio/ai-images/ai-image-02.png', alt: 'AI-generated grilled ribs and fries composition', width: 1934, height: 1278 },
    { id: 'ai-image-03', title: 'AI Study 03', category: 'AI Generated', src: '/media/portfolio/ai-images/ai-image-03.png', alt: 'AI-generated sunlit restaurant interior during service', width: 2722, height: 1154 },
    { id: 'ai-image-04', title: 'AI Study 04', category: 'AI Generated', src: '/media/portfolio/ai-images/ai-image-04.png', alt: 'AI-generated portrait of a chef preparing shawarma', width: 710, height: 1286 },
    { id: 'ai-image-05', title: 'AI Study 05', category: 'AI Generated', src: '/media/portfolio/ai-images/ai-image-05.png', alt: 'AI-generated lamb and spiced rice dish', width: 1920, height: 1246 },
    { id: 'ai-image-06', title: 'AI Study 06', category: 'AI Generated', src: '/media/portfolio/ai-images/ai-image-06.png', alt: 'AI-generated burger, fries, and cola composition', width: 2286, height: 1268 },
  ],
  aiVideos: [
    video('ai-film-01', 'AI Film 01', 'AI Motion', 15, {
      poster: '/media/portfolio/ai-videos/posters/ai-video-01.png',
      posterAlt: 'Poster for AI film 1',
      format: 'portrait',
    }),
    video('ai-film-02', 'AI Film 02', 'AI Motion', 16, {
      poster: '/media/portfolio/ai-videos/posters/ai-video-02.png',
      posterAlt: 'Poster for AI film 2',
      format: 'portrait',
    }),
    video('ai-film-03', 'AI Film 03', 'AI Motion', 17, {
      poster: '/media/portfolio/ai-videos/posters/ai-video-03.png',
      posterAlt: 'Poster for AI film 3',
      format: 'portrait',
    }),
  ],
  flyers: [
    { id: 'flyer-01', title: 'Campaign Flyer 01', category: 'Flyer Design', src: '/media/portfolio/flyers/flyer-01.avif', alt: 'Kenofidia campaign flyer 1', width: 864, height: 1280 },
    { id: 'flyer-02', title: 'Campaign Flyer 02', category: 'Flyer Design', src: '/media/portfolio/flyers/flyer-02.avif', alt: 'Kenofidia campaign flyer 2', width: 912, height: 1280 },
    { id: 'flyer-03', title: 'Campaign Flyer 03', category: 'Flyer Design', src: '/media/portfolio/flyers/flyer-03.avif', alt: 'Kenofidia campaign flyer 3', width: 864, height: 1272 },
  ],
  behindScenes: behindScenesVideos,
}

export const heroImages = portfolioPhotos.slice(0, 20).map((item) => item.src)
export const supportingPhotos = portfolioPhotos

export const portfolioNavigation = [
  { label: 'Films', href: '#restaurant-videos' },
  { label: 'Photos', href: '#restaurant-photos' },
  { label: 'AI Images', href: '#ai-images' },
  { label: 'AI Films', href: '#ai-videos' },
  { label: 'Flyers', href: '#flyers' },
  { label: 'BTS', href: '#behind-the-scenes' },
]
