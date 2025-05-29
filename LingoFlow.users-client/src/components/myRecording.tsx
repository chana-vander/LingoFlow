// // "use client"
// // import type React from "react"
// // import { useState, useEffect } from "react"
// // import { observer } from "mobx-react-lite"
// // import {
// //     Box,
// //     Typography,
// //     Grid,
// //     Card,
// //     CardContent,
// //     CardActions,
// //     Button,
// //     Chip,
// //     IconButton,
// //     TextField,
// //     FormControl,
// //     InputLabel,
// //     Select,
// //     MenuItem,
// //     Paper,
// //     LinearProgress,
// //     Tooltip,
// //     Fab,
// //     Dialog,
// //     DialogTitle,
// //     DialogContent,
// //     DialogActions,
// //     Divider,
// //     Stack,
// //     Rating,
// // } from "@mui/material"
// // import {
// //     PlayArrow,
// //     Pause,
// //     // FeedbackIcon,
// //     Feedback,
// //     Download,
// //     Star,
// //     StarBorder,
// //     Search,
// //     FilterList,
// //     TrendingUp,
// //     Schedule,
// //     Topic,
// //     VolumeUp,
// //     Assessment,
// //     Close,
// //     DateRange,
// //     School,
// //     Language,
// // } from "@mui/icons-material"
// // import { Line } from "react-chartjs-2"
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     PointElement,
// //     LineElement,
// //     Title,
// //     Tooltip as ChartTooltip,
// //     Legend,
// // } from "chart.js"
// // import recordStore from "../stores/recordStore"
// // import type { Record } from "../models/record"
// // import "../css/myRecording.css"
// // import userStore from "../stores/userStore"

// // ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)

// // interface RecordingCardProps {
// //     record: Record
// //     onPlay: (record: Record) => void
// //     onViewFeedback: (record: Record) => void
// //     onDownload: (record: Record) => void
// //     onToggleFavorite: (record: Record) => void
// //     isPlaying: boolean
// //     isFavorite: boolean
// // }

// // const RecordingCard: React.FC<RecordingCardProps> = observer(
// //     ({ record, onPlay, onViewFeedback, onDownload, onToggleFavorite, isPlaying, isFavorite }) => {
// //         const getLevelColor = (level: string) => {
// //             switch (level.toLowerCase()) {
// //                 case "beginner":
// //                     return "#4CAF50"
// //                 case "intermediate":
// //                     return "#FF9800"
// //                 case "advanced":
// //                     return "#F44336"
// //                 default:
// //                     return "#2196F3"
// //             }
// //         }

// //         const getLevelIcon = (level: string) => {
// //             switch (level.toLowerCase()) {
// //                 case "beginner":
// //                     return "🌱"
// //                 case "intermediate":
// //                     return "🌿"
// //                 case "advanced":
// //                     return "🌳"
// //                 default:
// //                     return "📚"
// //             }
// //         }

// //         const formatDate = (date: Date) => {
// //             return new Intl.DateTimeFormat("he-IL", {
// //                 year: "numeric",
// //                 month: "short",
// //                 day: "numeric",
// //                 hour: "2-digit",
// //                 minute: "2-digit",
// //             }).format(new Date(date))
// //         }

// //         const mockProgressData = {
// //             labels: ["הקלטה 1", "הקלטה 2", "הקלטה 3", "הקלטה זו"],
// //             datasets: [
// //                 {
// //                     label: "ציון כללי",
// //                     data: [65, 72, 78, 85],
// //                     borderColor: "#6366f1",
// //                     backgroundColor: "rgba(99, 102, 241, 0.1)",
// //                     tension: 0.4,
// //                     pointBackgroundColor: "#6366f1",
// //                     pointBorderColor: "#ffffff",
// //                     pointBorderWidth: 2,
// //                     pointRadius: 6,
// //                 },
// //             ],
// //         }

// //         const chartOptions = {
// //             responsive: true,
// //             maintainAspectRatio: false,
// //             plugins: {
// //                 legend: {
// //                     display: false,
// //                 },
// //             },
// //             scales: {
// //                 y: {
// //                     beginAtZero: true,
// //                     max: 100,
// //                     grid: {
// //                         color: "rgba(0, 0, 0, 0.1)",
// //                     },
// //                     ticks: {
// //                         font: {
// //                             size: 10,
// //                         },
// //                     },
// //                 },
// //                 x: {
// //                     grid: {
// //                         display: false,
// //                     },
// //                     ticks: {
// //                         font: {
// //                             size: 10,
// //                         },
// //                     },
// //                 },
// //             },
// //         }

// //         return (
// //             <Card className="recording-card" elevation={3}>
// //                 <CardContent className="recording-card-content">
// //                     <Box className="recording-header">
// //                         <Box className="recording-info">
// //                             <Typography variant="h6" className="recording-title">
// //                                 {record.name}
// //                             </Typography>
// //                             <Box className="recording-meta">
// //                                 <Chip
// //                                     icon={<Schedule />}
// //                                     label={formatDate(record.date)}
// //                                     size="small"
// //                                     className="meta-chip date-chip"
// //                                 />
// //                                 <Chip icon={<Topic />} label={`נושא ${record.topicId}`} size="small" className="meta-chip topic-chip" />
// //                                 <Chip
// //                                     label={`${getLevelIcon("intermediate")} Intermediate`}
// //                                     size="small"
// //                                     className="meta-chip level-chip"
// //                                     style={{ backgroundColor: getLevelColor("intermediate") }}
// //                                 />
// //                             </Box>
// //                         </Box>
// //                         <IconButton
// //                             onClick={() => onToggleFavorite(record)}
// //                             className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
// //                         >
// //                             {isFavorite ? <Star /> : <StarBorder />}
// //                         </IconButton>
// //                     </Box>

