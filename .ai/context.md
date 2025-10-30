# Project Context

> Business context, goals, and project-specific decisions

**Last Updated**: [Date]  
**Project Stage**: [Planning/Development/Production]  

## Product Overview

**Project Name**: [Your Project Name]

**Problem Statement**:  
[One sentence: What problem does this solve?]

Example: Users struggle to track their daily expenses and lose visibility into spending patterns.

**Solution**:  
[One sentence: How does your product solve this problem?]

Example: Simple mobile app that automatically categorizes expenses and provides spending insights.

**Value Proposition**:  
[One sentence: What unique value do you provide?]

Example: Track expenses in 10 seconds with AI-powered categorization and actionable insights.

## Target Users

### Primary Users
**Type**: [User persona]  
**Need**: [Core problem they have]  
**Context**: [When/where they use the product]

Example:
**Type**: Young professionals (25-35) managing personal finances  
**Need**: Quick expense tracking without manual categorization  
**Context**: On-the-go expense entry after purchases

### Secondary Users
**Type**: [Another user persona]  
**Need**: [Their specific need]

Example:
**Type**: Small business owners tracking business expenses  
**Need**: Separate personal and business expenses for tax purposes

## Success Metrics

### Business Metrics
| Metric | Target | Current | Timeline |
|--------|--------|---------|----------|
| [Key metric 1] | [Target value] | [Current value] | [By when] |
| [Key metric 2] | [Target value] | [Current value] | [By when] |

Example:
| Metric | Target | Current | Timeline |
|--------|--------|---------|----------|
| Active users | 10,000 | 0 | 6 months |
| Retention rate | 40% | - | 6 months |
| Revenue (MRR) | $10,000 | $0 | 12 months |

### Technical Metrics
| Metric | Target | Current |
|--------|--------|---------|
| API response time | < 200ms | - |
| Uptime | 99.9% | - |
| Test coverage | > 70% | - |

### User Experience Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Time to first value | < 2 min | - |
| Task completion rate | > 90% | - |
| User satisfaction (NPS) | > 40 | - |

## Tech Stack Decisions

### Backend
**Choice**: [Go/Node.js/etc]  
**Reason**: [Why this choice for this project]

Example:
**Choice**: Go  
**Reason**: High performance for handling thousands of concurrent expense entries, simple deployment

### Frontend
**Choice**: [Next.js/React/Vue/etc]  
**Reason**: [Why this choice]

Example:
**Choice**: Next.js with TypeScript  
**Reason**: SEO important for landing page, SSR for fast initial load, TypeScript for type safety

### Database
**Choice**: [PostgreSQL/MongoDB/etc]  
**Reason**: [Why this choice]

Example:
**Choice**: PostgreSQL  
**Reason**: Relational data (users, expenses, categories), strong ACID guarantees for financial data

### Infrastructure
**Choice**: [AWS/GCP/Kubernetes/etc]  
**Reason**: [Why this choice]

Example:
**Choice**: AWS with ECS  
**Reason**: Team familiarity, managed services reduce ops burden, cost-effective for initial scale

### Overrides from Defaults

If using different stack than GUIDE.md defaults, document here:

Example:
- **Using MongoDB instead of PostgreSQL**: Document-based structure fits our flexible schema needs
- **Using Vue.js instead of React**: Team has Vue expertise, faster development

## Core Features

### MVP Features (Phase 1)

**Priority 1** (Must have):
1. **[Feature 1]**: [Brief description]
   - User value: [What user gets]
   - Success metric: [How to measure success]

2. **[Feature 2]**: [Brief description]
   - User value: [What user gets]
   - Success metric: [How to measure success]

Example:
1. **Expense Entry**: Quick expense capture with photo upload
   - User value: Log expense in < 10 seconds
   - Success metric: 90% of expenses entered in under 10 seconds

2. **Automatic Categorization**: AI categorizes expenses automatically
   - User value: No manual categorization needed
   - Success metric: 85%+ categorization accuracy

**Priority 2** (Should have):
- [Feature that's important but not blocking]

**Priority 3** (Nice to have):
- [Feature that can wait]

### Post-MVP Features (Phase 2)

Planned for after MVP validation:
- [Future feature 1]
- [Future feature 2]

## Constraints and Requirements

### Technical Constraints
- [Budget limit]: Maximum infrastructure cost $500/month initially
- [Performance]: Must handle 100 requests/second minimum
- [Compliance]: Must be GDPR compliant for EU users

### Business Constraints
- [Timeline]: MVP must launch in 8 weeks
- [Team]: Solo developer + contract designer
- [Budget]: $10,000 development budget

### Security Requirements
- All data encrypted at rest and in transit
- Authentication required for all features
- PCI compliance not required (no payment processing initially)

## Key Assumptions

Document assumptions that affect decisions:

1. **User behavior**: Users will enter expenses within 24 hours of purchase
2. **Scale**: Will reach 1,000 users in first 3 months
3. **Integration**: Will integrate with bank APIs in Phase 2 (not MVP)

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How to mitigate] |

Example:
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Launch with waitlist, get early feedback |
| AI categorization accuracy | Medium | Medium | Allow manual override, improve over time |
| Competitor launches similar | Low | High | Focus on speed and UX differentiation |

## Development Timeline

**Week 1-2**: Foundation
- Project setup
- Authentication system
- Database schema

**Week 3-4**: Core Features
- Expense entry
- Basic categorization
- User dashboard

**Week 5-6**: Polish
- AI categorization
- Mobile optimization
- Testing

**Week 7-8**: Launch Prep
- Beta testing
- Bug fixes
- Deployment

## Resources and References

**Design Assets**:
- Figma: [Link to designs]
- Brand guidelines: [Link]

**External APIs**:
- [API name]: [Documentation link]

**Competitor Analysis**:
- [Competitor 1]: [What they do well/poorly]
- [Competitor 2]: [What they do well/poorly]

## Questions and Decisions Log

Track important questions and decisions:

**[Date]**: [Question asked]  
**Decision**: [What was decided]  
**Reasoning**: [Why]

Example:
**2025-10-30**: Should we support multiple currencies in MVP?  
**Decision**: No, USD only for MVP  
**Reasoning**: Adds complexity, 90% of early users will be US-based

---

**Note**: This document should be updated as the project evolves and new information is learned.

**Review frequency**: Weekly during development, monthly after launch
