import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create the Admin User (ID: 1)
  const user = await prisma.user.upsert({
    where: { email: "admin@cal.com" },
    update: {},
    create: {
      username: "kavya",
      email: "admin@cal.com",
      // 2. Create default "Work Hours" (9am - 5pm, Mon-Fri)
      availabilities: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }, // Mon
          { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" }, // Tue
          { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" }, // Wed
          { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" }, // Thu
          { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" }, // Fri
        ],
      },
      // 3. Create two default Event Types
      eventTypes: {
        create: [
          {
            title: "15 Min Meeting",
            slug: "15min",
            duration: 15,
            description: "A quick sync.",
          },
          {
            title: "30 Min Meeting",
            slug: "30min",
            duration: 30,
            description: "Standard discussion.",
          },
        ],
      },
    },
  });

  console.log("Seed successful! Created user:", user.username);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