// //                     <Box className="recording-duration">
// //                         <VolumeUp className="duration-icon" />
// //                         <Typography variant="body2" className="duration-text">
// //                             משך ההקלטה: {record.length}
// //                         </Typography>
// //                     </Box>

// //                     <Box className="progress-chart">
// //                         <Typography variant="subtitle2" className="chart-title">
// //                             <TrendingUp /> התקדמות בציונים
// //                         </Typography>
// //                         <Box className="chart-container">
// //                             <Line data={mockProgressData} options={chartOptions} />
// //                         </Box>
// //                     </Box>

// //                     <Box className="recording-score">
// //                         <Assessment className="score-icon" />
// //                         <Typography variant="body2" className="score-text">
// //                             ציון אחרון:
// //                         </Typography>
// //                         <Rating value={4.2} precision={0.1} readOnly size="small" />
// //                         <Typography variant="body2" className="score-number">
// //                             85/100
// //                         </Typography>
// //                     </Box>
// //                 </CardContent>

// //                 <CardActions className="recording-actions">
// //                     <Button
// //                         startIcon={isPlaying ? <Pause /> : <PlayArrow />}
// //                         onClick={() => onPlay(record)}
// //                         className={`action-btn play-btn ${isPlaying ? "playing" : ""}`}
// //                         variant="contained"
// //                     >
// //                         {isPlaying ? "השהה" : "האזן"}
// //                     </Button>

// //                     <Button
// //                         startIcon={<Feedback />}
// //                         onClick={() => onViewFeedback(record)}
// //                         className="action-btn feedback-btn"
// //                         variant="outlined"
// //                     >
// //                         צפה במשוב
// //                     </Button>

// //                     <Tooltip title="הורד הקלטה">
// //                         <IconButton onClick={() => onDownload(record)} className="action-btn download-btn">
// //                             <Download />
// //                         </IconButton>
// //                     </Tooltip>
// //                 </CardActions>
// //             </Card>
// //         )
// //     },
// // )

// // const FilterPanel: React.FC<{
// //     searchTerm: string
// //     setSearchTerm: (term: string) => void
// //     sortBy: string
// //     setSortBy: (sort: string) => void
// //     filterLevel: string
// //     setFilterLevel: (level: string) => void
// //     filterTopic: string
// //     setFilterTopic: (topic: string) => void
// // }> = ({ searchTerm, setSearchTerm, sortBy, setSortBy, filterLevel, setFilterLevel, filterTopic, setFilterTopic }) => {
// //     return (
// //         <Paper className="filter-panel" elevation={2}>
// //             <Box className="filter-header">
// //                 <FilterList className="filter-icon" />
// //                 <Typography variant="h6" className="filter-title">
// //                     סינון וחיפוש
// //                 </Typography>
// //             </Box>

// //             <Divider className="filter-divider" />

// //             <Stack spacing={3} className="filter-content">
// //                 <TextField
// //                     fullWidth
// //                     placeholder="חפש הקלטות..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     InputProps={{
// //                         startAdornment: <Search className="search-icon" />,
// //                     }}
// //                     className="search-field"
// //                 />

// //                 <FormControl fullWidth>
// //                     <InputLabel>מיון לפי</InputLabel>
// //                     <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="מיון לפי">
// //                         <MenuItem value="date">תאריך</MenuItem>
// //                         <MenuItem value="name">שם</MenuItem>
// //                         <MenuItem value="score">ציון</MenuItem>
// //                         <MenuItem value="length">משך</MenuItem>
// //                     </Select>
// //                 </FormControl>

// //                 <FormControl fullWidth>
// //                     <InputLabel>רמת קושי</InputLabel>
// //                     <Select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} label="רמת קושי">
// //                         <MenuItem value="">הכל</MenuItem>
// //                         <MenuItem value="beginner">🌱 Beginner</MenuItem>
// //                         <MenuItem value="intermediate">🌿 Intermediate</MenuItem>
// //                         <MenuItem value="advanced">🌳 Advanced</MenuItem>
// //                     </Select>
// //                 </FormControl>

// //                 <FormControl fullWidth>
// //                     <InputLabel>נושא</InputLabel>
// //                     <Select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} label="נושא">
// //                         <MenuItem value="">כל הנושאים</MenuItem>
// //                         <MenuItem value="1">שיחת חברים</MenuItem>
// //                         <MenuItem value="2">ראיון עבודה</MenuItem>
// //                         <MenuItem value="3">מצגת עסקית</MenuItem>
// //                         <MenuItem value="4">שיחה יומיומית</MenuItem>
// //                     </Select>
// //                 </FormControl>
// //             </Stack>
// //         </Paper>
// //     )
// // }

