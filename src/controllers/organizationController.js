const { Organization, User, sequelize } = require('../models');

async function createOrganization(req, res) {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { name, subscription_tier, employee_limit, admin_user } = req.body;

  if (!admin_user || !admin_user.email) {
    return res.status(400).json({ error: 'Missing admin_user details' });
  }

  const t = await sequelize.transaction();
  try {
    const org = await Organization.create({
      name,
      subscription_tier,
      employee_limit,
      features_enabled: [],
      webhook_endpoints: {}
    }, { transaction: t });

    const user = await User.create({
      email: admin_user.email,
      first_name: admin_user.first_name,
      last_name: admin_user.last_name,
      role: 'admin',
      organization_id: org.id,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ organization: org, admin_user: user });
  } catch (err) {
    await t.rollback();
    console.error('Error creating org + admin:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}


async function getMyOrganization(req, res) {
  const org = await Organization.findByPk(req.user.organization_id);
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  res.json({ organization: org });
}

async function getMyOrganizations(req, res) {
    const org = await Organization.findAll();
    if (!org) return res.status(404).json({ error: 'No Organization found' });
    res.json({ organization: org });
  }

  async function deleteMyOrganizations(req, res) {
    try {
        const org = await Organization.destroy({ where: req.query });
        if (!org) return res.status(404).json({ error: 'No Organization found' });
        return res.json({ organization: org });
    } catch (error) {
        console.log('Error deleting organization:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
   
  }

module.exports = { createOrganization, getMyOrganization, getMyOrganizations, deleteMyOrganizations };
