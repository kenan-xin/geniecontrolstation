import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsArticles, stations, segments, stationSchedules, applications } from "@/lib/schema";
import { sql } from "drizzle-orm";

// POST /api/seed - Seed the database with sample data
export async function POST() {
  try {
    // Delete all existing data (idempotent re-seeding)
    await db.delete(stationSchedules);
    await db.delete(segments);
    await db.delete(newsArticles);
    await db.delete(applications);
    await db.delete(stations);

    const today = new Date().toISOString().split("T")[0];

    // Insert news articles
    const articlesData = [
      // Unverified (3)
      {
        title: "IRS Announces New Direct Deposit Relief Payments - $1,200 Stimulus Checks Coming This Week",
        submissionDate: today,
        currentStatus: "Unverified",
        statusColor: "error",
        sources: "Blog News",
        assignedTo: null,
        submitterFullName: "John Doe",
        submitterIc: "S1234567A",
        submitterAddress: "123 Main Street, Singapore 123456",
        submitterPhone: "+65 9123 4567",
        submitterEmail: "john.doe@email.com",
        storyTitle: "IRS Announces New Direct Deposit Relief Payments - $1,200 Stimulus Checks Coming This Week",
        storyDescription: "The Internal Revenue Service has announced a new round of direct deposit relief payments. Eligible citizens will receive $1,200 stimulus checks starting this week. The payments are part of a broader economic relief initiative.",
        storyCategory: "Finance",
        storyUrgency: "High",
        storyEstimatedImpact: "Major",
        attachments: JSON.stringify([
          { id: "1", type: "image", name: "irs_notice.png", url: "/attachments/irs_notice.png", description: "Official IRS notice", source: "IRS Website" },
          { id: "2", type: "document", name: "eligibility_criteria.pdf", url: "/attachments/eligibility.pdf", description: "Eligibility criteria document", source: "Treasury Department" }
        ]),
        links: JSON.stringify([
          { id: "1", url: "https://www.irs.gov/newsroom", description: "IRS Newsroom", verified: true },
          { id: "2", url: "https://www.treasury.gov", description: "Treasury Department", verified: true }
        ]),
        editorialNotes: null,
        juniorEditorialNotes: null,
        seniorEditorialNotes: null,
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      {
        title: "Breaking news: Singapore birthrate in 2024 exceeds 2.0",
        submissionDate: today,
        currentStatus: "Unverified",
        statusColor: "error",
        sources: "Social Media",
        assignedTo: null,
        submitterFullName: "John Doe",
        submitterIc: "S1234567A",
        submitterAddress: "123 Main Street, Singapore 123456",
        submitterPhone: "+65 9123 4567",
        submitterEmail: "john.doe@email.com",
        storyTitle: "Breaking news: Singapore birthrate in 2024 exceeds 2.0",
        storyDescription: "Reports indicate that Singapore's birthrate has exceeded the replacement rate of 2.0 in 2024. This would be a significant demographic milestone for the nation if confirmed.",
        storyCategory: "Demographics",
        storyUrgency: "Critical",
        storyEstimatedImpact: "Major",
        attachments: JSON.stringify([
          { id: "1", type: "image", name: "birthrate_chart.png", url: "/attachments/birthrate.png", description: "Birthrate trend chart", source: "Twitter" }
        ]),
        links: JSON.stringify([
          { id: "1", url: "https://twitter.com/singstat", description: "Singapore Statistics Twitter", verified: false }
        ]),
        editorialNotes: null,
        juniorEditorialNotes: null,
        seniorEditorialNotes: null,
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      {
        title: "Weather Alert: Storm Warning Issued",
        submissionDate: today,
        currentStatus: "Unverified",
        statusColor: "error",
        sources: "Other Media Outlet",
        assignedTo: null,
        submitterFullName: "John Doe",
        submitterIc: "S7654321B",
        submitterAddress: "456 Orchard Road, Singapore 238896",
        submitterPhone: "+65 9876 5432",
        submitterEmail: "john.doe2@email.com",
        storyTitle: "Weather Alert: Storm Warning Issued",
        storyDescription: "A severe weather alert has been issued for the region. Heavy rainfall and strong winds are expected over the next 48 hours. Residents are advised to stay indoors.",
        storyCategory: "Weather",
        storyUrgency: "Critical",
        storyEstimatedImpact: "Moderate",
        attachments: null,
        links: JSON.stringify([
          { id: "1", url: "https://www.weather.gov.sg", description: "Meteorological Service Singapore", verified: true }
        ]),
        editorialNotes: null,
        juniorEditorialNotes: null,
        seniorEditorialNotes: null,
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      // Approval (2)
      {
        title: "Local Community Event Draws Large Crowd",
        submissionDate: today,
        currentStatus: "Approval",
        statusColor: "warning",
        sources: "Social Media",
        assignedTo: "Jane Smith",
        submitterFullName: "Jane Smith",
        submitterIc: "S2345678B",
        submitterAddress: "789 Ang Mo Kio Avenue 1, Singapore 560789",
        submitterPhone: "+65 9234 5678",
        submitterEmail: "jane.smith@email.com",
        storyTitle: "Local Community Event Draws Large Crowd",
        storyDescription: "A community gathering at the neighborhood park attracted over 500 residents. The event featured food stalls, games, and live performances from local artists.",
        storyCategory: "Community",
        storyUrgency: "Low",
        storyEstimatedImpact: "Minor",
        attachments: null,
        links: null,
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Initial Review", timestamp: new Date().toISOString(), content: "Verified event took place. Photos and videos submitted by submitter match social media posts from attendees." }
        ]),
        juniorEditorialNotes: "Event verified through cross-referencing with social media posts and local council announcement.",
        seniorEditorialNotes: null,
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      {
        title: "New Study Reveals Health Benefits",
        submissionDate: today,
        currentStatus: "Approval",
        statusColor: "warning",
        sources: "Reporter",
        assignedTo: "Mike Johnson",
        submitterFullName: "Mike Johnson",
        submitterIc: "S3456789C",
        submitterAddress: "321 Bedok North Street 2, Singapore 469321",
        submitterPhone: "+65 9345 6789",
        submitterEmail: "mike.johnson@email.com",
        storyTitle: "New Study Reveals Health Benefits",
        storyDescription: "A groundbreaking study published in a leading medical journal reveals significant health benefits associated with a new dietary approach. The research spans over 5 years with 10,000 participants.",
        storyCategory: "Health",
        storyUrgency: "Medium",
        storyEstimatedImpact: "High",
        attachments: null,
        links: JSON.stringify([
          { id: "1", url: "https://www.medicaljournal.com/study", description: "Original study publication", verified: true }
        ]),
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Source Verification", timestamp: new Date().toISOString(), content: "Study publication verified. Lead researcher contacted for additional comments." }
        ]),
        juniorEditorialNotes: "Study appears legitimate. Waiting for additional expert commentary before publication.",
        seniorEditorialNotes: null,
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      // Schedule (2)
      {
        title: "Government Policy Update on Healthcare",
        submissionDate: today,
        currentStatus: "Schedule",
        statusColor: "info",
        sources: "Other Media Outlet",
        assignedTo: "Mike Johnson",
        submitterFullName: "Mike Johnson",
        submitterIc: "S3456789C",
        submitterAddress: "321 Bedok North Street 2, Singapore 469321",
        submitterPhone: "+65 9345 6789",
        submitterEmail: "mike.johnson@email.com",
        storyTitle: "Government Policy Update on Healthcare",
        storyDescription: "The Ministry of Health has announced significant updates to healthcare policy affecting millions of citizens. Key changes include expanded coverage and reduced waiting times.",
        storyCategory: "Health",
        storyUrgency: "High",
        storyEstimatedImpact: "Major",
        attachments: null,
        links: JSON.stringify([
          { id: "1", url: "https://www.moh.gov.sg", description: "Ministry of Health announcement", verified: true }
        ]),
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Initial Review", timestamp: new Date().toISOString(), content: "Policy document reviewed. Key points extracted for article." },
          { role: "Senior Editor", action: "Approval", timestamp: new Date().toISOString(), content: "Approved for scheduling. Coordinate with communications team for optimal release time." }
        ]),
        juniorEditorialNotes: "Policy details verified. Article draft ready for senior review.",
        seniorEditorialNotes: "Approved. Schedule for release during morning news cycle.",
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      {
        title: "Local Business Opens New Location",
        submissionDate: today,
        currentStatus: "Schedule",
        statusColor: "info",
        sources: "Blog News",
        assignedTo: "Jane Smith",
        submitterFullName: "Jane Smith",
        submitterIc: "S2345678B",
        submitterAddress: "789 Ang Mo Kio Avenue 1, Singapore 560789",
        submitterPhone: "+65 9234 5678",
        submitterEmail: "jane.smith@email.com",
        storyTitle: "Local Business Opens New Location",
        storyDescription: "A popular local restaurant chain is expanding with a new outlet in the central business district. The new location is expected to create 50 new jobs.",
        storyCategory: "Business",
        storyUrgency: "Low",
        storyEstimatedImpact: "Minor",
        attachments: null,
        links: null,
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Verification", timestamp: new Date().toISOString(), content: "Business registration and expansion plans verified." },
          { role: "Senior Editor", action: "Scheduling", timestamp: new Date().toISOString(), content: "Schedule for business section feature. Include interview with owner." }
        ]),
        juniorEditorialNotes: "Expansion confirmed through ACRA records and company press release.",
        seniorEditorialNotes: "Good human interest angle. Schedule for weekend business feature.",
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      // Published (2)
      {
        title: "Sports Team Wins Championship",
        submissionDate: today,
        currentStatus: "Published",
        statusColor: "success",
        sources: "Blog News",
        assignedTo: "Sarah Williams",
        submitterFullName: "Sarah Williams",
        submitterIc: "S4567890D",
        submitterAddress: "654 Clementi Avenue 3, Singapore 120654",
        submitterPhone: "+65 9456 7890",
        submitterEmail: "sarah.williams@email.com",
        storyTitle: "Sports Team Wins Championship",
        storyDescription: "In a thrilling finale, the local sports team has clinched the national championship title. The victory marks a historic achievement for the club and its supporters.",
        storyCategory: "Sports",
        storyUrgency: "Medium",
        storyEstimatedImpact: "Moderate",
        attachments: null,
        links: null,
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Initial Review", timestamp: new Date().toISOString(), content: "Match results verified. Photos obtained from official photographer." },
          { role: "Senior Editor", action: "Approval", timestamp: new Date().toISOString(), content: "Great sports story. Approved for immediate publication." },
          { role: "Publisher", action: "Published", timestamp: new Date().toISOString(), content: "Published to all channels with match highlights." }
        ]),
        juniorEditorialNotes: "Championship confirmed. Great celebratory content available.",
        seniorEditorialNotes: "Perfect front-page sports story. Fast-track to publication.",
        publishedDate: today,
        publishingDetails: JSON.stringify({
          publishedDateTime: new Date().toISOString(),
          selectedChannels: ["website", "app", "social-media"],
          publisherNotes: "Breaking sports news - priority publication"
        }),
        performanceMetrics: JSON.stringify({
          views: 15420,
          likes: 3250,
          shares: 890,
          comments: 456,
          engagementRate: 29.8
        }),
      },
      {
        title: "School District Announces New Program",
        submissionDate: today,
        currentStatus: "Published",
        statusColor: "success",
        sources: "Other Media Outlet",
        assignedTo: "Sarah Williams",
        submitterFullName: "Sarah Williams",
        submitterIc: "S4567890D",
        submitterAddress: "654 Clementi Avenue 3, Singapore 120654",
        submitterPhone: "+65 9456 7890",
        submitterEmail: "sarah.williams@email.com",
        storyTitle: "School District Announces New Program",
        storyDescription: "The local school district has unveiled an innovative educational program aimed at enhancing digital literacy. The initiative will benefit over 10,000 students across 25 schools.",
        storyCategory: "Community",
        storyUrgency: "Low",
        storyEstimatedImpact: "Moderate",
        attachments: null,
        links: JSON.stringify([
          { id: "1", url: "https://www.moe.gov.sg", description: "Ministry of Education", verified: true }
        ]),
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Research", timestamp: new Date().toISOString(), content: "Program details obtained from school district. Interview with superintendent completed." },
          { role: "Senior Editor", action: "Review", timestamp: new Date().toISOString(), content: "Well-researched article. Good community impact angle." },
          { role: "Publisher", action: "Published", timestamp: new Date().toISOString(), content: "Published in education section with parent's guide." }
        ]),
        juniorEditorialNotes: "Excellent source material. Superintendent very cooperative.",
        seniorEditorialNotes: "Strong education story. Include practical tips for parents.",
        publishedDate: today,
        publishingDetails: JSON.stringify({
          publishedDateTime: new Date().toISOString(),
          selectedChannels: ["website", "newsletter"],
          publisherNotes: "Education focus - morning newsletter feature"
        }),
        performanceMetrics: JSON.stringify({
          views: 8750,
          likes: 1420,
          shares: 380,
          comments: 125,
          engagementRate: 22.1
        }),
      },
      // Rejected (2)
      {
        title: "Celebrity Spotted at Local Restaurant",
        submissionDate: today,
        currentStatus: "Rejected",
        statusColor: "default",
        sources: "TikTok",
        assignedTo: "Jane Smith",
        submitterFullName: "Jane Smith",
        submitterIc: "S2345678B",
        submitterAddress: "789 Ang Mo Kio Avenue 1, Singapore 560789",
        submitterPhone: "+65 9234 5678",
        submitterEmail: "jane.smith@email.com",
        storyTitle: "Celebrity Spotted at Local Restaurant",
        storyDescription: "An alleged sighting of a famous celebrity at a local restaurant has been making rounds on social media. Multiple sources claim to have seen the star dining with friends.",
        storyCategory: "Entertainment",
        storyUrgency: "Low",
        storyEstimatedImpact: "Minor",
        attachments: null,
        links: JSON.stringify([
          { id: "1", url: "https://www.tiktok.com/@user/video/123", description: "TikTok video", verified: false }
        ]),
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Investigation", timestamp: new Date().toISOString(), content: "Unable to verify celebrity identity. Video quality poor. Restaurant staff unable to confirm." },
          { role: "Senior Editor", action: "Rejection", timestamp: new Date().toISOString(), content: "Insufficient verification. Cannot confirm authenticity. Reject to maintain credibility standards." }
        ]),
        juniorEditorialNotes: "Multiple attempts to verify - no confirmation from restaurant or celebrity's team.",
        seniorEditorialNotes: "Does not meet our verification standards. Reject.",
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
      {
        title: "Traffic Accident on Main Highway",
        submissionDate: today,
        currentStatus: "Rejected",
        statusColor: "default",
        sources: "Social Media",
        assignedTo: "John Doe",
        submitterFullName: "John Doe",
        submitterIc: "S1234567A",
        submitterAddress: "123 Main Street, Singapore 123456",
        submitterPhone: "+65 9123 4567",
        submitterEmail: "john.doe@email.com",
        storyTitle: "Traffic Accident on Main Highway",
        storyDescription: "Reports of a major traffic accident on the main highway causing significant delays. Social media posts show damaged vehicles and emergency services on scene.",
        storyCategory: "Community",
        storyUrgency: "High",
        storyEstimatedImpact: "Moderate",
        attachments: null,
        links: JSON.stringify([
          { id: "1", url: "https://twitter.com/user/status/123", description: "Twitter post", verified: false }
        ]),
        editorialNotes: JSON.stringify([
          { role: "Junior Editor", action: "Verification Attempt", timestamp: new Date().toISOString(), content: "Contacted traffic police - no record of major accident at reported location. Social media posts appear to be from a different incident." },
          { role: "Senior Editor", action: "Rejection", timestamp: new Date().toISOString(), content: "Unverified information. Potential misinformation. Reject to avoid spreading false news." }
        ]),
        juniorEditorialNotes: "Cannot verify with official sources. Posts may be from unrelated incident.",
        seniorEditorialNotes: "Safety concern - do not publish unverified traffic information. Reject.",
        publishedDate: null,
        publishingDetails: null,
        performanceMetrics: null,
      },
    ];

    await db.insert(newsArticles).values(articlesData);

    // Insert applications
    const applicationsData = [
      // Document Assessment (2)
      {
        applicationId: "APP-2026-001",
        candidateName: "Tan Wei Ming",
        submissionDate: "2026-03-20",
        overallProgress: 15,
        currentStatus: "Document Assessment",
        statusColor: "warning",
        assignedTo: "Sarah Chen",
        trainingProvider: "Singapore Polytechnic",
        email: "tanweiming@email.com",
        phone: "+65 9123 4567",
        notes: "Initial document review pending. Awaiting transcript verification.",
      },
      {
        applicationId: "APP-2026-002",
        candidateName: "Lim Siew Hoon",
        submissionDate: "2026-03-21",
        overallProgress: 10,
        currentStatus: "Document Assessment",
        statusColor: "warning",
        assignedTo: "Sarah Chen",
        trainingProvider: "Temasek Polytechnic",
        email: "limsiewhoon@email.com",
        phone: "+65 9234 5678",
        notes: "Missing employment history documents. Follow-up sent.",
      },
      // Candidate Screening (2)
      {
        applicationId: "APP-2026-003",
        candidateName: "Muhammad Rafi bin Ahmad",
        submissionDate: "2026-03-15",
        overallProgress: 40,
        currentStatus: "Candidate Screening",
        statusColor: "info",
        assignedTo: "David Wong",
        trainingProvider: "ITE College Central",
        email: "rafi.ahmad@email.com",
        phone: "+65 9345 6789",
        notes: "Phone screening completed. In-person interview scheduled for 2026-03-28.",
      },
      {
        applicationId: "APP-2026-004",
        candidateName: "Ng Hui Ling",
        submissionDate: "2026-03-16",
        overallProgress: 35,
        currentStatus: "Candidate Screening",
        statusColor: "info",
        assignedTo: "David Wong",
        trainingProvider: "Nanyang Polytechnic",
        email: "nghuiling@email.com",
        phone: "+65 9456 7890",
        notes: "Background check in progress. Expected completion by 2026-03-30.",
      },
      // Pending Approval (2)
      {
        applicationId: "APP-2026-005",
        candidateName: "Kumar Rajesh",
        submissionDate: "2026-03-10",
        overallProgress: 70,
        currentStatus: "Pending Approval",
        statusColor: "primary",
        assignedTo: "Michelle Tan",
        trainingProvider: "Singapore Institute of Technology",
        email: "kumar.rajesh@email.com",
        phone: "+65 9567 8901",
        notes: "All documents verified. Awaiting final approval from committee.",
      },
      {
        applicationId: "APP-2026-006",
        candidateName: "Ong Mei Ling",
        submissionDate: "2026-03-12",
        overallProgress: 65,
        currentStatus: "Pending Approval",
        statusColor: "primary",
        assignedTo: "Michelle Tan",
        trainingProvider: "Republic Polytechnic",
        email: "ongmeiling@email.com",
        phone: "+65 9678 9012",
        notes: "Committee review scheduled for 2026-03-26.",
      },
      // Approved (2)
      {
        applicationId: "APP-2026-007",
        candidateName: "Chen Jia Wei",
        submissionDate: "2026-03-05",
        overallProgress: 100,
        currentStatus: "Approved",
        statusColor: "success",
        assignedTo: "Lee Hock Seng",
        trainingProvider: "LASALLE College of the Arts",
        email: "chenjiawei@email.com",
        phone: "+65 9789 0123",
        notes: "Application approved. Enrollment confirmed for April 2026 intake.",
      },
      {
        applicationId: "APP-2026-008",
        candidateName: "Sarah Binte Abdullah",
        submissionDate: "2026-03-06",
        overallProgress: 95,
        currentStatus: "Approved",
        statusColor: "success",
        assignedTo: "Lee Hock Seng",
        trainingProvider: "Ngee Ann Polytechnic",
        email: "sarah.abdullah@email.com",
        phone: "+65 9890 1234",
        notes: "Approved. Pending final enrollment confirmation.",
      },
    ];

    await db.insert(applications).values(applicationsData);

    // Insert stations
    const stationsData = [
      {
        name: "Kiss 92",
        active: true,
        url: "https://22283.live.streamtheworld.com/ONE_FM_913AAC.aac",
        segmentDuration: 60,
        logo: null,
      },
      {
        name: "98.3 FM",
        active: false,
        url: null,
        segmentDuration: 60,
        logo: null,
      },
      {
        name: "91.3 FM",
        active: false,
        url: null,
        segmentDuration: 60,
        logo: null,
      },
      {
        name: "Money FM 89.3",
        active: false,
        url: "https://28123.mc.tritondigital.com/OMNY_STNEWSPRESENTEDBYMONEYFM_NEWSFROMTHESTRAITSTIMES_P/media-session/2786998d-7493-4ca3-bd02-e63cf11b2f0d/d/clips/d9486183-3dd4-4ad6-aebe-a4c1008455d5/4e188010-01ce-44a9-bf38-adcf004a366a/f42be6fd-55b0-4998-bebe-b3a2000e0dfa/audio/direct/t1764204709/MONEYFM_-_8_31am_NEWS_HEADLINES.mp3?t=1764204709&in_playlist=a86dfcac-e7b5-4438-b84b-adcf004aff3b",
        segmentDuration: 60,
        logo: null,
      },
    ];

    const insertedStations = await db.insert(stations).values(stationsData).returning();

    // Insert segments for 98.3 FM (id: 2) and 91.3 FM (id: 3)
    const segmentsData = [
      {
        stationId: insertedStations[1].id, // 98.3 FM
        fromTime: new Date().toISOString().replace("T", " ").slice(0, 19),
        toTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19),
        srt: "Smooth jazz all morning long...",
        segmentCategory: "Music",
        agentResponse: "Enjoying some smooth jazz vibes on 98.3 FM! #JazzVibes #MorningMusic",
        clipUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        shared: false,
        sharedPlatforms: null,
      },
      {
        stationId: insertedStations[2].id, // 91.3 FM
        fromTime: new Date().toISOString().replace("T", " ").slice(0, 19),
        toTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19),
        srt: "Rock on! We have a special guest...",
        segmentCategory: "Interview",
        agentResponse: "Incredible interview happening right now on 91.3 FM! Don't miss it! #RadioInterview #RockOn",
        clipUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        shared: false,
        sharedPlatforms: null,
      },
    ];

    await db.insert(segments).values(segmentsData);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        articles: 11,
        applications: 8,
        stations: 4,
        segments: 2,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
