const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logAudit } = require('../utils/auditLogger');

// Utility to map SSO attributes to roles and organization_id
function mapSsoToTenantAndRole(userInfo, ssoType) {

  const tenantData = require('../data/tenant_data.json');

  const emailDomain = (userInfo.mail || userInfo.email || '').split('@')[1];
  const tenant = tenantData.tenants.find(t =>
    t.sso_config && t.sso_config.domain && t.sso_config.domain === emailDomain
  ) || tenantData.tenants[0];

  let role = 'user';
  if (tenant && tenant.sso_config && tenant.sso_config.role_mappings) {
    const dept = userInfo.department || userInfo.dept || '';
    if (tenant.sso_config.role_mappings[dept]) {
      role = tenant.sso_config.role_mappings[dept];
    }
  }

  return {
    organization_id: tenant && tenant.id ? tenant.sso_config.tenant_id : null,
    role
  };
}

async function login(req, res) {
  try{
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id || null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    // Audit log: user logged in
    await logAudit({
        actorId: user.id,
        organizationId: user.organization_id,
        action: 'USER_LOGIN',
        resourceType: 'user',
        resourceId: user.id,
        before: null,
        after: { lastLogin: new Date() }
    });
    await user.update({ last_login: new Date() });

    return res.json({ token });
  } catch(error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Simulated Azure AD SSO
async function ssoAzure(req, res) {
  try {
    const sso = require('../data/sso_responses.json');
    const userInfo = sso.azure_ad_response.user_info;

    // Map org and role from SSO
    const { organization_id, role } = mapSsoToTenantAndRole(userInfo, 'azure');

    let user = await User.findOne({ where: { email: userInfo.mail } });
    if (!user) {
      user = await User.create({
        email: userInfo.mail,
        first_name: userInfo.givenName,
        last_name: userInfo.surname,
        role,
        organization_id
      });
    } else {
      // Update role/org if changed
      await user.update({ role, organization_id });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id || null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    await logAudit({
      actorId: user.id,
      organizationId: user.organization_id,
      action: 'USER_SSO_LOGIN',
      resourceType: 'user',
      resourceId: user.id,
      before: null,
      after: { sso: 'azure_ad', lastLogin: new Date() }
    });

    await user.update({ last_login: new Date() });

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error || 'Internal server error' });
  }
}

// Simulated Okta SSO
async function ssoOkta(req, res) {
  try {
    const sso = require('../data/sso_responses.json');
    const userInfo = sso.okta_response.user_info;

    // Map org and role from SSO
    const { organization_id, role } = mapSsoToTenantAndRole(userInfo, 'okta');

    let user = await User.findOne({ where: { email: userInfo.email } });
    if (!user) {
      user = await User.create({
        email: userInfo.email,
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        role,
        organization_id
      });
    } else {
      await user.update({ role, organization_id });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id || null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    await logAudit({
      actorId: user.id,
      organizationId: user.organization_id,
      action: 'USER_SSO_LOGIN',
      resourceType: 'user',
      resourceId: user.id,
      before: null,
      after: { sso: 'okta', lastLogin: new Date() }
    });

    await user.update({ last_login: new Date() });

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error || 'Internal server error' });
  }
}

module.exports = { login, ssoAzure, ssoOkta };