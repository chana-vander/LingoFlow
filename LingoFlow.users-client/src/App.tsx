import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout.tsx'
import TopicsList from './components/topic.tsx';
import Details from './components/topice-details.tsx';
import Login from './components/login.tsx';
import HomePage from './components/home.tsx';
import GetRecords  from './components/myRecording.tsx';
import Register from './components/register.tsx';
import Levels from './components/level.tsx';
import AboutUs from './components/about-us.tsx';
import AudioRecorder from './components/record.tsx';
import FeedbackDisplay from './components/feedback.tsx';
// import UserRecordings from './components/user-recording.tsx';
// import MyRecordings from './components/myRecording.tsx';
function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="choose-level" element={<Levels />} />
          <Route path=":level/topics" element={<TopicsList />} />
          <Route path="topics/:id" element={<Details />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="record" element={<AudioRecorder />} />
          <Route path="feedback" element={<FeedbackDisplay />} />
          {/* <Route path="user-recording" element={<MyRecordings />} /> */}
          <Route path="my-recordings" element={<GetRecords />} />

        </Route>
      </Routes>
    // </Router>
  );
}

export default App;