// // const FeedbackModal: React.FC<{
// //     open: boolean
// //     onClose: () => void
// //     record: Record | null
// //     feedback: any | null
// // }> = ({ open, onClose, record, feedback }) => {
// //     if (!record || !feedback) return null

// //     return (
// //         <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="feedback-modal">
// //             <DialogTitle className="feedback-modal-title">
// //                 <Box className="modal-title-content">
// //                     <Feedback className="modal-title-icon" />
// //                     <Typography variant="h5">משוב מפורט - {record.name}</Typography>
// //                     <IconButton onClick={onClose} className="close-btn">
// //                         <Close />
// //                     </IconButton>
// //                 </Box>
// //             </DialogTitle>

// //             <DialogContent className="feedback-modal-content">
// //                 <Grid container spacing={3}>
// //                     <Grid item xs={12} md={6}>
// //                         <Paper className="feedback-section" elevation={1}>
// //                             <Typography variant="h6" className="section-title">
// //                                 ציונים מפורטים
// //                             </Typography>
// //                             <Box className="score-item">
// //                                 <Typography>דקדוק:</Typography>
// //                                 <LinearProgress
// //                                     variant="determinate"
// //                                     value={feedback.grammarScore}
// //                                     className="score-progress grammar"
// //                                 />
// //                                 <Typography className="score-value">{feedback.grammarScore}/100</Typography>
// //                             </Box>
// //                             <Box className="score-item">
// //                                 <Typography>שטף דיבור:</Typography>
// //                                 <LinearProgress
// //                                     variant="determinate"
// //                                     value={feedback.fluencyScore}
// //                                     className="score-progress fluency"
// //                                 />
// //                                 <Typography className="score-value">{feedback.fluencyScore}/100</Typography>
// //                             </Box>
// //                             <Box className="score-item">
// //                                 <Typography>אוצר מילים:</Typography>
// //                                 <LinearProgress
// //                                     variant="determinate"
// //                                     value={feedback.vocabularyScore}
// //                                     className="score-progress vocabulary"
// //                                 />
// //                                 <Typography className="score-value">{feedback.vocabularyScore}/100</Typography>
// //                             </Box>
// //                         </Paper>
// //                     </Grid>

// //                     <Grid item xs={12} md={6}>
// //                         <Paper className="feedback-section" elevation={1}>
// //                             <Typography variant="h6" className="section-title">
// //                                 ציון כללי
// //                             </Typography>
// //                             <Box className="overall-score">
// //                                 <Typography variant="h2" className="score-number">
// //                                     {feedback.score}
// //                                 </Typography>
// //                                 <Typography variant="h6" className="score-total">
// //                                     /100
// //                                 </Typography>
// //                             </Box>
// //                             <Rating value={feedback.score / 20} precision={0.1} readOnly size="large" className="score-rating" />
// //                         </Paper>
// //                     </Grid>

// //                     <Grid item xs={12}>
// //                         <Paper className="feedback-section" elevation={1}>
// //                             <Typography variant="h6" className="section-title">
// //                                 משוב כללי
// //                             </Typography>
// //                             <Typography className="feedback-text">{feedback.generalFeedback}</Typography>
// //                         </Paper>
// //                     </Grid>

// //                     <Grid item xs={12} md={4}>
// //                         <Paper className="feedback-section" elevation={1}>
// //                             <Typography variant="h6" className="section-title">
// //                                 הערות דקדוק
// //                             </Typography>
// //                             <Typography className="feedback-text">{feedback.grammarComment}</Typography>
// //                         </Paper>
// //                     </Grid>

// //                     <Grid item xs={12} md={4}>
// //                         <Paper className="feedback-section" elevation={1}>
// //                             <Typography variant="h6" className="section-title">
// //                                 הערות שטף דיבור
// //                             </Typography>
// //                             <Typography className="feedback-text">{feedback.fluencyComment}</Typography>
// //                         </Paper>
// //                     </Grid>

// //                     <Grid item xs={12} md={4}>
// //                         <Paper className="feedback-section" elevation={1}>
// //                             <Typography variant="h6" className="section-title">
// //                                 הערות אוצר מילים
// //                             </Typography>
// //                             <Typography className="feedback-text">{feedback.vocabularyComment}</Typography>
// //                         </Paper>
// //                     </Grid>
// //                 </Grid>
// //             </DialogContent>

// //             <DialogActions className="feedback-modal-actions">
// //                 <Button onClick={onClose} variant="contained" className="close-modal-btn">
// //                     סגור
// //                 </Button>
// //             </DialogActions>
// //         </Dialog>
// //     )
// // }

// // const MyRecordings: React.FC = observer(() => {
// //     const [records, setRecords] = useState<Record[]>([])
// //     const [loading, setLoading] = useState(true)
// //     const [searchTerm, setSearchTerm] = useState("")
// //     const [sortBy, setSortBy] = useState("date")
// //     const [filterLevel, setFilterLevel] = useState("")
// //     const [filterTopic, setFilterTopic] = useState("")
// //     const [playingRecord, setPlayingRecord] = useState<Record | null>(null)
// //     const [favorites, setFavorites] = useState<Set<number>>(new Set())
// //     const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
// //     const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
// //     const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null)

