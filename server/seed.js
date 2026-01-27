const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./src/models/User');
const EmployeeProfile = require('./src/models/EmployeeProfile');
const ClientSite = require('./src/models/ClientSite');
const EmployeeSiteAssignment = require('./src/models/EmployeeSiteAssignment');
const Attendance = require('./src/models/Attendance');
const Payout = require('./src/models/Payout');

// Load env vars
dotenv.config();

const connect = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing. Please set it in server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

const randomAadhaar = (seed) => {
  // 12-digit string, unique-ish per seed (NOT real Aadhaar)
  const base = String(100000000000 + seed).slice(0, 12);
  return base;
};

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const destroyData = async () => {
  await Attendance.deleteMany();
  await Payout.deleteMany();
  await EmployeeSiteAssignment.deleteMany();
  await ClientSite.deleteMany();
  await EmployeeProfile.deleteMany();
  await User.deleteMany();
};

const seed = async () => {
  // Users
  const adminUser = await User.create({
    email: 'admin@ferocrafts.com',
    password: 'Admin@123',
    role: 'admin',
  });

  const managerUser = await User.create({
    email: 'manager@ferocrafts.com',
    password: 'Manager@123',
    role: 'manager',
  });

  const employees = await User.create([
    { email: 'employee1@ferocrafts.com', password: 'Employee@123', role: 'employee' },
    { email: 'employee2@ferocrafts.com', password: 'Employee@123', role: 'employee' },
    { email: 'employee3@ferocrafts.com', password: 'Employee@123', role: 'employee' },
  ]);

  // Employee profiles
  const profiles = await EmployeeProfile.create(
    employees.map((u, idx) => ({
      user: u._id,
      name: `Employee ${idx + 1}`,
      phoneNumber: `99900000${idx + 1}${idx + 1}`,
      aadhaarNo: randomAadhaar(12345 + idx),
      dob: new Date(1995, idx, 10),
      bankDetails: {
        accountNumber: `00011122233${idx}`,
        ifscCode: `IFSC0000${100 + idx}`,
      },
      upiId: `employee${idx + 1}@upi`,
      documents: [
        { name: 'photo', url: 'https://example.com/photo.jpg' },
        { name: 'id-proof', url: 'https://example.com/id.pdf' },
      ],
    }))
  );

  // Sites
  const sites = await ClientSite.create([
    {
      name: 'FeroCrafts - Plant A',
      location: 'Ahmedabad',
      description: 'Main production site (dummy data)',
    },
    {
      name: 'FeroCrafts - Site B',
      location: 'Surat',
      description: 'Secondary site (dummy data)',
    },
  ]);

  // Assignments (current assignment has no endDate)
  await EmployeeSiteAssignment.create([
    {
      employeeId: employees[0]._id,
      siteId: sites[0]._id,
      startDate: daysAgo(45),
      wageRatePerDay: 800,
      wageRatePerMonth: 24000,
    },
    {
      employeeId: employees[1]._id,
      siteId: sites[0]._id,
      startDate: daysAgo(30),
      wageRatePerDay: 750,
      wageRatePerMonth: 22500,
    },
    {
      employeeId: employees[2]._id,
      siteId: sites[1]._id,
      startDate: daysAgo(20),
      wageRatePerDay: 700,
      wageRatePerMonth: 21000,
    },
  ]);

  // Attendance (a few days per employee)
  const attendanceDocs = [];
  employees.forEach((u, idx) => {
    for (let d = 1; d <= 6; d++) {
      const date = daysAgo(10 + d + idx);
      const checkInTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      const checkOutTime = new Date(date.getTime() + 18 * 60 * 60 * 1000);

      attendanceDocs.push({
        employeeId: u._id,
        date,
        checkInTime,
        checkOutTime,
        selfieUrl: 'https://example.com/selfie.jpg',
        location: {
          type: 'Point',
          coordinates: [72.5714 + idx * 0.01, 23.0225 + idx * 0.01], // lng, lat
        },
        status: d % 3 === 0 ? 'pending' : 'approved',
        approvedBy: d % 3 === 0 ? undefined : managerUser._id,
        notes: 'Seeded attendance record',
      });
    }
  });
  await Attendance.insertMany(attendanceDocs);

  // Payouts (two periods per employee)
  const payoutDocs = [];
  employees.forEach((u, idx) => {
    payoutDocs.push(
      {
        employeeId: u._id,
        period: '2025-11',
        totalDaysWorked: 22,
        grossPay: 22000 + idx * 500,
        deductions: 1200,
        netPay: 20800 + idx * 500,
        status: 'paid',
      },
      {
        employeeId: u._id,
        period: '2025-12',
        totalDaysWorked: 20,
        grossPay: 20000 + idx * 500,
        deductions: 1000,
        netPay: 19000 + idx * 500,
        status: 'generated',
      }
    );
  });
  await Payout.insertMany(payoutDocs);

  console.log('✅ Seed completed');
  console.log(`Admin login: ${adminUser.email} / Admin@123`);
  console.log(`Manager login: ${managerUser.email} / Manager@123`);
  console.log(`Employee login: ${employees[0].email} / Employee@123 (and employee2/3)`);
  console.log(`Seeded profiles: ${profiles.length}, sites: ${sites.length}`);
};

const run = async () => {
  try {
    await connect();

    const destroyOnly = process.argv.includes('--destroy');
    if (destroyOnly) {
      await destroyData();
      console.log('🧹 Database cleared');
      process.exit(0);
    }

    await destroyData();
    await seed();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

run();
