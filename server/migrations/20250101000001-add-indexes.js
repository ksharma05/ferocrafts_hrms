/**
 * Migration: Add database indexes for performance
 */

module.exports = {
  async up(db, client) {
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });

    // EmployeeProfile indexes
    await db.collection('employeeprofiles').createIndex({ user: 1 }, { unique: true });
    await db.collection('employeeprofiles').createIndex({ aadhaarNo: 1 }, { unique: true });
    await db.collection('employeeprofiles').createIndex({ phoneNumber: 1 });

    // Attendance indexes
    await db.collection('attendances').createIndex({ employeeId: 1, date: -1 });
    await db.collection('attendances').createIndex({ status: 1 });
    await db.collection('attendances').createIndex({ date: -1 });
    await db.collection('attendances').createIndex({ location: '2dsphere' });

    // ClientSite indexes
    await db.collection('clientsites').createIndex({ name: 1 }, { unique: true });

    // EmployeeSiteAssignment indexes
    await db.collection('employeesiteassignments').createIndex(
      { employeeId: 1, siteId: 1 },
      { unique: true }
    );
    await db.collection('employeesiteassignments').createIndex({ employeeId: 1, endDate: 1 });

    // Payout indexes
    await db.collection('payouts').createIndex({ employeeId: 1, period: -1 });
    await db.collection('payouts').createIndex({ status: 1 });

    console.log('✅ Indexes created successfully');
  },

  async down(db, client) {
    // Drop indexes (reverse migration)
    await db.collection('users').dropIndex('email_1');
    await db.collection('users').dropIndex('role_1');

    await db.collection('employeeprofiles').dropIndex('user_1');
    await db.collection('employeeprofiles').dropIndex('aadhaarNo_1');
    await db.collection('employeeprofiles').dropIndex('phoneNumber_1');

    await db.collection('attendances').dropIndex('employeeId_1_date_-1');
    await db.collection('attendances').dropIndex('status_1');
    await db.collection('attendances').dropIndex('date_-1');
    await db.collection('attendances').dropIndex('location_2dsphere');

    await db.collection('clientsites').dropIndex('name_1');

    await db.collection('employeesiteassignments').dropIndex('employeeId_1_siteId_1');
    await db.collection('employeesiteassignments').dropIndex('employeeId_1_endDate_1');

    await db.collection('payouts').dropIndex('employeeId_1_period_-1');
    await db.collection('payouts').dropIndex('status_1');

    console.log('✅ Indexes dropped successfully');
  },
};

