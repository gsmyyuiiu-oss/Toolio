import fs from 'fs';
import path from 'path';

// Definition of all 8 categories and their 225 tools
const CATEGORIES_DATA = {
  'image-tools': {
    name: 'Image Tools',
    defaultIcon: 'Image',
    color: 'amber',
    hex: '#f59e0b',
    tools: [
      { name: 'Image Compressor', slug: 'image-compressor', icon: 'Minimize2', desc: 'Compress JPG, PNG, and WebP images with custom quality slider and live file size preview.' },
      { name: 'Image Resizer', slug: 'image-resizer', icon: 'Maximize2', desc: 'Resize image dimensions by width, height, aspect ratio lock, or percentage scale.' },
      { name: 'Image Cropper', slug: 'image-cropper', icon: 'Crop', desc: 'Crop images with preset ratios (1:1, 16:9, 4:3, 9:16) or freeform bounding box.' },
      { name: 'Image Rotator', slug: 'image-rotator', icon: 'RotateCw', desc: 'Rotate images by 90°, 180°, 270° or fine-tune with a custom degree angle slider.' },
      { name: 'Image Flipper', slug: 'image-flipper', icon: 'FlipHorizontal', desc: 'Flip images horizontally, vertically, or both with instantaneous canvas rendering.' },
      { name: 'Image Converter', slug: 'image-converter', icon: 'RefreshCw', desc: 'Convert images between PNG, JPG, WEBP, BMP, and AVIF formats without quality loss.' },
      { name: 'JPG to PNG', slug: 'jpg-to-png', icon: 'ArrowRightLeft', desc: 'Convert JPG images to high quality lossless PNG format with transparent support.' },
      { name: 'PNG to JPG', slug: 'png-to-jpg', icon: 'ArrowRightLeft', desc: 'Convert PNG images to compact JPG format with background color fill.' },
      { name: 'JPG to WEBP', slug: 'jpg-to-webp', icon: 'Zap', desc: 'Convert JPG photos to modern lightweight WEBP format for faster website loading.' },
      { name: 'WEBP to JPG', slug: 'webp-to-jpg', icon: 'ArrowRightLeft', desc: 'Convert Google WEBP images to universal JPG format compatible with all software.' },
      { name: 'PNG to WEBP', slug: 'png-to-webp', icon: 'Zap', desc: 'Convert transparent PNG images to next-gen WEBP format with massive size savings.' },
      { name: 'WEBP to PNG', slug: 'webp-to-png', icon: 'ArrowRightLeft', desc: 'Convert WEBP files to full lossless transparent PNG files in one click.' },
      { name: 'GIF to JPG', slug: 'gif-to-jpg', icon: 'Image', desc: 'Extract high resolution still frames from GIF animations and save as JPG.' },
      { name: 'GIF to PNG', slug: 'gif-to-png', icon: 'Image', desc: 'Extract crisp transparent still frames from GIF animations and save as PNG.' },
      { name: 'BMP to JPG', slug: 'bmp-to-jpg', icon: 'ArrowRightLeft', desc: 'Convert heavy bitmap BMP image files into lightweight optimized JPGs.' },
      { name: 'BMP to PNG', slug: 'bmp-to-png', icon: 'ArrowRightLeft', desc: 'Convert uncompressed BMP files into standard lossless PNG images.' },
      { name: 'TIFF to JPG', slug: 'tiff-to-jpg', icon: 'ArrowRightLeft', desc: 'Convert multi-channel TIFF photo scans into universal web JPG images.' },
      { name: 'TIFF to PNG', slug: 'tiff-to-png', icon: 'ArrowRightLeft', desc: 'Convert high fidelity TIFF scan documents to crisp PNG graphics.' },
      { name: 'HEIC to JPG', slug: 'heic-to-jpg', icon: 'Smartphone', desc: 'Convert Apple iPhone HEIC/HEIF photos to universal JPG format.' },
      { name: 'HEIC to PNG', slug: 'heic-to-png', icon: 'Smartphone', desc: 'Convert iPhone HEIC photos into crisp transparent-ready PNG images.' },
      { name: 'AVIF to JPG', slug: 'avif-to-jpg', icon: 'ArrowRightLeft', desc: 'Convert modern AVIF image files into universal JPG photos.' },
      { name: 'AVIF to PNG', slug: 'avif-to-png', icon: 'ArrowRightLeft', desc: 'Convert AVIF images into lossless PNG images compatible everywhere.' },
      { name: 'Image to Base64', slug: 'image-to-base64', icon: 'Code', desc: 'Encode image files into base64 data URI string, HTML <img> tag, and CSS background.' },
      { name: 'Base64 to Image', slug: 'base64-to-image', icon: 'Eye', desc: 'Decode Base64 string back into previewable and downloadable PNG/JPG images.' },
      { name: 'Image Blur', slug: 'image-blur', icon: 'Droplets', desc: 'Apply smooth Gaussian blur effect with live radius adjustment slider.' },
      { name: 'Image Pixelate', slug: 'image-pixelate', icon: 'Grid', desc: 'Turn photos into 8-bit retro pixel art with adjustable block size slider.' },
      { name: 'Image Sharpen', slug: 'image-sharpen', icon: 'Sparkles', desc: 'Enhance image clarity and edge contrast with digital sharpening convolution matrix.' },
      { name: 'Image Brightness Adjuster', slug: 'image-brightness-adjuster', icon: 'Sun', desc: 'Adjust image brightness from dark to luminous with real-time canvas preview.' },
      { name: 'Image Contrast Adjuster', slug: 'image-contrast-adjuster', icon: 'Contrast', desc: 'Increase or decrease visual depth and dynamic contrast of any photo.' },
      { name: 'Image Grayscale', slug: 'image-grayscale', icon: 'Disc', desc: 'Convert color photos into classic monochrome black and white grayscale images.' },
      { name: 'Image Color Inverter', slug: 'image-color-inverter', icon: 'SunMoon', desc: 'Invert colors of any image to create negative photographic visuals.' },
      { name: 'Image Metadata Viewer', slug: 'image-metadata-viewer', icon: 'FileSearch', desc: 'Inspect EXIF tags, dimensions, color depth, camera info, and image header data.' },
      { name: 'EXIF Remover', slug: 'exif-remover', icon: 'ShieldAlert', desc: 'Strip GPS location, camera model, and personal EXIF metadata for 100% privacy.' },
      { name: 'Image Watermark Tool', slug: 'image-watermark-tool', icon: 'Stamp', desc: 'Add text or logo watermark overlay with custom opacity, rotation, and position grid.' },
      { name: 'Image Background Remover', slug: 'image-background-remover', icon: 'Scissors', desc: 'Remove image background colors, white borders, or green screens with tolerance slider.' }
    ]
  },
  'video-tools': {
    name: 'Video Tools',
    defaultIcon: 'Video',
    color: 'purple',
    hex: '#a855f7',
    tools: [
      { name: 'Video Compressor', slug: 'video-compressor', icon: 'Minimize2', desc: 'Compress video files by adjusting bitrate, resolution, and frame rate directly in browser.' },
      { name: 'Video Resizer', slug: 'video-resizer', icon: 'Maximize2', desc: 'Resize video dimensions to 1080p, 720p, 480p, or custom aspect ratio.' },
      { name: 'Video Cropper', slug: 'video-cropper', icon: 'Crop', desc: 'Crop video area to 1:1 Square, 9:16 Vertical for Reels/Shorts, or 16:9 Widescreen.' },
      { name: 'Video Trimmer', slug: 'video-trimmer', icon: 'Scissors', desc: 'Trim and cut video clips with start/end time sliders and live millisecond scrubbing.' },
      { name: 'Video Rotator', slug: 'video-rotator', icon: 'RotateCw', desc: 'Rotate video 90°, 180°, or 270° to fix sideways or upside-down mobile recordings.' },
      { name: 'Video Flipper', slug: 'video-flipper', icon: 'FlipHorizontal', desc: 'Flip video horizontally (mirror effect) or vertically with real-time video canvas.' },
      { name: 'Video Converter', slug: 'video-converter', icon: 'RefreshCw', desc: 'Convert video files between MP4, WebM, MOV, and AVI formats in browser.' },
      { name: 'MP4 to WEBM', slug: 'mp4-to-webm', icon: 'Zap', desc: 'Convert MP4 videos into high compression WebM video for web streaming.' },
      { name: 'WEBM to MP4', slug: 'webm-to-mp4', icon: 'ArrowRightLeft', desc: 'Convert WebM video clips into universal MP4 format playable on all devices.' },
      { name: 'MP4 to MOV', slug: 'mp4-to-mov', icon: 'ArrowRightLeft', desc: 'Convert MP4 video into Apple QuickTime MOV format for Final Cut Pro and Mac.' },
      { name: 'MOV to MP4', slug: 'mov-to-mp4', icon: 'ArrowRightLeft', desc: 'Convert iPhone or Mac MOV recordings to standard MP4 video.' },
      { name: 'AVI to MP4', slug: 'avi-to-mp4', icon: 'ArrowRightLeft', desc: 'Convert legacy AVI video files into modern highly-compatible MP4 files.' },
      { name: 'MKV to MP4', slug: 'mkv-to-mp4', icon: 'ArrowRightLeft', desc: 'Convert Matroska MKV movie files into standard MP4 format.' },
      { name: 'FLV to MP4', slug: 'flv-to-mp4', icon: 'ArrowRightLeft', desc: 'Convert Flash FLV video files into modern HTML5 MP4 video.' },
      { name: 'MPEG to MP4', slug: 'mpeg-to-mp4', icon: 'ArrowRightLeft', desc: 'Convert classic MPEG-1/MPEG-2 video clips into H.264 MP4 videos.' },
      { name: 'Video to GIF', slug: 'video-to-gif', icon: 'Film', desc: 'Convert video clips into animated looping GIF files with custom FPS and size.' },
      { name: 'GIF to Video', slug: 'gif-to-video', icon: 'Video', desc: 'Convert animated GIFs into MP4 or WebM video for Instagram, TikTok, and YouTube.' },
      { name: 'Video to MP3', slug: 'video-to-mp3', icon: 'Music', desc: 'Extract audio soundtrack from video and save as MP3 audio file.' },
      { name: 'Video to WAV', slug: 'video-to-wav', icon: 'Music', desc: 'Extract uncompressed lossless 16-bit PCM WAV audio from any video file.' },
      { name: 'Extract Audio from Video', slug: 'extract-audio-from-video', icon: 'Headphones', desc: 'Rip background music, speech, and sound effects from any video file.' },
      { name: 'Mute Video', slug: 'mute-video', icon: 'VolumeX', desc: 'Remove audio track from video to create completely silent video files.' },
      { name: 'Change Video Speed', slug: 'change-video-speed', icon: 'FastForward', desc: 'Speed up or slow down video playback from 0.25x to 4x speed.' },
      { name: 'Slow Motion Maker', slug: 'slow-motion-maker', icon: 'Clock', desc: 'Turn regular video into silky smooth 0.25x or 0.5x slow motion footage.' },
      { name: 'Time-Lapse Maker', slug: 'time-lapse-maker', icon: 'Zap', desc: 'Accelerate long video recordings into 2x, 4x, or 8x fast motion time-lapses.' },
      { name: 'Video Frame Extractor', slug: 'video-frame-extractor', icon: 'Camera', desc: 'Scrub through any video and capture full-resolution PNG / JPG stills.' },
      { name: 'Video Thumbnail Generator', slug: 'video-thumbnail-generator', icon: 'Image', desc: 'Select video frame, add title text and border badges to create YouTube covers.' },
      { name: 'Video Watermark Tool', slug: 'video-watermark-tool', icon: 'Stamp', desc: 'Add text or logo watermark onto video frames with position and opacity options.' },
      { name: 'Video Subtitle Extractor', slug: 'video-subtitle-extractor', icon: 'Subtitles', desc: 'Extract video closed-caption tracks or transcribe speech into VTT/SRT subtitles.' },
      { name: 'Video Metadata Viewer', slug: 'video-metadata-viewer', icon: 'FileSearch', desc: 'View video duration, dimensions, codecs, framerate, audio channels, and bitrate.' },
      { name: 'Video Aspect Ratio Converter', slug: 'video-aspect-ratio-converter', icon: 'Tv', desc: 'Convert 16:9 widescreen to 9:16 vertical reels with blurred video background padding.' }
    ]
  },
  'audio-tools': {
    name: 'Audio / Music Tools',
    defaultIcon: 'Music',
    color: 'pink',
    hex: '#ec4899',
    tools: [
      { name: 'MP3 Compressor', slug: 'mp3-compressor', icon: 'Minimize2', desc: 'Compress MP3 audio files by optimizing sample rates and audio channels.' },
      { name: 'WAV Compressor', slug: 'wav-compressor', icon: 'Minimize2', desc: 'Compress heavy WAV files to optimized sample rates without clipping.' },
      { name: 'Audio Compressor', slug: 'audio-compressor', icon: 'Sliders', desc: 'Dynamic range compressor: threshold, ratio, attack, and release processing.' },
      { name: 'MP3 Converter', slug: 'mp3-converter', icon: 'RefreshCw', desc: 'Convert any audio recording into standard MP3 format compatible with all players.' },
      { name: 'WAV Converter', slug: 'wav-converter', icon: 'RefreshCw', desc: 'Convert audio to uncompressed high fidelity 44.1kHz WAV PCM.' },
      { name: 'M4A Converter', slug: 'm4a-converter', icon: 'ArrowRightLeft', desc: 'Convert audio to Apple M4A format optimized for iOS devices.' },
      { name: 'AAC Converter', slug: 'aac-converter', icon: 'ArrowRightLeft', desc: 'Convert audio files into high efficiency Advanced Audio Coding AAC stream.' },
      { name: 'FLAC Converter', slug: 'flac-converter', icon: 'ArrowRightLeft', desc: 'Convert audio files to Free Lossless Audio Codec FLAC container.' },
      { name: 'OGG Converter', slug: 'ogg-converter', icon: 'ArrowRightLeft', desc: 'Convert audio files into open-source Ogg Vorbis format for games and web.' },
      { name: 'MP3 to WAV', slug: 'mp3-to-wav', icon: 'ArrowRightLeft', desc: 'Decode compressed MP3 files into uncompressed studio-ready WAV audio.' },
      { name: 'WAV to MP3', slug: 'wav-to-mp3', icon: 'ArrowRightLeft', desc: 'Convert huge WAV files to compact MP3 audio files for sharing.' },
      { name: 'MP3 to OGG', slug: 'mp3-to-ogg', icon: 'ArrowRightLeft', desc: 'Convert MP3 songs into open OGG audio format for web apps.' },
      { name: 'OGG to MP3', slug: 'ogg-to-mp3', icon: 'ArrowRightLeft', desc: 'Convert OGG Vorbis sound files to universal MP3 audio.' },
      { name: 'FLAC to MP3', slug: 'flac-to-mp3', icon: 'ArrowRightLeft', desc: 'Convert lossless FLAC music files into space-saving MP3 audio.' },
      { name: 'M4A to MP3', slug: 'm4a-to-mp3', icon: 'ArrowRightLeft', desc: 'Convert Apple voice memos and M4A files to standard MP3 files.' },
      { name: 'AAC to MP3', slug: 'aac-to-mp3', icon: 'ArrowRightLeft', desc: 'Convert AAC audio streams into universal MP3 audio files.' },
      { name: 'Audio Cutter', slug: 'audio-cutter', icon: 'Scissors', desc: 'Cut out unwanted audio sections or isolate your favorite ringtone segment.' },
      { name: 'Audio Trimmer', slug: 'audio-trimmer', icon: 'Scissors', desc: 'Trim start and end points of any audio file with live waveform visualizer.' },
      { name: 'Audio Merger', slug: 'audio-merger', icon: 'Layers', desc: 'Combine multiple audio tracks sequentially into one single continuous song.' },
      { name: 'Audio Joiner', slug: 'audio-joiner', icon: 'GitMerge', desc: 'Join audio tracks together with customizable crossfade transition effects.' },
      { name: 'Audio Recorder', slug: 'audio-recorder', icon: 'Mic', desc: 'Record live audio from your microphone with waveform visualizer and WAV download.' },
      { name: 'Voice Recorder', slug: 'voice-recorder', icon: 'Mic2', desc: 'Record crisp voice memos with echo cancellation and background noise reduction.' },
      { name: 'Audio Speed Changer', slug: 'audio-speed-changer', icon: 'FastForward', desc: 'Speed up or slow down audio playback from 0.5x to 2.5x speed.' },
      { name: 'Audio Volume Booster', slug: 'audio-volume-booster', icon: 'Volume2', desc: 'Boost audio track volume up to 400% with soft limiter to prevent distortion.' },
      { name: 'Audio Volume Normalizer', slug: 'audio-volume-normalizer', icon: 'Activity', desc: 'Normalize audio volume peaks to standard broadcast -0.1 dBFS loudness.' },
      { name: 'Audio Fade In/Out', slug: 'audio-fade-in-out', icon: 'TrendingUp', desc: 'Apply smooth fade-in at the beginning and fade-out at the end of audio tracks.' },
      { name: 'Audio Metadata Editor', slug: 'audio-metadata-editor', icon: 'Tag', desc: 'Edit song title, artist, album, track number, and year ID3 metadata tags.' },
      { name: 'Album Cover Extractor', slug: 'album-cover-extractor', icon: 'Disc', desc: 'Extract embedded album art image from MP3 and FLAC files or attach new cover.' },
      { name: 'Audio Waveform Generator', slug: 'audio-waveform-generator', icon: 'BarChart2', desc: 'Generate and download visual audio waveform graphics in PNG and SVG formats.' },
      { name: 'Audio to Text', slug: 'audio-to-text', icon: 'FileText', desc: 'Transcribe spoken audio and voice recordings to accurate text in real-time.' }
    ]
  },
  'gif-tools': {
    name: 'GIF Tools',
    defaultIcon: 'Film',
    color: 'emerald',
    hex: '#10b981',
    tools: [
      { name: 'GIF Maker', slug: 'gif-maker', icon: 'Film', desc: 'Create animated GIF from photos or graphic frames with customizable delay speed.' },
      { name: 'Video to GIF', slug: 'video-to-gif-maker', icon: 'Video', desc: 'Convert video clips into animated looping GIF animations with FPS control.' },
      { name: 'Images to GIF', slug: 'images-to-gif', icon: 'Image', desc: 'Stitch multiple photos into a smooth animated GIF slideshow.' },
      { name: 'GIF Compressor', slug: 'gif-compressor', icon: 'Minimize2', desc: 'Reduce GIF file size by optimizing color palette and reducing frame count.' },
      { name: 'GIF Resizer', slug: 'gif-resizer', icon: 'Maximize2', desc: 'Resize GIF dimensions (width and height) while keeping animation timing intact.' },
      { name: 'GIF Cropper', slug: 'gif-cropper', icon: 'Crop', desc: 'Crop animated GIF to square 1:1, banner, or custom rectangular area.' },
      { name: 'GIF Rotator', slug: 'gif-rotator', icon: 'RotateCw', desc: 'Rotate animated GIF 90°, 180°, or 270° across all animated frames.' },
      { name: 'GIF Speed Changer', slug: 'gif-speed-changer', icon: 'FastForward', desc: 'Speed up 2x or slow down 0.5x the frame rate playback of any animated GIF.' },
      { name: 'GIF Reverser', slug: 'gif-reverser', icon: 'Rewind', desc: 'Reverse GIF animation playback order from last frame to first frame.' },
      { name: 'GIF Optimizer', slug: 'gif-optimizer', icon: 'Sparkles', desc: 'Optimize GIF color depth (64/128/256 colors) to drastically reduce bandwidth.' },
      { name: 'GIF to MP4', slug: 'gif-to-mp4', icon: 'Video', desc: 'Convert animated GIF to MP4 video for faster loading and social media sharing.' },
      { name: 'GIF to WebP', slug: 'gif-to-webp', icon: 'Zap', desc: 'Convert animated GIF to modern animated WebP format for 70% smaller file size.' },
      { name: 'GIF Frame Extractor', slug: 'gif-frame-extractor', icon: 'Layers', desc: 'Extract all individual still frames from an animated GIF and download as ZIP.' },
      { name: 'GIF Splitter', slug: 'gif-splitter', icon: 'Grid', desc: 'Split animated GIF into individual image frames or tile clips.' },
      { name: 'GIF Watermark Tool', slug: 'gif-watermark-tool', icon: 'Stamp', desc: 'Add text or logo watermark overlay across all frames of an animated GIF.' }
    ]
  },
  'pdf-tools': {
    name: 'PDF Tools',
    defaultIcon: 'FileText',
    color: 'rose',
    hex: '#f43f5e',
    tools: [
      { name: 'PDF Compressor', slug: 'pdf-compressor', icon: 'Minimize2', desc: 'Compress PDF documents and reduce file size while preserving readability.' },
      { name: 'PDF Merger', slug: 'pdf-merger', icon: 'Layers', desc: 'Merge multiple PDF documents together into a single organized PDF file.' },
      { name: 'PDF Splitter', slug: 'pdf-splitter', icon: 'Scissors', desc: 'Split PDF pages into separate documents or extract specific page ranges.' },
      { name: 'PDF to JPG', slug: 'pdf-to-jpg', icon: 'Image', desc: 'Render PDF document pages into high resolution JPG images.' },
      { name: 'PDF to PNG', slug: 'pdf-to-png', icon: 'Image', desc: 'Convert PDF document pages into crisp transparent PNG graphics.' },
      { name: 'PDF to WEBP', slug: 'pdf-to-webp', icon: 'Zap', desc: 'Convert PDF pages into lightweight next-generation WEBP images.' },
      { name: 'JPG to PDF', slug: 'jpg-to-pdf', icon: 'FileText', desc: 'Convert JPG photos into a clean multi-page PDF document.' },
      { name: 'PNG to PDF', slug: 'png-to-pdf', icon: 'FileText', desc: 'Convert PNG graphics into formatted PDF pages with custom margins.' },
      { name: 'WEBP to PDF', slug: 'webp-to-pdf', icon: 'FileText', desc: 'Combine WEBP images into an organized multi-page PDF file.' },
      { name: 'Word to PDF', slug: 'word-to-pdf', icon: 'FileEdit', desc: 'Convert Word documents (.docx) or formatted text into printable PDF.' },
      { name: 'PDF to Word', slug: 'pdf-to-word', icon: 'FileText', desc: 'Extract formatted text and tables from PDF and export as Word document.' },
      { name: 'Excel to PDF', slug: 'excel-to-pdf', icon: 'Table', desc: 'Convert spreadsheet data and CSV tables into a styled PDF report.' },
      { name: 'PDF to Excel', slug: 'pdf-to-excel', icon: 'Sheet', desc: 'Extract tabular financial data from PDF documents into spreadsheet CSV format.' },
      { name: 'PowerPoint to PDF', slug: 'powerpoint-to-pdf', icon: 'Presentation', desc: 'Convert presentation slides into high quality multi-page PDF document.' },
      { name: 'PDF to PowerPoint', slug: 'pdf-to-powerpoint', icon: 'Tv', desc: 'Convert PDF document pages into presentation slides.' },
      { name: 'HTML to PDF', slug: 'html-to-pdf', icon: 'Code', desc: 'Render HTML code and web page markup into formatted PDF document.' },
      { name: 'Text to PDF', slug: 'text-to-pdf-converter', icon: 'FileText', desc: 'Convert plain text notes or articles into downloadable formatted PDF.' },
      { name: 'PDF Rotator', slug: 'pdf-rotator', icon: 'RotateCw', desc: 'Rotate PDF pages 90°, 180°, or 270° and save the corrected document.' },
      { name: 'PDF Cropper', slug: 'pdf-cropper', icon: 'Crop', desc: 'Crop PDF page margins to remove unnecessary headers, footers, or white space.' },
      { name: 'PDF Page Extractor', slug: 'pdf-page-extractor', icon: 'Copy', desc: 'Extract selected pages (e.g., 1, 3, 5-8) from PDF into a new PDF document.' },
      { name: 'PDF Page Deleter', slug: 'pdf-page-deleter', icon: 'Trash2', desc: 'Delete unwanted pages from PDF document and download cleaned file.' },
      { name: 'PDF Page Reorder', slug: 'pdf-page-reorder', icon: 'Move', desc: 'Reorder PDF page sequence visually with simple drag and drop.' },
      { name: 'PDF Page Numbering', slug: 'pdf-page-numbering', icon: 'Hash', desc: 'Add page numbers (Header or Footer) in custom formats to every PDF page.' },
      { name: 'PDF Watermark', slug: 'pdf-watermark', icon: 'Stamp', desc: 'Stamp custom text or confidential watermark across all PDF document pages.' },
      { name: 'PDF Metadata Editor', slug: 'pdf-metadata-editor', icon: 'Tag', desc: 'Edit PDF Title, Author, Subject, Keywords, and creation metadata.' },
      { name: 'PDF Metadata Remover', slug: 'pdf-metadata-remover', icon: 'ShieldCheck', desc: 'Strip all personal metadata, author tags, and revision history from PDF.' },
      { name: 'PDF Password Protector', slug: 'pdf-password-protector', icon: 'Lock', desc: 'Encrypt PDF documents with secure password protection.' },
      { name: 'PDF Unlocker', slug: 'pdf-unlocker', icon: 'Unlock', desc: 'Remove password security and printing restrictions from protected PDFs.' },
      { name: 'PDF Signer', slug: 'pdf-signer', icon: 'PenTool', desc: 'Draw electronic signature or upload signature image and place on any PDF page.' },
      { name: 'PDF Text Extractor', slug: 'pdf-text-extractor', icon: 'FileSearch', desc: 'Extract all plain text and copy content from any PDF document.' },
      { name: 'PDF OCR', slug: 'pdf-ocr', icon: 'ScanText', desc: 'Extract text from scanned PDF page images with optical character recognition.' },
      { name: 'PDF Searchable Converter', slug: 'pdf-searchable-converter', icon: 'Search', desc: 'Make scanned PDF documents selectable and searchable.' },
      { name: 'PDF Comparison Tool', slug: 'pdf-comparison-tool', icon: 'Columns', desc: 'Compare two PDF versions side-by-side to highlight visual changes.' },
      { name: 'PDF Scanner', slug: 'pdf-scanner', icon: 'Camera', desc: 'Scan paper documents using camera, enhance contrast, and export as PDF.' },
      { name: 'PDF Repair Tool', slug: 'pdf-repair-tool', icon: 'Wrench', desc: 'Repair damaged PDF headers, broken xref tables, and restore corrupted files.' }
    ]
  },
  'document-tools': {
    name: 'Document Tools',
    defaultIcon: 'FileCode2',
    color: 'cyan',
    hex: '#06b6d4',
    tools: [
      { name: 'Word Counter', slug: 'word-counter', icon: 'Hash', desc: 'Count words, characters, sentences, paragraphs, reading time, and speaking time in real time.' },
      { name: 'Character Counter', slug: 'character-counter', icon: 'Type', desc: 'Count total characters with and without whitespace for social posts and forms.' },
      { name: 'Sentence Counter', slug: 'sentence-counter', icon: 'AlignLeft', desc: 'Count total sentences and calculate average sentence length for readability.' },
      { name: 'Paragraph Counter', slug: 'paragraph-counter', icon: 'Menu', desc: 'Count paragraphs and line breaks in your articles and essays.' },
      { name: 'Reading Time Calculator', slug: 'reading-time-calculator', icon: 'Clock', desc: 'Calculate estimated reading time (200 WPM) and speech presentation duration.' },
      { name: 'Case Converter', slug: 'case-converter', icon: 'ToggleLeft', desc: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.' },
      { name: 'Uppercase Converter', slug: 'uppercase-converter', icon: 'ArrowUp', desc: 'Instantly convert all text to capital UPPERCASE letters.' },
      { name: 'Lowercase Converter', slug: 'lowercase-converter', icon: 'ArrowDown', desc: 'Instantly convert all letters into small lowercase characters.' },
      { name: 'Title Case Converter', slug: 'title-case-converter', icon: 'Heading', desc: 'Capitalize titles according to standard grammatical capitalization rules.' },
      { name: 'Sentence Case Converter', slug: 'sentence-case-converter', icon: 'CheckSquare', desc: 'Capitalize the first letter of each sentence while keeping proper names clean.' },
      { name: 'Remove Duplicate Lines', slug: 'remove-duplicate-lines', icon: 'ListFilter', desc: 'Remove duplicate lines from text lists with case-sensitive and trim options.' },
      { name: 'Remove Empty Lines', slug: 'remove-empty-lines', icon: 'Minimize', desc: 'Strip blank and whitespace-only lines to tidy up code and documents.' },
      { name: 'Remove Extra Spaces', slug: 'remove-extra-spaces', icon: 'Space', desc: 'Collapse multiple spaces, tabs, and trailing spaces into single clean spaces.' },
      { name: 'Text Sorter', slug: 'text-sorter', icon: 'ArrowUpDown', desc: 'Sort lines alphabetically (A-Z, Z-A), numerically, or by line length.' },
      { name: 'Text Reverser', slug: 'text-reverser', icon: 'FlipHorizontal', desc: 'Reverse text characters, reverse word order, or flip line sequence upside down.' },
      { name: 'Text Cleaner', slug: 'text-cleaner', icon: 'Eraser', desc: 'Strip HTML tags, emojis, special characters, and normalize messy text.' },
      { name: 'Text Diff Checker', slug: 'text-diff-checker', icon: 'GitCompare', desc: 'Compare two text snippets side-by-side to highlight added and deleted words.' },
      { name: 'Find and Replace', slug: 'find-and-replace', icon: 'Replace', desc: 'Search and replace text occurrences with case-sensitive and regex support.' },
      { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', icon: 'BookOpen', desc: 'Generate placeholder dummy text by paragraphs, sentences, or word counts.' },
      { name: 'Markdown Editor', slug: 'markdown-editor', icon: 'FileEdit', desc: 'Edit Markdown with split-screen live HTML preview and syntax highlighting.' },
      { name: 'Markdown Previewer', slug: 'markdown-previewer', icon: 'Eye', desc: 'Render and preview Markdown documents with support for tables and code blocks.' },
      { name: 'HTML Previewer', slug: 'html-previewer', icon: 'Code', desc: 'Live sandboxed preview of HTML, CSS, and JavaScript snippets.' },
      { name: 'Rich Text Editor', slug: 'rich-text-editor', icon: 'Edit3', desc: 'WYSIWYG document editor with formatting toolbar: bold, italic, headings, and lists.' },
      { name: 'Text to PDF', slug: 'text-to-pdf-doc', icon: 'FileDown', desc: 'Convert plain text notes or articles into a clean formatted PDF document.' },
      { name: 'Text to Image', slug: 'text-to-image-card', icon: 'Image', desc: 'Render quotes, code snippets, or text onto beautifully styled social card images.' }
    ]
  },
  'file-tools': {
    name: 'File Tools',
    defaultIcon: 'FolderArchive',
    color: 'indigo',
    hex: '#6366f1',
    tools: [
      { name: 'ZIP Creator', slug: 'zip-creator', icon: 'Archive', desc: 'Compress multiple files and folders into standard .ZIP archive files.' },
      { name: 'ZIP Extractor', slug: 'zip-extractor', icon: 'FolderArchive', desc: 'Unpack .ZIP archives in browser, inspect folder tree, and download extracted files.' },
      { name: 'TAR Creator', slug: 'tar-creator', icon: 'Archive', desc: 'Bundle multiple files into standard Unix .TAR archive packages.' },
      { name: 'TAR Extractor', slug: 'tar-extractor', icon: 'FolderArchive', desc: 'Extract Unix .TAR archive files and save contained files directly in browser.' },
      { name: 'GZIP Compressor', slug: 'gzip-compressor', icon: 'Minimize2', desc: 'Compress files using high-efficiency GZIP compression algorithm.' },
      { name: 'File Compressor', slug: 'file-compressor', icon: 'Archive', desc: 'Universal multi-file compression utility to shrink archives.' },
      { name: 'File Size Converter', slug: 'file-size-converter', icon: 'ArrowLeftRight', desc: 'Convert bytes, KB, MB, GB, TB, and PB with decimal and binary (KiB/MiB) modes.' },
      { name: 'File Extension Checker', slug: 'file-extension-checker', icon: 'FileSearch', desc: 'Verify if a file extension matches its true binary header format.' },
      { name: 'MIME Type Checker', slug: 'mime-type-checker', icon: 'Info', desc: 'Detect true MIME content type of files via binary magic numbers.' },
      { name: 'File Hash Generator', slug: 'file-hash-generator', icon: 'Hash', desc: 'Calculate cryptographic SHA-256, SHA-512, and SHA-1 hashes of any uploaded file.' },
      { name: 'File Checksum Generator', slug: 'file-checksum-generator', icon: 'ShieldCheck', desc: 'Generate CRC32 and Adler-32 file integrity checksums.' },
      { name: 'File Renamer', slug: 'file-renamer', icon: 'Edit3', desc: 'Rename files with custom extension and clean filename normalization.' },
      { name: 'Batch File Renamer', slug: 'batch-file-renamer', icon: 'Files', desc: 'Batch rename multiple files with prefixes, suffixes, numbering sequences, and replacements.' },
      { name: 'File Metadata Viewer', slug: 'file-metadata-viewer', icon: 'FileText', desc: 'Inspect file properties, byte sizes, MIME types, and header signatures.' },
      { name: 'File Metadata Remover', slug: 'file-metadata-remover', icon: 'ShieldAlert', desc: 'Remove system tracking attributes and personal metadata timestamps from files.' },
      { name: 'Base64 File Encoder', slug: 'base64-file-encoder', icon: 'Code', desc: 'Encode any binary file into Base64 data URI string for embedding.' },
      { name: 'Base64 File Decoder', slug: 'base64-file-decoder', icon: 'Download', desc: 'Decode Base64 string back into original downloadable binary file.' },
      { name: 'File Previewer', slug: 'file-previewer', icon: 'Eye', desc: 'Universal file viewer for images, audio, video, PDFs, text, code, and CSV.' },
      { name: 'Binary File Viewer', slug: 'binary-file-viewer', icon: 'Binary', desc: 'Inspect raw binary bytes in classic hex dump layout with offsets and ASCII preview.' },
      { name: 'File Format Identifier', slug: 'file-format-identifier', icon: 'HelpCircle', desc: 'Identify unknown file formats by analyzing binary magic number signatures.' }
    ]
  },
  'unit-converters': {
    name: 'Unit Converters',
    defaultIcon: 'ArrowLeftRight',
    color: 'teal',
    hex: '#14b8a6',
    tools: [
      { name: 'Length Converter', slug: 'length-converter', icon: 'Ruler', desc: 'Convert meters, kilometers, centimeters, millimeters, miles, yards, feet, and inches.' },
      { name: 'Distance Converter', slug: 'distance-converter', icon: 'Navigation', desc: 'Convert travel distances across kilometers, miles, nautical miles, and astronomical units.' },
      { name: 'Weight Converter', slug: 'weight-converter', icon: 'Scale', desc: 'Convert kilograms, grams, milligrams, pounds, ounces, stones, and metric tons.' },
      { name: 'Mass Converter', slug: 'mass-converter', icon: 'Scale', desc: 'Convert mass units including kilograms, atomic mass units, carats, grams, and slugs.' },
      { name: 'Area Converter', slug: 'area-converter', icon: 'Square', desc: 'Convert square meters, square feet, square kilometers, acres, hectares, and square miles.' },
      { name: 'Volume Converter', slug: 'volume-converter', icon: 'Box', desc: 'Convert liters, milliliters, gallons, quarts, pints, cups, and cubic meters.' },
      { name: 'Temperature Converter', slug: 'temperature-converter', icon: 'Thermometer', desc: 'Convert Celsius, Fahrenheit, Kelvin, and Rankine with instant two-way formulas.' },
      { name: 'Speed Converter', slug: 'speed-converter', icon: 'Gauge', desc: 'Convert km/h, mph, m/s, knots, and Mach speed.' },
      { name: 'Time Converter', slug: 'time-converter', icon: 'Clock', desc: 'Convert seconds, minutes, hours, days, weeks, months, years, and milliseconds.' },
      { name: 'Data Storage Converter', slug: 'data-storage-converter', icon: 'HardDrive', desc: 'Convert Bytes, KB, MB, GB, TB, PB, KiB, MiB, and GiB.' },
      { name: 'Pressure Converter', slug: 'pressure-converter', icon: 'Compass', desc: 'Convert Pascal, Bar, PSI, Standard Atmosphere, Torr, and mmHg.' },
      { name: 'Energy Converter', slug: 'energy-converter', icon: 'Zap', desc: 'Convert Joules, Calories, Kilocalories, Watt-hours, Kilowatt-hours, and BTU.' },
      { name: 'Power Converter', slug: 'power-converter', icon: 'Cpu', desc: 'Convert Watts, Kilowatts, Megawatts, Horsepower, and BTU/hour.' },
      { name: 'Angle Converter', slug: 'angle-converter', icon: 'PieChart', desc: 'Convert Degrees, Radians, Gradians, Arcminutes, and Arcseconds.' },
      { name: 'Fuel Economy Converter', slug: 'fuel-economy-converter', icon: 'Fuel', desc: 'Convert MPG (US), MPG (UK), Liters per 100km (L/100km), and km/L.' },
      { name: 'Frequency Converter', slug: 'frequency-converter', icon: 'Radio', desc: 'Convert Hertz, Kilohertz, Megahertz, Gigahertz, and Revolutions per minute (RPM).' },
      { name: 'Force Converter', slug: 'force-converter', icon: 'Target', desc: 'Convert Newtons, Kilonewtons, Pound-force (lbf), Dyne, and Kilogram-force.' },
      { name: 'Torque Converter', slug: 'torque-converter', icon: 'Repeat', desc: 'Convert Newton-meters (N·m), Pound-feet (lb-ft), and Pound-inches.' },
      { name: 'Digital Transfer Rate Converter', slug: 'digital-transfer-rate-converter', icon: 'Wifi', desc: 'Convert network transfer speeds: bps, Kbps, Mbps, Gbps, KB/s, and MB/s.' },
      { name: 'Density Converter', slug: 'density-converter', icon: 'Layers', desc: 'Convert material density: kg/m³, g/cm³, lb/ft³, and lb/in³.' },
      { name: 'Electric Current Converter', slug: 'electric-current-converter', icon: 'Zap', desc: 'Convert Amperes, Milliamperes, Microamperes, and Kiloamperes.' },
      { name: 'Voltage Converter', slug: 'voltage-converter', icon: 'Zap', desc: 'Convert Volts, Millivolts, Kilovolts, and Microvolts.' },
      { name: 'Electric Resistance Converter', slug: 'electric-resistance-converter', icon: 'Activity', desc: 'Convert Ohms, Milliohms, Kiloohms, and Megaohms.' },
      { name: 'Sound / Decibel Converter', slug: 'sound-decibel-converter', icon: 'Volume2', desc: 'Convert sound pressure levels: dB SPL, dBu, dBm, Bel, and Neper.' },
      { name: 'Typography / Pixel Converter', slug: 'typography-pixel-converter', icon: 'Type', desc: 'Convert Pixels (px), Points (pt), Picas (pc), REM, and EM.' },
      { name: 'Cooking Volume Converter', slug: 'cooking-volume-converter', icon: 'Coffee', desc: 'Convert recipe units: Teaspoons, Tablespoons, Cups, Fluid Ounces, and Milliliters.' },
      { name: 'Shoe Size Converter', slug: 'shoe-size-converter', icon: 'Footprints', desc: 'Convert international shoe sizes: US Men, US Women, UK, EU, CM, and Inches.' },
      { name: 'Currency Converter', slug: 'currency-converter', icon: 'DollarSign', desc: 'Convert global currencies (USD, EUR, GBP, JPY, CAD, AUD, INR) with live rates.' },
      { name: 'Pace Converter', slug: 'pace-converter', icon: 'Timer', desc: 'Convert running pace (min/km, min/mile) to speed (km/h, mph) and race finish times.' },
      { name: 'Number Base Converter', slug: 'number-base-converter', icon: 'Binary', desc: 'Convert numbers across Binary, Octal, Decimal, Hexadecimal, and Base36.' },
      { name: 'Flow Rate Converter', slug: 'flow-rate-converter', icon: 'Droplet', desc: 'Convert volumetric fluid flow: Liters/sec, Liters/min, GPM, and m³/hour.' },
      { name: 'Illumination / Lux Converter', slug: 'illumination-lux-converter', icon: 'Sun', desc: 'Convert light levels: Lux, Foot-candles, Lumens/m², and Phot.' },
      { name: 'Viscosity Converter', slug: 'viscosity-converter', icon: 'Flame', desc: 'Convert dynamic and kinematic viscosity: Pascal-seconds, Poise, and Centistokes.' },
      { name: 'Radiation Converter', slug: 'radiation-converter', icon: 'Shield', desc: 'Convert ionizing radiation units: Sieverts, Millisieverts, Gray, Rad, and Roentgen.' },
      { name: 'Pixels to REM Converter', slug: 'pixels-to-rem-converter', icon: 'Ruler', desc: 'Convert CSS Pixels to REM with custom base root font size (16px default).' }
    ]
  }
};

// Vibrant color palette pool so EVERY tool has a distinct vibrant color
const PALETTE_COLORS = [
  { name: 'amber', hex: '#f59e0b', colorClass: 'text-amber-500', bgGradient: 'from-amber-500 to-orange-500' },
  { name: 'orange', hex: '#f97316', colorClass: 'text-orange-500', bgGradient: 'from-orange-500 to-amber-600' },
  { name: 'purple', hex: '#a855f7', colorClass: 'text-purple-500', bgGradient: 'from-purple-500 to-violet-600' },
  { name: 'violet', hex: '#8b5cf6', colorClass: 'text-violet-500', bgGradient: 'from-violet-500 to-indigo-600' },
  { name: 'pink', hex: '#ec4899', colorClass: 'text-pink-500', bgGradient: 'from-pink-500 to-rose-600' },
  { name: 'fuchsia', hex: '#d946ef', colorClass: 'text-fuchsia-500', bgGradient: 'from-fuchsia-500 to-purple-600' },
  { name: 'emerald', hex: '#10b981', colorClass: 'text-emerald-500', bgGradient: 'from-emerald-500 to-teal-600' },
  { name: 'teal', hex: '#14b8a6', colorClass: 'text-teal-500', bgGradient: 'from-teal-500 to-cyan-600' },
  { name: 'rose', hex: '#f43f5e', colorClass: 'text-rose-500', bgGradient: 'from-rose-500 to-pink-600' },
  { name: 'red', hex: '#ef4444', colorClass: 'text-red-500', bgGradient: 'from-red-500 to-rose-600' },
  { name: 'cyan', hex: '#06b6d4', colorClass: 'text-cyan-500', bgGradient: 'from-cyan-500 to-blue-600' },
  { name: 'sky', hex: '#0ea5e9', colorClass: 'text-sky-500', bgGradient: 'from-sky-500 to-cyan-600' },
  { name: 'indigo', hex: '#6366f1', colorClass: 'text-indigo-500', bgGradient: 'from-indigo-500 to-purple-600' },
  { name: 'blue', hex: '#3b82f6', colorClass: 'text-blue-500', bgGradient: 'from-blue-500 to-indigo-600' },
  { name: 'lime', hex: '#84cc16', colorClass: 'text-lime-500', bgGradient: 'from-lime-500 to-emerald-600' },
  { name: 'yellow', hex: '#eab308', colorClass: 'text-yellow-500', bgGradient: 'from-yellow-500 to-amber-600' }
];

let toolList = [];
let colorIdx = 0;

for (const [catId, catInfo] of Object.entries(CATEGORIES_DATA)) {
  catInfo.tools.forEach((t, i) => {
    const palette = PALETTE_COLORS[colorIdx % PALETTE_COLORS.length];
    colorIdx++;
    toolList.push({
      id: t.slug,
      slug: t.slug,
      name: t.name,
      category: catId,
      componentId: t.slug,
      icon: t.icon,
      isPopular: i < 5,
      isNew: i > 25,
      accentColor: palette.name,
      accentHex: palette.hex,
      colorClass: palette.colorClass,
      bgGradient: palette.bgGradient,
      shortDesc: t.desc,
      description: `${t.name} is a 100% free, fast, and privacy-first online tool. Process files instantly in your browser with zero file uploads to servers.`,
      keywords: [t.name.toLowerCase(), t.slug.replace(/-/g, ' '), `${t.name.toLowerCase()} online`, `free ${t.name.toLowerCase()}`],
      seo: {
        title: `${t.name} — Free 100% Online Tool | Toolio`,
        description: `${t.desc} Free, instant, and secure browser processing on Toolio.`,
        canonicalPath: `/tools/${t.slug}`,
        schemaType: 'WebApplication'
      },
      howToUse: [
        'Select or drag-and-drop your input files or enter your parameters.',
        'Customize options such as dimensions, quality, format, or conversion target.',
        'Review the instant real-time live preview.',
        'Click the action button to process and download your result instantly.'
      ],
      features: [
        '100% client-side processing inside your browser for maximum privacy',
        'No file size restrictions or artificial server queues',
        'Instant live preview with side-by-side comparison',
        'Zero registration or software installation required',
        'High-performance processing with instant download'
      ],
      faqs: [
        {
          question: `Is ${t.name} free to use?`,
          answer: `Yes, ${t.name} on Toolio is 100% free with unlimited usage and no account required.`
        },
        {
          question: `Are my files uploaded to any external server?`,
          answer: `No. All file processing happens locally in your browser memory using HTML5 Canvas, Web Audio, and WebAssembly. Your files never leave your device.`
        }
      ]
    });
  });
}

console.log(`Generated ${toolList.length} tools across ${Object.keys(CATEGORIES_DATA).length} categories!`);

// Write to TypeScript file
const fileContent = `import { ToolDefinition } from '../types';

export const TOOLS_REGISTRY: ToolDefinition[] = ${JSON.stringify(toolList, null, 2)};

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter(t => t.category === categoryId);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS_REGISTRY.filter(t => t.isPopular);
}

export function searchTools(query: string): ToolDefinition[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return TOOLS_REGISTRY.filter(tool => {
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortDesc.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some(k => k.toLowerCase().includes(q))
    );
  });
}
`;

fs.writeFileSync('src/data/toolsRegistry.ts', fileContent, 'utf8');
console.log('Successfully written to src/data/toolsRegistry.ts');
