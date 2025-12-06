import React, { useState, useEffect } from 'react'

interface DemoProps {
  title?: string
}

const Demo: React.FC<DemoProps> = ({ title = "Vite + React Demo" }) => {
  const [count, setCount] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleReset = () => {
    setCount(0)
  }

  const handleIncrement = () => {
    setCount(prev => prev + 1)
  }

  const handleDecrement = () => {
    setCount(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="demo-container">
      <h2>{title}</h2>

      <div className="demo-section">
        <h3>计数器功能</h3>
        <div className="counter">
          <button onClick={handleDecrement} className="counter-btn">-</button>
          <span className="counter-display">计数: {count}</span>
          <button onClick={handleIncrement} className="counter-btn">+</button>
        </div>
        <button onClick={handleReset} className="reset-btn">重置</button>
      </div>

      <div className="demo-section">
        <h3>实时时间</h3>
        <div className="time-display">
          当前时间: {currentTime}
        </div>
      </div>

      <div className="demo-section">
        <h3>学习来源</h3>
        <p>
          本项目基于YouTube视频学习:{' '}
          <a
            href="https://www.youtube.com/watch?v=S143_JtCtV8"
            target="_blank"
            rel="noopener noreferrer"
            className="video-link"
          >
            S143_JtCtV8
          </a>
        </p>
      </div>

      <style jsx>{`
        .demo-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .demo-section {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }

        .counter {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 15px 0;
        }

        .counter-btn, .reset-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          background: #646cff;
          color: white;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }

        .counter-btn:hover, .reset-btn:hover {
          background: #535bf2;
        }

        .counter-display {
          font-size: 18px;
          font-weight: bold;
          min-width: 120px;
          text-align: center;
        }

        .time-display {
          font-size: 16px;
          text-align: center;
          padding: 10px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 6px;
        }

        .video-link {
          color: #61dafb;
          text-decoration: none;
        }

        .video-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default Demo
