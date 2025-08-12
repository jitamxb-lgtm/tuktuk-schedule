export default function HomePage() {
  const scheduleData = [
    {
      time: "8:00 - 9:00 AM",
      activities: Array(7).fill("Yoga Session"),
      type: "yoga"
    },
    {
      time: "9:00 - 10:00 AM", 
      activities: Array(7).fill("Breakfast"),
      type: "breakfast"
    },
    {
      time: "10:00 - 11:00 AM",
      activities: ["DSA Theory + Practice", "Aptitude Training", "DSA Theory + Practice", "Aptitude Training", "DSA Theory + Practice", "Aptitude Training", "Free Time"],
      type: ["dsa", "aptitude", "dsa", "aptitude", "dsa", "aptitude", "free-time"]
    },
    {
      time: "11:00 - 12:30 PM",
      activities: ["Cybersecurity Study", "Web Development", "Cybersecurity Study", "Web Development", "Cybersecurity Study", "Web Development", "Plant Painting"],
      type: ["cyber", "webdev", "cyber", "webdev", "cyber", "webdev", "art"]
    },
    {
      time: "12:30 - 2:00 PM",
      activities: ["Break / Free Time", "Break / Free Time", "Break / Free Time", "Break / Free Time", "Break / Free Time", "Break / Free Time", "DSA Theory + Practice"],
      type: ["free-time", "free-time", "free-time", "free-time", "free-time", "free-time", "dsa"]
    },
    {
      time: "2:00 - 3:00 PM",
      activities: Array(7).fill("Lunch Break"),
      type: "lunch"
    },
    {
      time: "3:00 - 4:00 PM",
      activities: ["Aptitude Training", "DSA Theory + Practice", "Aptitude Training", "DSA Theory + Practice", "Aptitude Training", "DSA Theory + Practice", "Free Time"],
      type: ["aptitude", "dsa", "aptitude", "dsa", "aptitude", "dsa", "free-time"]
    },
    {
      time: "4:00 - 5:30 PM",
      activities: ["Web Development", "Cybersecurity Study", "Web Development", "Cybersecurity Study", "Web Development", "Cybersecurity Study", "Aptitude Training"],
      type: ["webdev", "cyber", "webdev", "cyber", "webdev", "cyber", "aptitude"]
    },
    {
      time: "5:30 - 8:00 PM",
      activities: Array(7).fill("Badminton"),
      type: "badminton"
    },
    {
      time: "8:00 - 8:45 PM",
      activities: ["Plant Painting", "Plant Painting", "Plant Painting", "Plant Painting", "Plant Painting", "Plant Painting", "Cybersecurity Study"],
      type: ["art", "art", "art", "art", "art", "art", "cyber"]
    },
    {
      time: "8:45 - 10:00 PM",
      activities: ["Dinner & Rest", "Dinner & Rest", "Dinner & Rest", "Dinner & Rest", "Dinner & Rest", "Dinner & Rest", "Web Development"],
      type: ["dinner", "dinner", "dinner", "dinner", "dinner", "dinner", "webdev"]
    },
    {
      time: "10:00+ PM",
      activities: Array(7).fill("Personal Time"),
      type: "free-time"
    }
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="container">
      <div className="header">
        <h1>Weekly Study & Activity Schedule</h1>
        <p>Structured learning plan with balanced activities and proper breaks</p>
      </div>

      <div className="timetable-wrapper">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((slot, index) => (
              <tr key={index}>
                <td className="time-column">{slot.time}</td>
                {slot.activities.map((activity, dayIndex) => {
                  const activityType = Array.isArray(slot.type) ? slot.type[dayIndex] : slot.type;
                  return (
                    <td key={dayIndex} className="activity-cell">
                      <div className={`activity ${activityType}`}>
                        {activity}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <h3>Weekly Summary</h3>
        <div className="summary-grid">
          {[
            { title: "DSA Training", time: "7 hours/week", desc: "Theory & LeetCode Practice" },
            { title: "Aptitude Development", time: "7 hours/week", desc: "Problem Solving & Logic" },
            { title: "Cybersecurity", time: "10.5 hours/week", desc: "Theory & Hands-on Labs" },
            { title: "Web Development", time: "10.5 hours/week", desc: "Frontend & Backend" },
            { title: "Physical Activity", time: "24.5 hours/week", desc: "Yoga & Badminton" },
            { title: "Creative Arts", time: "5.25 hours/week", desc: "Plant Painting Sessions" }
          ].map((item, index) => (
            <div key={index} className="summary-item">
              <h4>{item.title}</h4>
              <p>{item.time} • {item.desc}</p>
            </div>
          ))}
        </div>

        <div className="notes">
          <h4>Schedule Notes</h4>
          <ul>
            <li>All meal times are fixed: Breakfast 9:00 AM, Lunch 2:00 PM</li>
            <li>Daily yoga session from 8:00-9:00 AM maintains routine</li>
            <li>Badminton sessions 5:30-8:00 PM provide consistent physical activity</li>
            <li>Strategic breaks prevent mental fatigue and maintain focus</li>
            <li>Sunday schedule offers flexibility while maintaining core activities</li>
            <li>Evening hours after 10:00 PM reserved for personal time and rest</li>
          </ul>
        </div>

        <div className="reminders">
          <h4>Daily Reminders</h4>
          <ul>
            <li><strong>Read Properly:</strong> Focus on understanding concepts thoroughly rather than rushing through material</li>
            <li><strong>No Phone Distractions:</strong> Keep your phone away during study sessions to maintain concentration</li>
            <li><strong>Avoid Instagram Reels:</strong> Social media can break your focus - save entertainment for designated free time</li>
            <li><strong>Stay Hydrated:</strong> Drink water regularly throughout the day to keep your mind sharp and body healthy</li>
            <li><strong>Focus on Present Task:</strong> Give your complete attention to whatever you're doing in that moment</li>
            <li><strong>Believe in Yourself:</strong> With discipline and consistency, you can achieve anything - you can win the world!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}