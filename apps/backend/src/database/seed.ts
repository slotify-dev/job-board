/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - This is a seed script for development only
import { eq } from 'drizzle-orm';
import { db } from './client';
import { users, type User } from './models/user.model';
import { employers } from './models/employer.model';
import { jobSeekers } from './models/jobSeeker.model';
import { jobs } from './models/job.model';
import { applications } from './models/application.model';
import bcrypt from 'bcryptjs';

// Sample data arrays
const companyNames = [
  'TechFlow Systems',
  'Digital Dynamics',
  'CloudSync Solutions',
  'DataForge Labs',
  'AppSphere Inc',
  'CodeCraft Studios',
  'ByteForce Technologies',
  'NextGen Software',
  'InnovateTech',
  'WebWave Solutions',
  'SmartCode Labs',
  'DevPro Systems',
  'TechPulse Corp',
  'QuantumDev',
  'CyberStream Technologies',
  'LogicFlow Inc',
  'CodeMasters LLC',
  'TechVision Group',
  'DigitalCraft Solutions',
  'AppForge Studios',
  'CloudTech Innovations',
  'DataSync Labs',
  'WebCore Systems',
  'TechNova Inc',
  'DevSphere Solutions',
];

const jobTitles = [
  'Senior Software Engineer',
  'Full Stack Developer',
  'Frontend React Developer',
  'Backend Python Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
  'Mobile App Developer',
  'Cloud Architect',
  'Machine Learning Engineer',
  'Site Reliability Engineer',
  'Technical Lead',
  'Software Architect',
  'Database Administrator',
  'Cybersecurity Specialist',
  'QA Engineer',
  'Systems Analyst',
  'IT Project Manager',
  'Business Analyst',
  'Software Tester',
  'Network Engineer',
  'Game Developer',
  'AI Research Scientist',
  'Platform Engineer',
  'Integration Specialist',
  'Solutions Architect',
  'Technical Writer',
  'Release Manager',
  'Performance Engineer',
  'Security Engineer',
  'Infrastructure Engineer',
  'API Developer',
  'Automation Engineer',
  'Data Engineer',
  'Research and Development Engineer',
  'Embedded Systems Engineer',
  'Blockchain Developer',
  'VR/AR Developer',
  'MLOps Engineer',
  'Principal Engineer',
  'Staff Engineer',
  'Engineering Manager',
  'CTO',
  'Head of Engineering',
  'Lead Developer',
  'Senior Data Analyst',
  'Junior Software Engineer',
  'Intern Developer',
  'Graduate Engineer',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Denver, CO',
  'Portland, OR',
  'Atlanta, GA',
  'Miami, FL',
  'Dallas, TX',
  'Phoenix, AZ',
  'San Diego, CA',
  'Las Vegas, NV',
  'Remote',
  'Hybrid - San Francisco',
  'Hybrid - New York',
  'Hybrid - Seattle',
  'Remote - US Only',
  'Remote - Global',
];

const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'David',
  'Elizabeth',
  'William',
  'Barbara',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Christopher',
  'Karen',
  'Charles',
  'Nancy',
  'Daniel',
  'Lisa',
  'Matthew',
  'Betty',
  'Anthony',
  'Helen',
  'Mark',
  'Sandra',
  'Donald',
  'Donna',
  'Steven',
  'Carol',
  'Paul',
  'Ruth',
  'Andrew',
  'Sharon',
  'Joshua',
  'Michelle',
  'Kenneth',
  'Laura',
  'Kevin',
  'Sarah',
  'Brian',
  'Kimberly',
  'George',
  'Deborah',
  'Timothy',
  'Dorothy',
  'Ronald',
  'Lisa',
  'Jason',
  'Nancy',
  'Edward',
  'Karen',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
  'Carter',
  'Roberts',
  'Gomez',
  'Phillips',
  'Evans',
  'Turner',
  'Diaz',
];

