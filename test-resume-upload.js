const fetch = require('node-fetch');

async function testResumeUpload() {
  const resumeText = `Aarav Mehta
Backend Engineer
Email: aarav.mehta@example.com | Location: India

Professional Summary
Backend-focused software engineer with hands-on experience in building scalable APIs, distributed systems, and cloud-native services. Strong foundation in system design, databases, and security-aware backend development.

Skills
- Languages: JavaScript, TypeScript, Python
- Backend: Node.js, Express, REST APIs
- Databases: PostgreSQL, MongoDB
- Cloud & DevOps: AWS, Docker, CI/CD
- Tools: Git, Linux

Experience
Backend Engineer Intern – TechNova Solutions (2023–2024)
- Built REST APIs using Node.js and Express
- Designed PostgreSQL schemas and optimized queries
- Deployed services using Docker on AWS EC2

Projects
Distributed Task Scheduler
- Designed a job scheduling system with retry and queue mechanisms
- Implemented API authentication and role-based access

Real-Time Chat Application
- Built WebSocket-based chat server with message persistence

Education
B.Tech in Computer Science
XYZ University (2020–2024)`;

  try {
    console.log('Uploading resume text...');
    const response = await fetch('http://localhost:3000/api/resume/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: resumeText,
        kind: 'backend-engineer'
      }),
    });

    const result = await response.json();
    console.log('Upload result:', result);

    if (response.ok) {
      console.log('✅ Resume uploaded successfully');

      // Test multiple chat questions
      console.log('\nTesting chat functionality...');

      const questions = [
        'What programming languages does the candidate know?',
        'What is the candidate\'s work experience?',
        'What frontend frameworks does the candidate know?',
        'Where did the candidate study?'
      ];

      for (const question of questions) {
        console.log(`\nQ: ${question}`);
        const chatResponse = await fetch('http://localhost:3000/api/agent/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: question
          }),
        });

        const chatResult = await chatResponse.json();
        console.log('A:', chatResult.response);

        if (!chatResponse.ok) {
          console.log('❌ Chat failed for question:', question);
        }
      }

      console.log('\n✅ All chat tests completed');
    } else {
      console.log('❌ Resume upload failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testResumeUpload();
