const bcrypt = require('bcryptjs');

// In-Memory persistent user storage for zero-downtime local development
const memoryUsers = new Map();

// Initialize Default Demo Users so login always works out-of-the-box
const initDefaultUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  const adminHashed = await bcrypt.hash('admin123', salt);

  // 1. Verified Student Account (Sachin Kumar)
  memoryUsers.set('sachin@gmail.com', {
    _id: 'usr_sachin_verified_student',
    name: 'Sachin Kumar',
    email: 'sachin@gmail.com',
    password: hashedPassword,
    role: 'student',
    studentDetails: {
      collegeName: 'SAGE University Indore',
      documentUrl: '/uploads/demo-id.jpg',
      verificationStatus: 'approved',
      studentIdCode: 'NEXO-STU-2026-8812',
      verifiedAt: new Date(),
    },
    createdAt: new Date(),
  });

  // 2. Admin Account
  memoryUsers.set('admin@nexo.in', {
    _id: 'usr_nexo_admin',
    name: 'NEXO Super Admin',
    email: 'admin@nexo.in',
    password: adminHashed,
    role: 'admin',
    studentDetails: {
      verificationStatus: 'none',
    },
    createdAt: new Date(),
  });
};

initDefaultUsers();

// Helpers
const findByEmail = (email) => {
  if (!email) return null;
  return memoryUsers.get(email.toLowerCase().trim()) || null;
};

const findById = (id) => {
  if (!id) return null;
  for (const user of memoryUsers.values()) {
    if (user._id.toString() === id.toString()) {
      return user;
    }
  }
  return null;
};

const saveUser = (userObj) => {
  const id = userObj._id || `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const clean = {
    ...userObj,
    _id: id,
    email: userObj.email.toLowerCase().trim(),
    createdAt: userObj.createdAt || new Date(),
    studentDetails: userObj.studentDetails || {
      collegeName: '',
      documentUrl: '',
      verificationStatus: 'none',
      studentIdCode: null,
    },
  };
  memoryUsers.set(clean.email, clean);
  return clean;
};

const updateUser = (id, updates) => {
  const user = findById(id);
  if (!user) return null;

  // Flatten & merge updates
  const updated = { ...user, ...updates };
  if (updates['studentDetails.verificationStatus']) {
    updated.studentDetails.verificationStatus = updates['studentDetails.verificationStatus'];
  }
  if (updates['studentDetails.studentIdCode']) {
    updated.studentDetails.studentIdCode = updates['studentDetails.studentIdCode'];
  }
  if (updates['studentDetails.collegeName']) {
    updated.studentDetails.collegeName = updates['studentDetails.collegeName'];
  }
  if (updates['studentDetails.documentUrl']) {
    updated.studentDetails.documentUrl = updates['studentDetails.documentUrl'];
  }

  memoryUsers.set(updated.email, updated);
  return updated;
};

const getPendingStudents = () => {
  const pending = [];
  for (const user of memoryUsers.values()) {
    if (user.studentDetails?.verificationStatus === 'pending') {
      pending.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
        createdAt: user.createdAt,
      });
    }
  }
  return pending;
};

module.exports = {
  findByEmail,
  findById,
  saveUser,
  updateUser,
  getPendingStudents,
};