// //     useEffect(() => {
// //         loadRecords()
// //     }, [])

// //     const loadRecords = async () => {
// //         setLoading(true)
// //         try {
// //             const userId = userStore.user?.id; 
// //             const fetchedRecords = await recordStore.getRecordsByUserId(userId);
// //             setRecords(fetchedRecords)
// //         } catch (error) {
// //             console.error("Error loading records:", error)
// //         } finally {
// //             setLoading(false)
// //         }
// //     }

// //     const handlePlay = (record: Record) => {
// //         if (playingRecord?.id === record.id) {
// //             setPlayingRecord(null)
// //         } else {
// //             setPlayingRecord(record)
// //             // Here you would implement actual audio playback
// //         }
// //     }

// //     const handleViewFeedback = async (record: Record) => {
// //         setSelectedRecord(record)
// //         // Mock feedback data - replace with actual API call
// //         const mockFeedback = {
// //             id: 1,
// //             conversationId: record.id || 0,
// //             usedWordsCount: 150,
// //             totalWordsRequired: 200,
// //             grammarScore: 85,
// //             grammarComment: "דקדוק טוב בסך הכל, יש מקום לשיפור בزמני עבר",
// //             fluencyScore: 78,
// //             fluencyComment: "שטף דיבור טוב, מומלץ להפחית הפסקות",
// //             vocabularyScore: 82,
// //             vocabularyComment: "אוצר מילים עשיר, מומלץ להוסיף ביטויים מקצועיים",
// //             generalFeedback: "ביצוע מצוין! המשך להתרגל ותראה שיפור משמעותי",
// //             score: 85,
// //             givenAt: new Date().toISOString(),
// //         }
// //         setSelectedFeedback(mockFeedback)
// //         setFeedbackModalOpen(true)
// //     }

// //     const handleDownload = async (record: Record) => {
// //         try {
// //             const downloadUrl = await recordStore.getDownloadUrl(record.url)
// //             if (downloadUrl) {
// //                 window.open(downloadUrl, "_blank")
// //             }
// //         } catch (error) {
// //             console.error("Error downloading record:", error)
// //         }
// //     }

// //     const handleToggleFavorite = (record: Record) => {
// //         const newFavorites = new Set(favorites)
// //         if (record.id) {
// //             if (favorites.has(record.id)) {
// //                 newFavorites.delete(record.id)
// //             } else {
// //                 newFavorites.add(record.id)
// //             }
// //             setFavorites(newFavorites)
// //         }
// //     }

// //     const filteredAndSortedRecords = records
// //         .filter((record) => {
// //             const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase())
// //             const matchesLevel = !filterLevel || true // Add level logic when available
// //             const matchesTopic = !filterTopic || record.topicId.toString() === filterTopic
// //             return matchesSearch && matchesLevel && matchesTopic
// //         })
// //         .sort((a, b) => {
// //             switch (sortBy) {
// //                 case "date":
// //                     return new Date(b.date).getTime() - new Date(a.date).getTime()
// //                 case "name":
// //                     return a.name.localeCompare(b.name)
// //                 default:
// //                     return 0
// //             }
// //         })

// //     if (loading) {
// //         return (
// //             <Box className="loading-container">
// //                 <LinearProgress className="loading-progress" />
// //                 <Typography variant="h6" className="loading-text">
// //                     טוען הקלטות...
// //                 </Typography>
// //             </Box>
// //         )
// //     }

// //     return (
// //         <Box className="my-recordings-container">
// //             <Box className="page-header">
// //                 <Box className="header-content">
// //                     <Language className="page-icon" />
// //                     <Box className="header-text">
// //                         <Typography variant="h3" className="page-title">
// //                             ההקלטות שלי
// //                         </Typography>
// //                         <Typography variant="h6" className="page-subtitle">
// //                             כאן תוכל לעיין בכל ההקלטות שביצעת ולקבל משוב מקצועי
// //                         </Typography>
// //                     </Box>
// //                 </Box>
// //                 <Box className="header-stats">
// //                     <Paper className="stat-card" elevation={2}>
// //                         <Typography variant="h4" className="stat-number">
// //                             {records.length}
// //                         </Typography>
// //                         <Typography variant="body2" className="stat-label">
// //                             הקלטות
// //                         </Typography>
// //                     </Paper>
// //                     <Paper className="stat-card" elevation={2}>
// //                         <Typography variant="h4" className="stat-number">
// //                             {favorites.size}
// //                         </Typography>
// //                         <Typography variant="body2" className="stat-label">
// //                             מועדפות
// //                         </Typography>
// //                     </Paper>
// //                     <Paper className="stat-card" elevation={2}>
// //                         <Typography variant="h4" className="stat-number">
// //                             85
// //                         </Typography>
// //                         <Typography variant="body2" className="stat-label">
// //                             ציון ממוצע
// //                         </Typography>
// //                     </Paper>
// //                 </Box>
// //             </Box>

