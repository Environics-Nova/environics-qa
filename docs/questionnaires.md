# Questionnaires Guide

Complete guide to questionnaires and validation rules in the Environics QA system.

## Table of Contents

- [Introduction](#introduction)
- [Understanding Questionnaires](#understanding-questionnaires)
- [Question Structure](#question-structure)
- [Relation Types](#relation-types)
- [Viewing Questionnaires](#viewing-questionnaires)
- [Creating Effective Questions](#creating-effective-questions)
- [Best Practices](#best-practices)

## Introduction

Questionnaires are reusable templates containing validation rules (questions) used by QA/QC processes to ensure data quality and consistency.

### What is a Questionnaire?

A **Questionnaire** is:
- A template of validation rules
- A collection of related questions
- Reusable across multiple processes
- Specific to event types (optionally)
- The blueprint for quality checks

### Purpose

**Questionnaires enable:**
- Standardized validation
- Consistent quality checks
- Reusable validation logic
- Automated error detection
- Compliance verification

## Understanding Questionnaires

### Questionnaire Components

```
Questionnaire
    ├── Name (descriptive title)
    ├── Description (purpose and scope)
    ├── Event Type (optional filter)
    └── Questions (validation rules)
        ├── Question 1
        ├── Question 2
        ├── Question 3
        └── ...
```

### Questionnaire Types

#### By Event Type

**Event-Specific:**
- Applies to one event type only
- Tailored validation rules
- Specialized checks

**Examples:**
```
GWMS Questionnaire → Only for Groundwater Monitoring
Drilling Questionnaire → Only for Drilling Events
Survey Questionnaire → Only for Survey Events
```

**General:**
- Applies to any event type
- Common validation rules
- Universal checks

**Examples:**
```
Basic Data Validation → All event types
Document Completeness → All event types
Date/Time Validation → All event types
```

#### By Purpose

**Compliance Questionnaires:**
- Regulatory requirements
- Standard compliance
- Legal requirements

**Quality Questionnaires:**
- Data accuracy
- Consistency checks
- Best practices

**Client-Specific Questionnaires:**
- Custom requirements
- Special deliverables
- Unique standards

### Questionnaire Attributes

**Name:**
- Clear, descriptive title
- Indicates purpose
- Easy to identify

**Description:**
- Explains validation scope
- Describes what is checked
- Notes any special requirements

**Event Type (Optional):**
- Filters applicability
- Ensures appropriate use
- Improves selection process

**Questions:**
- List of validation rules
- Individual checks
- Specific validations

### Example Questionnaire

```
Name: Groundwater Monitoring QA/QC
Description: Quality checks for groundwater monitoring events including 
             sample ID verification, date consistency, and measurement 
             validation against regulatory standards.
Event Type: GWMS
Questions: 12

Questions:
1. Field Form.Sample ID Equals Lab Report.Sample ID
2. Field Form.Well ID Equals Lab Report.Well ID
3. Field Form.Collection Date Equals Lab Report.Sample Date
4. Lab Report.pH > 6.5
5. Lab Report.pH < 8.5
6. Lab Report.Temperature > 0
7. Lab Report.Temperature < 30
8. Field Form.Collector Name Not Equals Empty
9. Field Notes.Weather Contains "Clear" OR "Cloudy" OR "Rain"
10. Lab Report.Analysis Date > Field Form.Collection Date
11. Lab Report.Turnaround Time < 14 days
12. Field Form.GPS Coordinates Not Equals Empty
```

## Question Structure

### Anatomy of a Question

A question has these components:

```
[Document 1].[Property 1] [Relation] [Document 2].[Property 2]
or
[Document 1].[Property 1] [Relation] [Fixed Value]
```

### Question Types

#### Type 1: Document-to-Document Comparison

Compares properties between two documents.

**Structure:**
```
Document Type 1.Property Name 1 [Relation] Document Type 2.Property Name 2
```

**Examples:**
```
Field Data Form.Sample ID Equals Lab Report.Sample ID
Field Form.Collection Date Equals Lab Report.Sample Date
Field Notes.Site Name Equals Chain of Custody.Location
```

**Use cases:**
- Cross-document consistency
- Data verification
- Transcription checking
- Reference validation

#### Type 2: Document-to-Value Comparison

Compares property against a fixed reference value.

**Structure:**
```
Document Type.Property Name [Relation] Fixed Value
```

**Examples:**
```
Lab Report.pH > 6.5
Temperature Reading < 30
Sample Count Equals 10
Field Notes.Site ID Contains "SITE-A"
```

**Use cases:**
- Threshold validation
- Range checking
- Standard compliance
- Required value verification

### Question Components

#### Document Types

Refers to categories of documents:
- Field Data Form
- Laboratory Report
- Chain of Custody
- Field Notes
- Survey Results
- Drilling Log
- Site Plan

#### Properties

Specific data fields within documents:
- Sample ID
- Collection Date
- GPS Coordinates
- pH Level
- Temperature
- Depth
- Volume
- Concentration

#### Relations

Comparison operators (see next section).

#### Values

- **From Document**: Property value from another document
- **Fixed Value**: Hardcoded reference value (number, text, date)

## Relation Types

### Available Relations

The system supports five relation types:

#### 1. Equals (=)

**Purpose:** Values must match exactly

**Use cases:**
- Sample IDs across documents
- Dates that should match
- Names and identifiers
- Reference numbers

**Examples:**
```
✓ Passed:
  Field Form.Sample ID: "SW-001"
  Lab Report.Sample ID: "SW-001"
  Result: Values match

✗ Failed:
  Field Form.Sample ID: "SW-001"
  Lab Report.Sample ID: "SW-002"
  Result: Values do not match
```

**Comparison behavior:**
- Case-sensitive for text
- Exact numeric match
- Exact date match

#### 2. Not Equals (≠)

**Purpose:** Values must be different

**Use cases:**
- Verify field not empty
- Ensure duplicate entries avoided
- Check for uniqueness

**Examples:**
```
✓ Passed:
  Sample ID: "SW-001"
  Empty: ""
  Result: Value is not empty

✗ Failed:
  Sample ID: ""
  Empty: ""
  Result: Field is empty
```

#### 3. Greater Than (>)

**Purpose:** First value must exceed second

**Use cases:**
- Minimum thresholds
- Lower limits
- Sequential dates
- Positive values

**Examples:**
```
✓ Passed:
  Lab Report.pH: 7.2
  Minimum: 6.5
  Result: 7.2 > 6.5

✗ Failed:
  Lab Report.pH: 6.2
  Minimum: 6.5
  Result: 6.2 not greater than 6.5
```

**Numeric comparison:**
- Works with integers
- Works with decimals
- Respects precision

**Date comparison:**
- Later date is "greater"
- Time-aware if included

#### 4. Less Than (<)

**Purpose:** First value must be below second

**Use cases:**
- Maximum thresholds
- Upper limits
- Expiration checks
- Negative bounds

**Examples:**
```
✓ Passed:
  Lab Report.pH: 7.8
  Maximum: 8.5
  Result: 7.8 < 8.5

✗ Failed:
  Lab Report.pH: 8.7
  Maximum: 8.5
  Result: 8.7 not less than 8.5
```

#### 5. Contains

**Purpose:** Text must include substring

**Use cases:**
- Keyword presence
- Location verification
- Description checking
- Partial matching

**Examples:**
```
✓ Passed:
  Field Notes.Location: "Samples collected at Site A, northwest corner"
  Required: "Site A"
  Result: Text contains "Site A"

✗ Failed:
  Field Notes.Location: "Samples collected at northern section"
  Required: "Site A"
  Result: Text does not contain "Site A"
```

**Text comparison:**
- Case-insensitive option
- Substring matching
- Whitespace handling

### Choosing Relations

**Decision guide:**

```
Need exact match? → Use Equals
Need to differ? → Use Not Equals
Need minimum value? → Use Greater Than
Need maximum value? → Use Less Than
Need keyword present? → Use Contains
```

**Validation scenarios:**

| Scenario | Relation | Example |
|----------|----------|---------|
| Same sample ID | Equals | Field.ID = Lab.ID |
| Not blank | Not Equals | Name ≠ "" |
| Above minimum | Greater Than | pH > 6.5 |
| Below maximum | Less Than | Temp < 30 |
| Contains keyword | Contains | Location Contains "Site A" |
| After date | Greater Than | Analysis Date > Collection Date |
| Before deadline | Less Than | Submission < Deadline |

## Viewing Questionnaires

### Access Questionnaires

1. Click **"Questionnaires"** in sidebar
2. View list of all questionnaires
3. Click to view details

### Questionnaire List

**Each card shows:**
- Questionnaire name
- Description
- Event type (if specified)
- Number of questions
- View button

**List organization:**
- Alphabetical by name
- Can filter by event type
- Search by name (future)

### Questionnaire Detail View

**Header:**
- Questionnaire name
- Full description
- Event type applicability
- Question count

**Questions Section:**
- List of all questions
- Question structure displayed
- System value shown
- Question order

**Example display:**
```
Question 1:
Field Data Form.Sample ID Equals Lab Report.Sample ID
System Value: Field Data Form.Sample ID Equals Lab Report.Sample ID

Question 2:
Lab Report.pH > 6.5
System Value: Lab Report.pH > 6.5
```

## Creating Effective Questions

### Question Design Principles

**1. Be Specific**
```
✓ Good: Field Form.Sample ID Equals Lab Report.Sample ID
✗ Poor: IDs match
```

**2. Be Testable**
```
✓ Good: pH > 6.5
✗ Poor: pH is acceptable
```

**3. Be Clear**
```
✓ Good: Collection Date Equals Sample Date
✗ Poor: Dates are consistent
```

**4. Be Purposeful**
```
✓ Good: Verify chain of custody maintained
✗ Poor: Check everything
```

### Question Examples by Category

#### Data Consistency

```
1. Field Form.Sample ID Equals Lab Report.Sample ID
2. Field Form.Location Equals GPS Record.Location
3. Chain of Custody.Sample Count Equals Field Form.Sample Count
4. Field Notes.Weather Equals Weather Station.Conditions
```

#### Completeness Checks

```
1. Field Form.Collector Name Not Equals Empty
2. Lab Report.Analysis Date Not Equals Empty
3. Sample ID Not Equals Empty
4. GPS Coordinates Not Equals Empty
```

#### Threshold Validations

```
1. Lab Report.pH > 6.5
2. Lab Report.pH < 8.5
3. Temperature Reading > 0
4. Temperature Reading < 30
5. Sample Volume > 100 mL
```

#### Date/Time Validations

```
1. Analysis Date > Collection Date
2. Report Date > Analysis Date
3. Collection Date < Today
4. Turnaround Time < 14 days
```

#### Regulatory Compliance

```
1. Lab Certification Contains "Valid"
2. Holding Time < 7 days
3. Detection Limit < 0.01 mg/L
4. QC Sample Frequency > 10%
```

#### Location Validations

```
1. Field Notes.Site ID Contains "SITE"
2. GPS Coordinates Contains "N" AND "W"
3. Address Contains City Name
4. Province Equals "Ontario"
```

### Common Question Patterns

#### Pattern 1: Cross-Reference

**Purpose:** Ensure consistency between related documents

```
Document A.Property X Equals Document B.Property X
Document A.Property Y Equals Document B.Property Y
```

#### Pattern 2: Range Checking

**Purpose:** Verify values within acceptable range

```
Property > Minimum Value
Property < Maximum Value
```

#### Pattern 3: Required Field

**Purpose:** Ensure critical fields are populated

```
Property Not Equals Empty
Property Contains [required text]
```

#### Pattern 4: Sequential Validation

**Purpose:** Verify logical order

```
Later Event Date > Earlier Event Date
Process End > Process Start
```

#### Pattern 5: Format Validation

**Purpose:** Check data format

```
Sample ID Contains "SW-"
Phone Number Contains Area Code
Email Contains "@"
```

## Best Practices

### Questionnaire Design

**Start with scope:**
1. Define what to validate
2. Identify critical checks
3. Group related questions
4. Order logically

**Build incrementally:**
1. Start with must-have questions
2. Add nice-to-have questions
3. Test with real data
4. Refine based on results

**Keep organized:**
1. Group by topic
2. Order by importance
3. Use clear naming
4. Document purpose

### Question Writing

**Be atomic:**
- One check per question
- Simple comparisons
- Clear pass/fail

**Be practical:**
- Validate what matters
- Don't over-validate
- Consider effort vs benefit

**Be maintainable:**
- Use consistent naming
- Document assumptions
- Plan for updates

### Questionnaire Management

**Version control:**
- Track changes
- Document updates
- Note effective dates
- Archive old versions

**Testing:**
- Test with sample data
- Verify all questions work
- Check edge cases
- Validate error messages

**Documentation:**
- Clear descriptions
- Purpose statements
- Usage guidelines
- Update history

### Quality Assurance

**Review questions:**
- Peer review
- Pilot testing
- User feedback
- Regular updates

**Monitor usage:**
- Track pass/fail rates
- Identify problem questions
- Gather user feedback
- Continuous improvement

### Common Pitfalls

**Avoid:**
```
✗ Overly complex questions
✗ Ambiguous comparisons
✗ Untestable conditions
✗ Redundant checks
✗ Unrealistic thresholds
```

**Instead:**
```
✓ Simple, clear questions
✓ Specific comparisons
✓ Measurable conditions
✓ Necessary checks only
✓ Practical thresholds
```

## Advanced Topics

### Question Dependencies

**Sequential validation:**
```
Question 1: Sample collected? (Yes/No)
Question 2: IF Yes, Sample ID present?
Question 3: IF Yes, Sample ID valid format?
```

### Complex Validations

**Multiple conditions:**
```
(Condition A AND Condition B) OR Condition C
```

**Calculated values:**
```
(End Time - Start Time) < 8 hours
Temperature Delta < 5°C
```

### Statistical Validations

**Outlier detection:**
```
Value within 2 standard deviations of mean
```

**Trend analysis:**
```
Current value within 10% of previous
```

### Regulatory Templates

**Standards-based:**
- ISO/IEC 17025
- EPA methods
- Provincial regulations
- Industry standards

## Future Enhancements

**Planned features:**
- Visual questionnaire builder
- Question templates
- Import/export
- Versioning
- Question library
- AI-assisted question creation
- Validation simulation
- Performance analytics

## Examples Library

### Example 1: Basic Sampling Validation

```
Name: Basic Sample Collection QA/QC
Event Type: SV_Sampling
Questions:
1. Field Form.Sample ID Not Equals Empty
2. Field Form.Collection Date Not Equals Empty
3. Field Form.Collector Name Not Equals Empty
4. Field Form.Sample Type Not Equals Empty
5. Field Form.Sample Depth > 0
```

### Example 2: Laboratory Analysis Validation

```
Name: Laboratory Results QA/QC
Event Type: Any
Questions:
1. Lab Report.Sample ID Equals Field Form.Sample ID
2. Lab Report.Analysis Date > Field Form.Collection Date
3. Lab Report.pH > 6.0
4. Lab Report.pH < 9.0
5. Lab Report.Holding Time < 7 days
6. Lab Report.Lab Certification Contains "Accredited"
```

### Example 3: Drilling Documentation

```
Name: Drilling Operations QA/QC
Event Type: Drilling
Questions:
1. Drilling Log.Borehole ID Not Equals Empty
2. Drilling Log.Total Depth > 0
3. Drilling Log.Completion Date > Start Date
4. Drilling Log.Driller Name Not Equals Empty
5. Drilling Log.Location Equals Site Plan.Borehole Location
6. Drilling Log.Method Contains "Rotary" OR "Auger" OR "Sonic"
```

## Resources

### Related Documentation
- [QA/QC Processes Guide](./qaqc-processes.md)
- [User Manual](./user-manual.md)
- [API Documentation](./api-documentation.md)

### External Standards
- ISO 9001 - Quality Management Systems
- ISO/IEC 17025 - Laboratory Accreditation
- EPA Quality Assurance Guidelines
- Provincial environmental regulations

---

*Well-designed questionnaires are the foundation of effective quality control.*
