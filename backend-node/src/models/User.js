const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👤 USER DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Active Record & Domain Lifecycle Hooks
 * 
 * 1. THE HISTORICAL PROBLEM:
 *    When developers put hashing logic inside Controllers, someone eventually writes
 *    a new "update profile" endpoint and forgets to hash the password. The password
 *    leaks to the database in plaintext.
 * 
 * 2. THE DESIGN PATTERN: Lifecycle Interceptor (Pre-Save Hook)
 *    Mongoose allows us to intercept the document BEFORE it writes to disk.
 *    No matter which controller or script calls `.save()`, the password is
 *    GUARANTEED to be hashed using 10 rounds of salted BCrypt.
 * 
 * 3. ROSETTA STONE:
 *    Spring Boot: User.java + UserRepository.java + passwordEncoder.encode()
 *    Node.js:     mongoose.Schema() + userSchema.pre('save')
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Never return password hash in queries by default (Security in Depth)
    },
    role: {
      type: String,
      enum: ['ROLE_CUSTOMER', 'ROLE_ADMIN'],
      default: 'ROLE_CUSTOMER'
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// ════════════════════════════════════════════════════════════════════════════════
// 🔒 LIFECYCLE HOOK: Pre-save Password Encryption
// ════════════════════════════════════════════════════════════════════════════════
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ════════════════════════════════════════════════════════════════════════════════
// 🔑 MODEL INSTANCE METHOD: Verify Password
// ════════════════════════════════════════════════════════════════════════════════
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
