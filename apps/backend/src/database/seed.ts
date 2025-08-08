/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - This is a seed script for development only
import { eq } from 'drizzle-orm';
import { db } from './client';
import { users, type User } from './models/user.model';
import { employers } from './models/employer.model';
import { jobs } from './models/job.model';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Create test employer user (only if not exists)
    let employerUser: User;
    try {
      const hashedPassword = await bcrypt.hash('testpassword123', 10);

      [employerUser] = await db
        .insert(users)
        .values({
          email: 'employer@example.com',
          passwordHash: hashedPassword,
          role: 'employer',
        })
        .returning();

      console.log('Created employer user:', employerUser.id);

      // Create employer profile
      const [employer] = await db
        .insert(employers)
        .values({
          userId: employerUser.id,
          companyName: 'Tech Innovations Inc.',
          contactPerson: 'John Doe',
          companyWebsite: 'https://techinnovations.com',
        })
        .returning();

      console.log('Created employer profile:', employer.userId);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === '23505'
      ) {
        // Unique constraint violation
        console.log('User already exists, finding existing user...');
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, 'employer@example.com'));
        employerUser = existingUsers[0];
        console.log('Found existing employer user:', employerUser.id);
      } else {
        throw error;
      }
    }

    // Get employer profile (whether newly created or existing)
    const existingEmployers = await db
      .select()
      .from(employers)
      .where(eq(employers.userId, employerUser.id));
    const employer = existingEmployers[0];

    if (!employer) {
      throw new Error('Employer profile not found');
    }

    // Sample jobs data
    const sampleJobs = [
      {
        employerId: employer.userId,
        title: 'Senior React Developer',
        description: `We are looking for an experienced React Developer to join our growing team.

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
• Modern tech stack and tools`,
        location: 'San Francisco, CA',
        status: 'active',
      },
      {
        employerId: employer.userId,
        title: 'Full Stack Software Engineer',
        description: `Join our engineering team as a Full Stack Developer and help build scalable web applications.

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
• Open source contributions`,
        location: 'Remote',
        status: 'active',
      },
      {
        employerId: employer.userId,
        title: 'Backend Python Developer',
        description: `We're seeking a skilled Backend Developer to work on our Python-based services and APIs.

What you'll do:
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
• Previous startup experience`,
        location: 'New York, NY',
        status: 'active',
      },
      {
        employerId: employer.userId,
        title: 'DevOps Engineer',
        description: `Looking for a DevOps Engineer to help scale our infrastructure and improve our deployment processes.

Key Responsibilities:
• Manage cloud infrastructure on AWS/GCP
• Implement CI/CD pipelines
• Monitor application performance and reliability
• Automate deployment and infrastructure provisioning
• Ensure security best practices

Required Experience:
• 3+ years in DevOps or Site Reliability Engineering
• Strong experience with containerization (Docker, Kubernetes)
• Cloud platform expertise (AWS, GCP, Azure)
• Infrastructure as Code (Terraform, CloudFormation)
• Monitoring tools (Prometheus, Grafana, DataDog)

Additional Skills:
• Scripting languages (Python, Bash, Go)
• Experience with service mesh technologies
• Database administration experience`,
        location: 'Austin, TX',
        status: 'active',
      },
      {
        employerId: employer.userId,
        title: 'Product Manager',
        description: `We're looking for a strategic Product Manager to drive our product roadmap and work closely with engineering teams.

Responsibilities:
• Define product strategy and roadmap
• Work with stakeholders to gather requirements
• Collaborate with design and engineering teams
• Analyze user feedback and market trends
• Lead product launches and feature rollouts

Qualifications:
• 2+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with agile development methodologies
• Excellent communication and leadership skills
• Understanding of technical concepts and constraints

Preferred:
• Experience in B2B SaaS products
• Background in user research and data analysis
• Technical degree or equivalent experience`,
        location: 'Seattle, WA',
        status: 'active',
      },
      {
        employerId: employer.userId,
        title: 'Data Scientist',
        description: `Join our data team to help derive insights from large datasets and build machine learning models.

What you'll work on:
• Analyze large datasets to identify trends and patterns
• Build and deploy machine learning models
• Create data visualizations and dashboards
• Collaborate with engineering to implement data solutions
• Present findings to stakeholders

Requirements:
• Master's degree in Data Science, Statistics, or related field
• 2+ years of experience in data analysis and machine learning
• Proficiency in Python and SQL
• Experience with ML frameworks (scikit-learn, TensorFlow, PyTorch)
• Strong statistical analysis skills

Tools we use:
• Python, R, SQL
• Jupyter Notebooks
• Apache Spark
• AWS/GCP data services
• Tableau/Looker for visualization`,
        location: 'Boston, MA',
        status: 'active',
      },
    ];

    // Insert sample jobs
    for (const jobData of sampleJobs) {
      const [job] = await db.insert(jobs).values(jobData).returning();
      console.log(`Created job: ${job.title} (${job.uuid})`);
    }

    console.log('Database seeding completed successfully!');
    console.log(`Created ${sampleJobs.length} sample jobs`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
