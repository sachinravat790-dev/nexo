const User = require('../models/User');

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

    // Server relative URL for uploaded document
    const documentUrl = `/uploads/${req.file.filename}`;

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        'studentDetails.collegeName': collegeName,
        'studentDetails.documentUrl': documentUrl,
        'studentDetails.verificationStatus': 'pending',
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Document submitted successfully! Verification is under review.',
      studentDetails: updatedUser.studentDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Submission failed', error: error.message });
  }
};

// @desc    Get All Pending Student Verification Requests (Admin Only)
// @route   GET /api/student/admin/pending
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingStudents = await User.find({
      'studentDetails.verificationStatus': 'pending',
    }).select('name email role studentDetails createdAt');

    res.status(200).json({
      success: true,
      count: pendingStudents.length,
      students: pendingStudents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending requests', error: error.message });
  }
};

// @desc    Approve or Reject Student Verification (Admin Only)
// @route   PUT /api/student/admin/review/:userId
exports.reviewVerification = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const updateData = {
      'studentDetails.verificationStatus': status,
    };

    if (status === 'approved') {
      updateData.role = 'student'; // Upgrade user role to verified student
      updateData['studentDetails.studentIdCode'] = generateStudentId();
      updateData['studentDetails.verifiedAt'] = new Date();
    }

    const student = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true }).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: `Student verification ${status} successfully!`,
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Review action failed', error: error.message });
  }
};