const jobDescriptionTemplates = [
  {
    intro:
      'We are looking for a talented {title} to join our dynamic team at {company}.',
    responsibilities: [
      'Design and develop high-quality software solutions',
      'Collaborate with cross-functional teams to define requirements',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and technical discussions',
      'Troubleshoot and debug applications',
    ],
    requirements: [
      '3+ years of experience in software development',
      'Strong problem-solving and analytical skills',
      'Excellent communication and teamwork abilities',
      'Experience with modern development tools and practices',
      "Bachelor's degree in Computer Science or related field",
    ],
    benefits: [
      'Competitive salary and benefits package',
      'Flexible work arrangements and remote options',
      'Professional development opportunities',
      'Health, dental, and vision insurance',
      '401(k) with company matching',
    ],
  },
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateJobDescription(title: string, company: string): any {
  const template = jobDescriptionTemplates[0];

  return {
    time: Date.now(),
    blocks: [
      {
        id: `intro-${Math.random().toString(36).substr(2, 9)}`,
        type: 'paragraph',
        data: {
          text: template.intro
            .replace('{title}', title)
            .replace('{company}', company),
        },
      },
      {
        id: `responsibilities-${Math.random().toString(36).substr(2, 9)}`,
        type: 'header',
        data: {
          text: 'Key Responsibilities:',
          level: 3,
        },
      },
      {
        id: `resp-list-${Math.random().toString(36).substr(2, 9)}`,
        type: 'list',
        data: {
          style: 'unordered',
          items: template.responsibilities.slice(
            0,
            Math.floor(Math.random() * 3) + 3,
          ),
        },
      },
      {
        id: `requirements-${Math.random().toString(36).substr(2, 9)}`,
        type: 'header',
        data: {
          text: 'Requirements:',
          level: 3,
        },
      },
      {
        id: `req-list-${Math.random().toString(36).substr(2, 9)}`,
        type: 'list',
        data: {
          style: 'unordered',
          items: template.requirements.slice(
            0,
            Math.floor(Math.random() * 3) + 3,
          ),
        },
      },
      {
        id: `benefits-${Math.random().toString(36).substr(2, 9)}`,
        type: 'header',
        data: {
          text: 'What We Offer:',
          level: 3,
        },
      },
      {
        id: `benefits-list-${Math.random().toString(36).substr(2, 9)}`,
        type: 'list',
        data: {
          style: 'unordered',
          items: template.benefits.slice(0, Math.floor(Math.random() * 3) + 3),
        },
      },
    ],
    version: '2.31.0',
  };
}

async function seed() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(applications);
    await db.delete(jobs);
    await db.delete(jobSeekers);
    await db.delete(employers);
    await db.delete(users);

    const hashedPassword = await bcrypt.hash('Password123!', 12);

    // Create 25 employer users and profiles
    console.log('👔 Creating 25 employers...');
    const employerUsers: User[] = [];

    for (let i = 1; i <= 25; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const email = `employer${i}@example.com`;

      const [user] = await db
        .insert(users)
        .values({
          email,
          passwordHash: hashedPassword,
          role: 'employer',
        })
        .returning();

      employerUsers.push(user);

      const companyName = getRandomItem(companyNames);
      await db.insert(employers).values({
        userId: user.id,
        companyName,
        contactPerson: `${firstName} ${lastName}`,
        companyWebsite: `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      });

      console.log(
        `  ✅ Created employer ${i}: ${firstName} ${lastName} (${companyName})`,
      );
    }

    // Create 50 job seeker users and profiles
    console.log('👨‍💻 Creating 50 job seekers...');
    const jobSeekerUsers: User[] = [];

    for (let i = 1; i <= 50; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const email = `jobseeker${i}@example.com`;

      const [user] = await db
        .insert(users)
        .values({
          email,
          passwordHash: hashedPassword,
          role: 'job_seeker',
        })
        .returning();

      jobSeekerUsers.push(user);

      await db.insert(jobSeekers).values({
        userId: user.id,
        fullName: `${firstName} ${lastName}`,
        email: email,
        phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${getRandomItem(['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Second Ave'])}, ${getRandomItem(locations.filter((l) => !l.includes('Remote') && !l.includes('Hybrid')))}`,
        resumeUrl: `https://cdn.example.com/resumes/${firstName.toLowerCase()}_${lastName.toLowerCase()}_resume.pdf`,
      });

      console.log(`  ✅ Created job seeker ${i}: ${firstName} ${lastName}`);
    }

    // Create 50 jobs distributed across employers
    console.log('💼 Creating 50 jobs...');
    const createdJobs: any[] = [];

    for (let i = 1; i <= 50; i++) {
      const employer = getRandomItem(employerUsers);
      const title = getRandomItem(jobTitles);
      const location = getRandomItem(locations);

      // Get employer company name
      const employerProfile = await db
        .select()
        .from(employers)
        .where(eq(employers.userId, employer.id));
      const companyName = employerProfile[0]?.companyName || 'Unknown Company';

      const [job] = await db
        .insert(jobs)
        .values({
          employerId: employer.id,
          title,
          description: generateJobDescription(title, companyName),
          location,
          status:
            Math.random() < 0.9
              ? 'active'
              : Math.random() < 0.5
                ? 'closed'
                : 'draft',
        })
        .returning();

      createdJobs.push(job);
      console.log(`  ✅ Created job ${i}: ${title} at ${companyName}`);
    }

    // Create 100-200 applications (random distribution)
    console.log('📝 Creating applications...');
    const applicationCount = Math.floor(Math.random() * 100) + 100; // 100-200 applications

    for (let i = 1; i <= applicationCount; i++) {
      const job = getRandomItem(createdJobs);
      const jobSeeker = getRandomItem(jobSeekerUsers);

      // Check if this job seeker already applied to this job
      const existingApplication = await db
        .select()
        .from(applications)
        .where(eq(applications.jobId, job.id))
        .limit(1);

      if (existingApplication.length === 0) {
        const statuses = ['pending', 'reviewed', 'accepted', 'rejected'];
        const weights = [0.4, 0.3, 0.1, 0.2]; // 40% pending, 30% reviewed, 10% accepted, 20% rejected

        let status = 'pending';
        const rand = Math.random();
        let cumulative = 0;
        for (let j = 0; j < statuses.length; j++) {
          cumulative += weights[j];
          if (rand <= cumulative) {
            status = statuses[j];
            break;
          }
        }

        await db.insert(applications).values({
          jobId: job.id,
          jobSeekerId: jobSeeker.id,
          resumeUrl: `https://cdn.example.com/resumes/jobseeker${jobSeeker.id}_resume.pdf`,
          coverLetter:
            Math.random() < 0.7
              ? `Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} position. I believe my skills and experience make me a great fit for this role.\n\nBest regards,\nJob Seeker`
              : null,
          status,
        });

        if (i % 20 === 0) {
          console.log(`  ✅ Created ${i} applications...`);
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • 25 employers created`);
    console.log(`   • 50 job seekers created`);
    console.log(`   • 50 jobs created`);
    console.log(`   • ~${applicationCount} applications created`);
    console.log(`\n🔐 Test login credentials:`);
    console.log(
      `   • Employers: employer1@example.com to employer25@example.com`,
    );
    console.log(
      `   • Job Seekers: jobseeker1@example.com to jobseeker50@example.com`,
    );
    console.log(`   • Password for all: Password123!`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
