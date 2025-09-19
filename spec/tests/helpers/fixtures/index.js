/**
 * Test Fixtures - Centralized test data generation
 * RepoKIT Standard: Consistent test data across all tests
 */

const { faker } = require('@faker-js/faker');

/**
 * Generate a test user with consistent structure
 */
function generateTestUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: 'TestPassword123!',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate a test company with consistent structure
 */
function generateTestCompany(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    website: faker.internet.url(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    stage: faker.helpers.arrayElement(['prospect', 'qualified', 'proposal', 'negotiation', 'closed']),
    contactName: faker.person.fullName(),
    position: faker.person.jobTitle(),
    industry: faker.commerce.department(),
    size: faker.helpers.arrayElement(['1-10', '11-50', '51-200', '201-1000', '1000+']),
    location: `${faker.location.city()}, ${faker.location.state()}`,
    notes: faker.lorem.paragraph(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate a test draft with consistent structure
 */
function generateTestDraft(overrides = {}) {
  return {
    id: faker.string.uuid(),
    companyId: overrides.companyId || faker.string.uuid(),
    subject: 'Partnership Opportunity with {{company_name}}',
    content: `Hi {{contact_name}},

I hope this email finds you well. I'm reaching out regarding a potential partnership opportunity between our companies.

As the {{position}} at {{company_name}}, I believe you'd be interested in our new solution.

Best regards,
{{sender_name}}`,
    status: faker.helpers.arrayElement(['draft', 'sent', 'replied']),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate CSV data for upload tests
 */
function generateCSVData(companies) {
  const headers = ['name', 'email', 'phone', 'stage', 'contactName', 'position', 'website'];
  const csvLines = [headers.join(',')];
  
  companies.forEach(company => {
    const row = headers.map(header => {
      const value = company[header] || '';
      // Escape commas and quotes in CSV
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvLines.push(row.join(','));
  });
  
  return csvLines.join('\n');
}

/**
 * Generate test job posting
 */
function generateTestJob(overrides = {}) {
  return {
    id: faker.string.uuid(),
    companyId: overrides.companyId || faker.string.uuid(),
    title: faker.person.jobTitle(),
    description: faker.lorem.paragraphs(3),
    requirements: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence()
    ],
    location: faker.location.city(),
    salary: `$${faker.number.int({ min: 50000, max: 200000 })}`,
    type: faker.helpers.arrayElement(['full-time', 'part-time', 'contract', 'remote']),
    status: faker.helpers.arrayElement(['active', 'paused', 'closed']),
    postedAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate test contact
 */
function generateTestContact(overrides = {}) {
  return {
    id: faker.string.uuid(),
    companyId: overrides.companyId || faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    department: faker.commerce.department(),
    isPrimary: faker.datatype.boolean(),
    notes: faker.lorem.sentence(),
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate test pipeline stage
 */
function generateTestStage(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Prospect', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']),
    order: faker.number.int({ min: 1, max: 6 }),
    color: faker.internet.color(),
    description: faker.lorem.sentence(),
    ...overrides
  };
}

/**
 * Generate multiple test records
 */
function generateMultiple(generator, count = 5, overrides = {}) {
  return Array.from({ length: count }, () => generator(overrides));
}

/**
 * Create database seeder data
 */
function createSeederData() {
  const users = generateMultiple(generateTestUser, 3);
  const companies = generateMultiple(generateTestCompany, 20);
  const jobs = companies.flatMap(company => 
    generateMultiple(() => generateTestJob({ companyId: company.id }), 2)
  );
  const contacts = companies.flatMap(company =>
    generateMultiple(() => generateTestContact({ companyId: company.id }), 3)
  );
  const drafts = companies.flatMap(company =>
    generateMultiple(() => generateTestDraft({ companyId: company.id }), 1)
  );

  return {
    users,
    companies,
    jobs,
    contacts,
    drafts
  };
}

module.exports = {
  generateTestUser,
  generateTestCompany,
  generateTestDraft,
  generateTestJob,
  generateTestContact,
  generateTestStage,
  generateCSVData,
  generateMultiple,
  createSeederData
};