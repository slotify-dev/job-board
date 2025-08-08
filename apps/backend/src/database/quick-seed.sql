-- Insert test employer user
INSERT INTO users (email, password_hash, role) 
VALUES ('employer@example.com', '$2b$10$hashedpassword123', 'employer')
ON CONFLICT (email) DO NOTHING;

-- Get the user ID
DO $$
DECLARE
    employer_user_id INTEGER;
BEGIN
    SELECT id INTO employer_user_id FROM users WHERE email = 'employer@example.com';
    
    -- Insert employer profile
    INSERT INTO employers (user_id, company_name, contact_person, company_website) 
    VALUES (employer_user_id, 'Tech Innovations Inc.', 'John Doe', 'https://techinnovations.com')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Insert sample jobs
    INSERT INTO jobs (employer_id, title, description, location, status) VALUES 
    (employer_user_id, 'Senior React Developer', 
     'We are looking for an experienced React Developer to join our growing team.

Key Responsibilities:
• Develop and maintain web applications using React, TypeScript, and modern tools
• Collaborate with designers and backend developers
• Write clean, maintainable, and well-tested code
• Participate in code reviews and technical discussions

Requirements:
• 3+ years of experience with React and JavaScript/TypeScript
• Experience with state management (Redux, Zustand, etc.)
• Knowledge of modern web development tools and practices
• Strong problem-solving skills and attention to detail
• Experience with REST APIs and GraphQL

What we offer:
• Competitive salary and benefits
• Flexible work arrangements
• Professional development opportunities
• Modern tech stack and tools', 
     'San Francisco, CA', 'active'),
    
    (employer_user_id, 'Full Stack Software Engineer',
     'Join our engineering team as a Full Stack Developer and help build scalable web applications.

Responsibilities:
• Design and implement both frontend and backend features
• Work with databases and APIs
• Ensure application performance and security
• Collaborate with cross-functional teams

Required Skills:
• Experience with React, Node.js, and TypeScript
• Database experience (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, Azure, GCP)
• Understanding of software design patterns
• Experience with version control (Git)

Bonus Points:
• DevOps experience with Docker and CI/CD
• Experience with microservices architecture
• Open source contributions',
     'Remote', 'active'),
    
    (employer_user_id, 'Backend Python Developer',
     'We''re seeking a skilled Backend Developer to work on our Python-based services and APIs.

What you''ll do:
• Develop robust backend services using Python and FastAPI/Django
• Design and optimize database schemas and queries
• Implement authentication and authorization systems
• Build and maintain RESTful APIs
• Work on system architecture and scalability

Requirements:
• 2+ years of Python development experience
• Experience with web frameworks (FastAPI, Django, Flask)
• Database expertise (PostgreSQL, Redis)
• Understanding of software testing principles
• Familiarity with containerization (Docker)

Nice to have:
• Experience with message queues (RabbitMQ, Celery)
• Knowledge of monitoring and logging tools
• Previous startup experience',
     'New York, NY', 'active');
END $$;