// //             <Grid container spacing={3} className="main-content">
// //                 <Grid item xs={12} lg={3}>
// //                     <FilterPanel
// //                         searchTerm={searchTerm}
// //                         setSearchTerm={setSearchTerm}
// //                         sortBy={sortBy}
// //                         setSortBy={setSortBy}
// //                         filterLevel={filterLevel}
// //                         setFilterLevel={setFilterLevel}
// //                         filterTopic={filterTopic}
// //                         setFilterTopic={setFilterTopic}
// //                     />
// //                 </Grid>

// //                 <Grid item xs={12} lg={9}>
// //                     <Box className="recordings-grid">
// //                         {filteredAndSortedRecords.length === 0 ? (
// //                             <Paper className="empty-state" elevation={1}>
// //                                 <School className="empty-icon" />
// //                                 <Typography variant="h5" className="empty-title">
// //                                     אין הקלטות להצגה
// //                                 </Typography>
// //                                 <Typography variant="body1" className="empty-subtitle">
// //                                     התחל להקליט כדי לראות את ההתקדמות שלך כאן
// //                                 </Typography>
// //                             </Paper>
// //                         ) : (
// //                             <Grid container spacing={3}>
// //                                 {filteredAndSortedRecords.map((record) => (
// //                                     <Grid item xs={12} md={6} xl={4} key={record.id}>
// //                                         <RecordingCard
// //                                             record={record}
// //                                             onPlay={handlePlay}
// //                                             onViewFeedback={handleViewFeedback}
// //                                             onDownload={handleDownload}
// //                                             onToggleFavorite={handleToggleFavorite}
// //                                             isPlaying={playingRecord?.id === record.id}
// //                                             isFavorite={record.id ? favorites.has(record.id) : false}
// //                                         />
// //                                     </Grid>
// //                                 ))}
// //                             </Grid>
// //                         )}
// //                     </Box>
// //                 </Grid>
// //             </Grid>

// //             <FeedbackModal
// //                 open={feedbackModalOpen}
// //                 onClose={() => setFeedbackModalOpen(false)}
// //                 record={selectedRecord}
// //                 feedback={selectedFeedback}
// //             />

// //             <Fab color="primary" className="floating-action-btn" onClick={loadRecords}>
// //                 <DateRange />
// //             </Fab>
// //         </Box>
// //     )
// // })

// // export default MyRecordings


// //claude.ai:
// // import React, { useState, useEffect } from 'react';
// import { useEffect, useState } from 'react';
// import "../css/myRecording.css"
// import userStore from '../stores/userStore';
// import recordStore from '../stores/recordStore';

// // Icons - you can replace these with your preferred icon library
// const SearchIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <circle cx="11" cy="11" r="8" />
//         <path d="M 21 21l-4.35-4.35" />
//     </svg>
// );

// const FilterIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
//     </svg>
// );

// const PlayIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <polygon points="5,3 19,12 5,21" />
//     </svg>
// );

// const FileTextIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path d="M 14,2 L14,8 L20,8 M14,2 L20,8 L20,20 C20,21.1 19.1,22 18,22 L6,22 C4.9,22 4,21.1 4,20 L4,4 C4,2.9 4.9,2 6,2 L14,2 Z" />
//     </svg>
// );

// const DownloadIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path d="M 21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//         <polyline points="7,10 12,15 17,10" />
//         <line x1="12" y1="15" x2="12" y2="3" />
//     </svg>
// );

// const StarIcon = ({ filled = false }) => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
//         <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//     </svg>
// );

// const ChevronRightIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <polyline points="9,18 15,12 9,6" />
//     </svg>
// );

// const CalendarIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//         <line x1="16" y1="2" x2="16" y2="6" />
//         <line x1="8" y1="2" x2="8" y2="6" />
//         <line x1="3" y1="10" x2="21" y2="10" />
//     </svg>
// );

// const ClockIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <circle cx="12" cy="12" r="10" />
//         <polyline points="12,6 12,12 16,14" />
//     </svg>
// );

// const AwardIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <circle cx="12" cy="8" r="7" />
//         <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
//     </svg>
// );

// const VolumeIcon = () => (
//     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//         <path d="M 19.07,4.93 C20.97,6.83 21.97,9.35 21.97,12 C21.97,14.65 20.97,17.17 19.07,19.07" />
//         <path d="M 15.54,8.46 C16.48,9.4 17.01,10.67 17.01,12 C17.01,13.33 16.48,14.6 15.54,15.54" />
//     </svg>
// );

// const TrendingUpIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
//         <polyline points="17,6 23,6 23,12" />
//     </svg>
// );

// // Types
// import { Record } from '../models/record';
// import { Feedback } from '../models/feedback';
// // interface Record {
// //     id?: number;
// //     name: string;
// //     date: Date;
// //     length: string;
// //     url: string;
// //     topicId: number;
// //     userId: number;
// //     Transcription?: string;
// // }

// // interface Feedback {
// //     id: number;
// //     recordId: number;
// //     score: number;
// //     comments: string;
// //     createdAt: Date;
// //     pronunciation: number;
// //     fluency: number;
// //     vocabulary: number;
// //     grammar: number;
// // }

