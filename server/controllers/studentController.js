const User = require('../models/User');
const mongoose = require('mongoose');
const userStore = require('../utils/userStore');

// Helper function to generate unique Student ID Code
const generateStudentId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NEXO-STU-2026-${randomNum}`;
};

// @desc    Submit Student Verification Document
// @route   POST /api/student/verify
exports.submitVerification = async (req, res) => {
  try {
    const { collegeName } = req.body;

    if (!collegeName) {
      return res.status(400).json({ success: false, message: 'Please enter your college name' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload your College ID card' });
    }

    const documentUrl = `/uploads/${req.file.filename}`;

    // 1. Try updating in MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            'studentDetails.collegeName': collegeName,
            'studentDetails.documentUrl': documentUrl,
            'studentDetails.verificationStatus': 'pending',
          },
          { new: true }
        ).select('-password');

        if (updatedUser) {
          return res.status(200).json({
            success: true,
            message: 'Document submitted successfully! Verification is under review.',
            studentDetails: updatedUser.studentDetails,
          });
        }
      } catch (dbErr) {
        console.log('MongoDB update failed, using local userStore');
      }
    }

    // 2. Resilient update in userStore
    const updatedMem = userStore.updateUser(req.user._id, {
      'studentDetails.collegeName': collegeName,
      'studentDetails.documentUrl': documentUrl,
      'studentDetails.verificationStatus': 'pending',
    });

    res.status(200).json({
      success: true,
      message: 'Document submitted successfully! Verification is under review.',
      studentDetails: updatedMem ? updatedMem.studentDetails : { verificationStatus: 'pending' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Submission failed', error: error.message });
  }
};

// @desc    Get All Pending Student Verification Requests (Admin Only)
// @route   GET /api/student/admin/pending
exports.getPendingVerifications = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const pendingStudents = await User.find({
          'studentDetails.verificationStatus': 'pending',
        }).select('name email role studentDetails createdAt');

        if (pendingStudents && pendingStudents.length > 0) {
          return res.status(200).json({
            success: true,
            count: pendingStudents.length,
            students: pendingStudents,
          });
        }
      } catch (dbErr) {
        // Fallback to userStore
      }
    }

    // Fallback to userStore
    const memPending = userStore.getPendingStudents();
    res.status(200).json({
      success: true,
      count: memPending.length,
      students: memPending,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending requests', error: error.message });
  }
};

// @desc    Approve or Reject Student Verification (Admin Only)
// @route   PUT /api/student/admin/review/:userId
exports.reviewVerification = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const newStudentId = status === 'approved' ? generateStudentId() : null;

    if (mongoose.connection.readyState === 1) {
      try {
        const updateData = {
          'studentDetails.verificationStatus': status,
        };
        if (status === 'approved') {
          updateData.role = 'student';
          updateData['studentDetails.studentIdCode'] = newStudentId;
          updateData['studentDetails.verifiedAt'] = new Date();
        }

        const student = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true }).select('-password');
        if (student) {
          return res.status(200).json({
            success: true,
            message: `Student verification ${status} successfully!`,
            student,
          });
        }
      } catch (dbErr) {
        // Fallback to userStore
      }
    }

    // Fallback to userStore
    const updated = userStore.updateUser(req.params.userId, {
      role: status === 'approved' ? 'student' : 'customer',
      'studentDetails.verificationStatus': status,
      'studentDetails.studentIdCode': newStudentId,
    });

    res.status(200).json({
      success: true,
      message: `Student verification ${status} successfully!`,
      student: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Review action failed', error: error.message });
  }
};
