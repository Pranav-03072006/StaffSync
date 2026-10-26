const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['employee', 'manager', 'admin'], default: 'employee' },
  department: { type: String, default: 'General' },
  position: { type: String, default: 'Staff' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

UserSchema.virtual('designation').get(function() {
  return this.position;
});

UserSchema.virtual('firstName')
  .get(function() {
    if (!this.name) return '';
    return this.name.trim().split(' ')[0] || '';
  })
  .set(function(first) {
    const last = this.lastName || '';
    this.name = `${first} ${last}`.trim();
  });

UserSchema.virtual('lastName')
  .get(function() {
    if (!this.name) return '';
    const parts = this.name.trim().split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  })
  .set(function(last) {
    const first = this.firstName || '';
    this.name = `${first} ${last}`.trim();
  });

UserSchema.virtual('EmployeeID').get(function() {
  return this._id;
});

UserSchema.virtual('ManagerID').get(function() {
  return this._id;
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