// const MyRecordings = () => {
//     const [records, setRecords] = useState<Record[]>([])
//     const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('date');
//     const [filterLevel, setFilterLevel] = useState('all');
//     const [filterTopic, setFilterTopic] = useState('all');
//     const [hoveredRecord, setHoveredRecord] = useState<number | null>(null);
//     const [favoriteRecords, setFavoriteRecords] = useState<Set<number>>(new Set());
//     const [feedbacks, setFeedbacks] = useState<Map<number, Feedback>>(new Map());
//     const [playingRecord, setPlayingRecord] = useState<number | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Simulate getting userId from auth context
//     const userId = userStore.user?.id;

//     useEffect(() => {
//         loadRecords();
//     }, []);

//     useEffect(() => {
//         filterAndSortRecords();
//     }, [records, searchTerm, sortBy, filterLevel, filterTopic]);

//     const loadRecords = async () => {
//         setLoading(true);
//         try {
//             const userId = userStore.user?.id;
//             const fetchedRecords = await recordStore.getRecordsByUserId(userId);

//             if (!fetchedRecords) throw new Error('Failed to fetch records');

//             setRecords(fetchedRecords);
//             // Load feedbacks for each record
//             const feedbackMap = new Map();
//             for (const record of fetchedRecords) {
//                 if (record.id) {
//                     try {
//                         const feedback = await GetFeedbackByRecordId(record.id);
//                         if (feedback) {
//                             feedbackMap.set(record.id, feedback);
//                         }
//                     } catch (error) {
//                         console.error(`Failed to load feedback for record ${record.id}:`, error);
//                     }
//                 }
//             }
//             setFeedbacks(feedbackMap);
//         } catch (error) {
//             console.error("Error loading records:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const loadRecords = async () => {
//     //     setLoading(true)
//     //     try {
//     //         const userId = userStore.user?.id;
//     //         const fetchedRecords = await recordStore.getRecordsByUserId(userId);
//     //         setRecords(fetchedRecords)
//     //     } catch (error) {
//     //         console.error("Error loading records:", error)
//     //     } finally {
//     //         setLoading(false)
//     //     }
//     // }
//     // const loadRecords = async () => {
//     //     try {
//     //         setLoading(true);
//     //         // Simulate API call to get records
//     //         //   const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`);

//     //         const response = recordStore.getRecordsByUserId(userId);
//     //         if (!response) throw new Error('Failed to fetch records');

//     //         //   const recordsData = await response.json();
//     //         //   setRecords(response);
//     //         console.log(response);

//     //         recordsData = response;
//     //         // Load feedbacks for each record
//     //         const feedbackMap = new Map();
//     //         for (const record of recordsData) {
//     //             if (record.id) {
//     //                 try {
//     //                     const feedback = await GetFeedbackByRecordId(record.id);
//     //                     if (feedback) {
//     //                         feedbackMap.set(record.id, feedback);
//     //                     }
//     //                 } catch (error) {
//     //                     console.error(`Failed to load feedback for record ${record.id}:`, error);
//     //                 }
//     //             }
//     //         }
//     //         setFeedbacks(feedbackMap);
//     //     } catch (error) {
//     //         console.error('Error loading records:', error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const GetFeedbackByRecordId = async (recordId: number): Promise<Feedback | null> => {
//         try {
//             const response = await fetch(`http://localhost:5092/api/Feedback/record/${recordId}`);
//             if (!response.ok) return null;
//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching feedback:', error);
//             return null;
//         }
//     };

//     const filterAndSortRecords = () => {
//         let filtered = records.filter(record => {
//             const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase())
//             // ||record.Transcription?.toLowerCase().includes(searchTerm.toLowerCase());
//             const matchesLevel = filterLevel === 'all' || getRecordLevel(record) === filterLevel;
//             const matchesTopic = filterTopic === 'all' || record.topicId.toString() === filterTopic;

//             return matchesSearch && matchesLevel && matchesTopic;
//         });

//         filtered.sort((a, b) => {
//             switch (sortBy) {
//                 case 'date':
//                     return new Date(b.date).getTime() - new Date(a.date).getTime();
//                 case 'name':
//                     return a.name.localeCompare(b.name);
//                 case 'length':
//                     return parseFloat(b.length) - parseFloat(a.length);
//                 case 'score':
//                     const scoreA = feedbacks.get(a.id || 0)?.score || 0;
//                     const scoreB = feedbacks.get(b.id || 0)?.score || 0;
//                     return scoreB - scoreA;
//                 default:
//                     return 0;
//             }
//         });

//         setFilteredRecords(filtered);
//     };

//     const getRecordLevel = (record: Record): string => {
//         const feedback = feedbacks.get(record.id || 0);
//         if (!feedback) return 'beginner';

//         if (feedback.score >= 80) return 'advanced';
//         if (feedback.score >= 60) return 'intermediate';
//         return 'beginner';
//     };

//     const getLevelText = (level: string) => {
//         switch (level) {
//             case 'beginner': return 'מתחיל';
//             case 'intermediate': return 'בינוני';
//             case 'advanced': return 'מתקדם';
//             default: return 'לא ידוע';
//         }
//     };

//     const toggleFavorite = (recordId: number) => {
//         const newFavorites = new Set(favoriteRecords);
//         if (newFavorites.has(recordId)) {
//             newFavorites.delete(recordId);
//         } else {
//             newFavorites.add(recordId);
//         }
//         setFavoriteRecords(newFavorites);
//     };

