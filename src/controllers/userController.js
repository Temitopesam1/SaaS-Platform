const { User } = require('../models');
const { logAudit } = require('../utils/auditLogger');

async function createUser(req, res) {
  try {
    const { email, first_name, last_name, role } = req.body;

    const newUser = await User.create({
      email,
      first_name,
      last_name,
      role,
      organization_id: req.user.organization_id
    });
  
    // Audit log: user created
    await logAudit({
      actorId: req.user.id,
      organizationId: req.user.organization_id,
      action: 'CREATE_USER',
      resourceType: 'user',
      resourceId: newUser.id,
      before: null,
      after: newUser.toJSON()
    });
  
    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }

}


async function listUsers(req, res) {
  const users = await User.findAll({
    where: { organization_id: req.user.organization_id }
  });
  res.json({ users });
}

module.exports = { listUsers, createUser };
