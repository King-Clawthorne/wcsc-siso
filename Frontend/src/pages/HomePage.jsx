import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function HomePage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const isServerOnline = true;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours24 = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const timeString = `${hours12}:${String(minutes).padStart(2, '0')}${ampm}`;
  
  const totalMinutes = hours24 * 60 + minutes;

  const isMorning = hours24 < 12;
  const greetingWord = isMorning ? "Morning" : "Afternoon";
  const greetingColor = isMorning ? "#5170ff" : "#ffbd59";

  // Schedule Calculation
  let periodText = "";
  if (totalMinutes < 520) periodText = "Now is - Before school time";
  else if (totalMinutes < 575) periodText = "Now is - Period 1";
  else if (totalMinutes < 580) periodText = ""; 
  else if (totalMinutes < 630) periodText = "Now is - Period 2";
  else if (totalMinutes < 645) periodText = "Now is - Morning Tea";
  else if (totalMinutes < 660) periodText = "";
  else if (totalMinutes < 710) periodText = "Now is - Period 3";
  else if (totalMinutes < 715) periodText = "";
  else if (totalMinutes < 765) periodText = "Now is - Period 4";
  else if (totalMinutes < 815) periodText = "Now is - Lunchtime";
  else if (totalMinutes < 865) periodText = "Now is - Period 5";
  else if (totalMinutes < 870) periodText = "";
  else if (totalMinutes < 920) periodText = "Now is - Period 6";
  else periodText = "Now is - After school";

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <div className="left-panel glass-panel">
        <div className="left-header-row">
          <div className="title-status-row">
            <h1 className="header-title">SISO System</h1>
            <div className="status-indicator">
              <span className="status-text">{isServerOnline ? 'online' : 'offline'}</span>
              <div className="status-dot" style={{ backgroundColor: '#00ff08' }}></div>
            </div>
          </div>
          <div className="school-info">
            Wentworth Computer Science College<br />Newmarket
          </div>
        </div>

        {/* Proportional Spacing Wrapper */}
        <div className="button-container-wrapper">
          <div className="button-group">
            <button className="action-btn" onClick={() => navigate('/sign-in')}>Sign in</button>
            <button className="action-btn" onClick={() => navigate('/sign-out')}>Sign out</button>
          </div>

          <div className="button-group">
            <button className="action-btn" onClick={() => navigate('/sign-in-equipment')}>Sign in sport equipment</button>
            <button className="action-btn" onClick={() => navigate('/sign-out-equipment')}>Sign out sport equipment</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="right-panel">
        <div className="top-widget glass-panel">
          <div className="time-display">{timeString}</div>
          <div className="greeting-section">
            <div className="greeting-text">
              Good <span style={{ color: greetingColor }}>{greetingWord}</span>!
            </div>
            {periodText && <div className="greeting-subtext">{periodText}</div>}
          </div>
        </div>

        {/* Timetable / Large Whiteboard */}
        <div className="timetable-container glass-panel">
          {/* Dynamic timetable content will be here */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
//last edited ethan shen: 2024-06-12 12:31, edited the home page and css file.


//1122334455