//     const playRecord = (recordId: number) => {
//         setPlayingRecord(recordId);
//         // Simulate playing audio
//         setTimeout(() => setPlayingRecord(null), 3000);
//     };

//     const downloadRecord = async (record: Record) => {
//         try {
//             const response = await fetch(`http://localhost:5092/api/upload/download-url?fileName=${record.url}`);
//             if (!response.ok) throw new Error('Failed to get download URL');

//             const data = await response.json();
//             const link = document.createElement('a');
//             link.href = data.url;
//             link.download = record.name;
//             link.click();
//         } catch (error) {
//             console.error('Error downloading record:', error);
//         }
//     };

//     const formatDate = (date: Date) => {
//         return new Date(date).toLocaleDateString('he-IL', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-content">
//                     <div className="loading-spinner"></div>
//                     <p>טוען הקלטות...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="recordings-page" dir="rtl">
//             {/* Header */}
//             <div className="page-header">
//                 <div className="header-content">
//                     <div className="header-text">
//                         <h1 className="page-title">ההקלטות שלי</h1>
//                         <p className="page-subtitle">
//                             כאן תוכל לעיין בכל ההקלטות שביצעת ולקבל משוב מקצועי
//                         </p>
//                     </div>
//                     <div className="header-stats">
//                         <div className="stat-icon">
//                             <VolumeIcon />
//                         </div>
//                         <div className="stat-info">
//                             <div className="stat-number">{records.length}</div>
//                             <div className="stat-label">הקלטות</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="main-container">
//                 {/* Filter Sidebar */}
//                 <div className={`filter-sidebar ${isFilterOpen ? 'open' : ''}`}>
//                     <div className="sidebar-content">
//                         <div className="sidebar-header">
//                             <h3>סינון וחיפוש</h3>
//                             <button
//                                 className="close-sidebar-btn"
//                                 onClick={() => setIsFilterOpen(false)}
//                             >
//                                 <ChevronRightIcon />
//                             </button>
//                         </div>

//                         {/* Search */}
//                         <div className="filter-group">
//                             <label>חיפוש</label>
//                             <div className="search-container">
//                                 <SearchIcon />
//                                 <input
//                                     type="text"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     placeholder="חפש לפי שם או תוכן..."
//                                     className="search-input"
//                                 />
//                             </div>
//                         </div>

//                         {/* Sort */}
//                         <div className="filter-group">
//                             <label>מיון לפי</label>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="filter-select"
//                             >
//                                 <option value="date">תאריך</option>
//                                 <option value="name">שם</option>
//                                 <option value="length">משך</option>
//                                 <option value="score">ציון</option>
//                             </select>
//                         </div>

//                         {/* Level Filter */}
//                         <div className="filter-group">
//                             <label>רמה</label>
//                             <select
//                                 value={filterLevel}
//                                 onChange={(e) => setFilterLevel(e.target.value)}
//                                 className="filter-select"
//                             >
//                                 <option value="all">כל הרמות</option>
//                                 <option value="beginner">מתחיל</option>
//                                 <option value="intermediate">בינוני</option>
//                                 <option value="advanced">מתקדם</option>
//                             </select>
//                         </div>

//                         {/* Topic Filter */}
//                         <div className="filter-group">
//                             <label>נושא</label>
//                             <select
//                                 value={filterTopic}
//                                 onChange={(e) => setFilterTopic(e.target.value)}
//                                 className="filter-select"
//                             >
//                                 <option value="all">כל הנושאים</option>
//                                 <option value="1">שיחה כללית</option>
//                                 <option value="2">עסקים</option>
//                                 <option value="3">נסיעות</option>
//                                 <option value="4">אוכל</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Filter Toggle Button */}
//                 <button
//                     className="filter-toggle-btn"
//                     onClick={() => setIsFilterOpen(true)}
//                 >
//                     <FilterIcon />
//                 </button>

//                 {/* Overlay */}
//                 {isFilterOpen && (
//                     <div
//                         className="overlay"
//                         onClick={() => setIsFilterOpen(false)}
//                     />
//                 )}

//                 {/* Main Content */}
//                 <div className="recordings-content">
//                     {filteredRecords.length === 0 ? (
//                         <div className="no-records">
//                             <div className="no-records-icon">
//                                 <VolumeIcon />
//                             </div>
//                             <h3>אין הקלטות להצגה</h3>
//                             <p>נסה לשנות את הסינונים או צור הקלטה חדשה</p>
//                         </div>
//                     ) : (
//                         <div className="recordings-list">
//                             {filteredRecords.map((record) => {
//                                 const feedback = feedbacks.get(record.id || 0);
//                                 const level = getRecordLevel(record);
//                                 const isFavorite = favoriteRecords.has(record.id || 0);
//                                 const isPlaying = playingRecord === record.id;
//                                 const isHovered = hoveredRecord === record.id;

//                                 return (
//                                     <div
//                                         key={record.id}
//                                         className={`recording-card ${isFavorite ? 'favorite' : ''} ${level}`}
//                                         onMouseEnter={() => setHoveredRecord(record.id || 0)}
//                                         onMouseLeave={() => setHoveredRecord(null)}
//                                     >
//                                         <div className="card-content">
//                                             <div className="card-main">
//                                                 <div className="card-header">
//                                                     <h3 className="record-name">{record.name}</h3>
//                                                     <span className={`level-badge ${level}`}>
//                                                         {getLevelText(level)}
//                                                     </span>
//                                                     {isFavorite && (
//                                                         <div className="favorite-indicator">
//                                                             <StarIcon filled />
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 <div className="record-meta">
//                                                     <div className="meta-item">
//                                                         <CalendarIcon />
//                                                         <span>{formatDate(record.date)}</span>
//                                                     </div>
//                                                     <div className="meta-item">
//                                                         <ClockIcon />
//                                                         <span>{record.length}</span>
//                                                     </div>
//                                                     {feedback && (
//                                                         <div className="meta-item">
//                                                             <AwardIcon />
//                                                             <span className={`score score-${Math.floor(feedback.score / 20)}`}>
//                                                                 {feedback.score}/100
//                                                             </span>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {feedback && (
//                                                     <div className="metrics-grid">
//                                                         <div className="metric">
//                                                             <div className="metric-value pronunciation">{"feedback.pronunciation"}</div>
//                                                             <div className="metric-label">הגייה</div>
//                                                             <div className="metric-bar">
//                                                                 <div
//                                                                     className="metric-fill pronunciation"
//                                                                     // style={{ width: `${feedback.pronunciation}%` }}
//                                                                     style={{ width: `${2}%` }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="metric">
//                                                             <div className="metric-value fluency">{feedback.fluencyComment}</div>
//                                                             <div className="metric-label">שטף</div>
//                                                             <div className="metric-bar">
//                                                                 <div
//                                                                     className="metric-fill fluency"
//                                                                     style={{ width: `${feedback.fluencyScore}%` }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="metric">
//                                                             <div className="metric-value vocabulary">{feedback.vocabularyScore}</div>
//                                                             <div className="metric-label">אוצר מילים</div>
//                                                             <div className="metric-bar">
//                                                                 <div
//                                                                     className="metric-fill vocabulary"
//                                                                     style={{ width: `${feedback.vocabularyComment}` }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="metric">
//                                                             <div className="metric-value grammar">{feedback.grammarComment}</div>
//                                                             <div className="metric-label">דקדוק</div>
//                                                             <div className="metric-bar">
//                                                                 <div
//                                                                     className="metric-fill grammar"
//                                                                     style={{ width: `${feedback.grammarScore}%` }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             <div className="card-actions">
//                                                 {/* Always visible actions */}
//                                                 <button
//                                                     className={`action-btn play-btn ${isPlaying ? 'playing' : ''}`}
//                                                     onClick={() => playRecord(record.id || 0)}
//                                                 >
//                                                     <PlayIcon />
//                                                     {isPlaying && <div className="pulse-ring"></div>}
//                                                 </button>

//                                                 {feedback && (
//                                                     <button className="action-btn feedback-btn">
//                                                         <FileTextIcon />
//                                                     </button>
//                                                 )}

//                                                 {/* Hover actions */}
//                                                 <div className={`hover-actions ${isHovered ? 'visible' : ''}`}>
//                                                     <button
//                                                         className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
//                                                         onClick={() => toggleFavorite(record.id || 0)}
//                                                     >
//                                                         <StarIcon filled={isFavorite} />
//                                                     </button>

//                                                     <button
//                                                         className="action-btn download-btn"
//                                                         onClick={() => downloadRecord(record)}
//                                                     >
//                                                         <DownloadIcon />
//                                                     </button>

//                                                     {feedback && (
//                                                         <button className="action-btn trend-btn">
//                                                             <TrendingUpIcon />
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyRecordings;
import { observer } from "mobx-react-lite";
import { Record } from "../models/record";
import { Feedback } from "../models/feedback";
import recordStore from "../stores/recordStore";
import {feedbackStore} from "../stores/feedbackStore";
import userStore from "../stores/userStore";
import { useEffect, useState } from "react";

const MyRecordings = () => {
    const [feedbacks, setFeedbacks] = useState<Map<number, Feedback>>(new Map());
    const [records, setRecords] = useState<Feedback[] | null>();
    const [playingRecord, setPlayingRecord] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchedRecords = await recordStore.getRecordsByUserId(userId);
const 
    useEffect(() => {
        loadRecords()
    }, [])


    const loadRecords = async () => {
        setLoading(true);
        try {
            const userId = userStore.user?.id;
            const fetchedRecords = await recordStore.getRecordsByUserId(userId);

            if (!fetchedRecords) throw new Error('Failed to fetch records');

            setRecords(fetchedRecords);

            // Load feedbacks for each record
            const feedbackMap = new Map();
            for (const record of fetchedRecords) {
                if (record.id) {
                    try {
                        const feedback = await feedbackStore.getFeedbackByRecordId(record.id)
                        if (feedback) {
                            feedbackMap.set(record.id, feedback);
                        }
                    } catch (error) {
                        console.error(`Failed to load feedback for record ${record.id}:`, error);
                    }
                }
            }
            setFeedbacks(feedbackMap);
        } catch (error) {
            console.error("Error loading records:", error);
        } finally {
            setLoading(false);
        }
    };

    return
}

export default MyRecordings