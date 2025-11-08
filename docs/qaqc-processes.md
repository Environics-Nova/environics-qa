# QA/QC Processes Guide

Complete guide to quality assurance and quality control processes in the Environics QA system.

## Table of Contents

- [Introduction](#introduction)
- [Understanding QA/QC](#understanding-qaqc)
- [Creating QA/QC Processes](#creating-qaqc-processes)
- [Viewing Process Results](#viewing-process-results)
- [Interpreting Results](#interpreting-results)
- [Troubleshooting Failed Validations](#troubleshooting-failed-validations)
- [Best Practices](#best-practices)

## Introduction

QA/QC (Quality Assurance/Quality Control) processes are automated validation checks that ensure data accuracy and consistency across environmental site assessment documents.

### What is a QA/QC Process?

A **QA/QC Process** is:
- An automated validation workflow
- A specific instance of questionnaire execution
- Applied to a particular event's documents
- Produces pass/fail results
- Identifies data inconsistencies

### Why QA/QC Matters

**Benefits:**
- **Catch errors early**: Identify issues before reports go to clients
- **Ensure consistency**: Verify data matches across documents
- **Save time**: Automate manual checking
- **Maintain standards**: Enforce quality requirements
- **Build confidence**: Provide evidence of data quality
- **Reduce rework**: Fix issues before final deliverables

**Cost of poor data quality:**
- Client complaints
- Regulatory issues
- Delayed deliverables
- Reputation damage
- Financial penalties
- Legal liability

## Understanding QA/QC

### QA/QC Process Components

```
QA/QC Process
    ├── Event (what is being validated)
    ├── Questionnaire (validation rules)
    ├── Documents (data being checked)
    ├── Questions (individual validations)
    └── Results (outcomes)
```

### Process Workflow

```
1. Select Event
   ↓
2. Select Questionnaire
   ↓
3. System retrieves event documents
   ↓
4. System applies validation questions
   ↓
5. Each question evaluated
   ↓
6. Results generated
   ↓
7. Overall Pass/Fail determined
```

### How Validation Works

**Question structure:**
```
Document Property [Relation] Reference Value

Examples:
Field Form.Sample ID [Equals] Lab Report.Sample ID
Lab Report.pH [>] 6.5
Site Notes.Location [Contains] "Site A"
```

**Evaluation:**
1. System extracts values from documents
2. Applies relation/operator
3. Compares values
4. Determines pass or fail
5. Generates explanatory comment

### Pass/Fail Logic

**Process passes when:**
- ALL questions pass
- No validation errors
- All required documents present
- All properties have values

**Process fails when:**
- ANY question fails
- Values don't match expected
- Required documents missing
- Properties not found

## Creating QA/QC Processes

### Prerequisites

Before running a QA/QC process:

1. **Event exists** with field activities completed
2. **Documents uploaded** to the event
3. **Documents processed** (status: "Parsed")
4. **Properties extracted** from documents
5. **Questionnaire available** for event type

### Access QA/QC Processes

1. Click **"QA/QC Processes"** in the sidebar
2. View existing processes
3. Click **"New Process"** button

### Create New Process

**Step 1: Open Dialog**
- Click "New Process" button
- Dialog opens with form

**Step 2: Select Event**
- Dropdown shows available events
- Choose event to validate
- Events grouped by project

**Step 3: Select Questionnaire**
- Dropdown shows questionnaires
- May filter by event type
- Choose appropriate validation template

**Step 4: Review and Run**
- Verify selections
- Click "Run Process" button
- System executes validation

**Step 5: View Results**
- Process completes
- Redirected to results page
- Review pass/fail outcome

### Process Information

Each process includes:
- **Process Name**: Auto-generated or custom
- **Description**: Purpose of validation
- **Time**: When process was run
- **Event**: Which event was validated
- **Questionnaire**: Which template was used
- **Result**: Overall pass or fail
- **Results**: Individual question outcomes

### Example Process

```
Process Name: Groundwater Sampling QA/QC - Jan 2025
Description: Validation of GWMS event documentation
Time: 2025-01-21 14:30:00
Event: GWMS Event - Site A
Questionnaire: Groundwater Monitoring Validation
Result: Passed ✓

Questions Evaluated: 8
Questions Passed: 8
Questions Failed: 0
```

## Viewing Process Results

### Accessing Results

**From Process List:**
1. Navigate to "QA/QC Processes"
2. Click on process card
3. View detailed results

**Process List Shows:**
- Process name and description
- Time executed
- Event validated
- Questionnaire used
- Result badge (green = Passed, red = Failed)

### Results Page Layout

**Header Section:**
- Process name
- Overall result (prominent badge)
- Time and date
- Back navigation

**Event Information:**
- Event name
- Project association
- Event type(s)
- Date range

**Questionnaire Information:**
- Questionnaire name
- Description
- Number of questions

**Results Section:**
- List of all questions
- Individual pass/fail status
- System comments
- Values compared

### Result Details

**For Each Question:**

**Question Display:**
```
Field Data Form.Sample ID Equals Lab Report.Sample ID
```

**Status Indicator:**
- ✓ Green checkmark = Passed
- ✗ Red X = Failed

**System Comment:**
```
Sample ID 'SW-001' matches in both Field Data Form and Lab Report
```

**Values Shown:**
```
Field Data Form.Sample ID: SW-001
Lab Report.Sample ID: SW-001
Result: Values match ✓
```

### Filtering Results

**View options:**
- All questions
- Failed questions only (if any)
- Passed questions only
- By document type
- By property name

## Interpreting Results

### Passed Process

**What it means:**
- All validation questions passed
- Data is consistent across documents
- No errors detected
- Quality standards met

**Actions:**
- No immediate action required
- Document the validation
- Proceed with project
- Include in final report

**Example:**
```
✓ Process Passed

All 12 validation questions passed successfully.
Data consistency verified across all documents.
No issues detected.
```

### Failed Process

**What it means:**
- One or more questions failed
- Data inconsistencies found
- Potential errors in documents
- Review required

**Actions:**
- Review failed questions
- Check source documents
- Identify root cause
- Make corrections
- Re-run process

**Example:**
```
✗ Process Failed

10 of 12 questions passed.
2 questions failed - review required.

Failed Questions:
- Lab Report.Sample ID does not equal Field Form.Sample ID
- Collection Date.Time inconsistent
```

### Question Results

#### Passed Question Examples

**Example 1: Exact Match**
```
Question: Field Form.Sample ID Equals Lab Report.Sample ID
Status: Passed ✓
Comment: Sample ID 'SW-001' matches in both documents
Values:
  Field Form.Sample ID: SW-001
  Lab Report.Sample ID: SW-001
```

**Example 2: Threshold Check**
```
Question: Lab Report.pH > 6.5
Status: Passed ✓
Comment: pH value 7.2 exceeds minimum threshold of 6.5
Values:
  Lab Report.pH: 7.2
  Threshold: 6.5
```

**Example 3: Contains Check**
```
Question: Field Notes.Location Contains "Site A"
Status: Passed ✓
Comment: Location text contains required phrase "Site A"
Values:
  Field Notes.Location: "Samples collected at Site A, northwest corner"
  Required: "Site A"
```

#### Failed Question Examples

**Example 1: Mismatch**
```
Question: Field Form.Sample ID Equals Lab Report.Sample ID
Status: Failed ✗
Comment: Sample IDs do not match
Values:
  Field Form.Sample ID: SW-001
  Lab Report.Sample ID: SW-002
Action: Verify which ID is correct and update accordingly
```

**Example 2: Threshold Violation**
```
Question: Lab Report.pH > 6.5
Status: Failed ✗
Comment: pH value 6.2 is below minimum threshold of 6.5
Values:
  Lab Report.pH: 6.2
  Threshold: 6.5
Action: Verify pH reading or check if sample requires reanalysis
```

**Example 3: Missing Text**
```
Question: Field Notes.Location Contains "Site A"
Status: Failed ✗
Comment: Location text does not contain required phrase "Site A"
Values:
  Field Notes.Location: "Samples collected at northern section"
  Required: "Site A"
Action: Verify location was correctly documented
```

## Troubleshooting Failed Validations

### Investigation Process

**Step 1: Identify Failed Questions**
- Review results page
- Note which questions failed
- Understand what was being validated

**Step 2: Examine Source Documents**
- Open relevant documents
- Find the properties in question
- Check actual values

**Step 3: Determine Root Cause**
- Data entry error?
- Transcription mistake?
- Document processing error?
- Legitimate discrepancy?

**Step 4: Take Corrective Action**
- Update incorrect data
- Re-scan document if needed
- Verify with field team
- Document the correction

**Step 5: Re-validate**
- Re-run QA/QC process
- Verify issue is resolved
- Document resolution

### Common Failure Scenarios

#### Scenario 1: Typo in Sample ID

**Failed Question:**
```
Field Form.Sample ID ≠ Lab Report.Sample ID
Field: SW-001
Lab: SW-OO1 (zero instead of O)
```

**Solution:**
- Identify which is correct
- Update incorrect document
- Re-upload and process
- Re-run validation

#### Scenario 2: Date Format Inconsistency

**Failed Question:**
```
Field Form.Collection Date ≠ Lab Report.Sample Date
Field: 2025-01-20
Lab: Jan 20, 2025
```

**Solution:**
- Verify dates represent same day
- May require standardized format
- Update if different dates
- Re-validate

#### Scenario 3: Missing Required Information

**Failed Question:**
```
Cannot validate: Property 'GPS Coordinates' not found in Field Form
```

**Solution:**
- Check if field was left blank
- Verify property name spelling
- Add missing information
- Re-process document
- Re-run validation

#### Scenario 4: Measurement Out of Range

**Failed Question:**
```
Temperature reading < 0°C
Lab Report.Temperature: -5°C
Minimum: 0°C
```

**Solution:**
- Verify reading is accurate
- Check if sample was frozen
- Determine if reading is valid
- Document explanation
- May require resampling

### Decision Tree

```
Validation Failed
    ↓
Is the failure a data error?
    ├─ Yes → Correct the data → Re-run validation
    └─ No ↓
Is it a document processing error?
    ├─ Yes → Re-process document → Re-run validation
    └─ No ↓
Is it a legitimate discrepancy?
    ├─ Yes → Document explanation → Continue
    └─ No ↓
Investigate further or contact support
```

## Best Practices

### When to Run QA/QC

**Recommended timing:**
- After all event documents uploaded
- After documents processed (status: Parsed)
- Before generating reports
- After making corrections
- Before client delivery

**Process frequency:**
```
Initial: After document upload
Interim: After corrections
Final: Before report generation
Archive: For record keeping
```

### Choosing Questionnaires

**Select based on:**
- Event type (PVV, GWMS, Drilling, etc.)
- Document types available
- Validation requirements
- Client specifications
- Regulatory standards

**Match questionnaire to event:**
```
GWMS Event → Groundwater Monitoring QA/QC
Drilling Event → Drilling Documentation QA/QC
Sampling Event → Sample Collection QA/QC
```

### Documentation

**Record keeping:**
- Save all QA/QC results
- Document failed validations
- Track corrections made
- Note re-validation outcomes
- Include in project records

**QA/QC summary:**
```
Process: Groundwater Monitoring QA/QC
Date: 2025-01-21
Initial Result: Failed (2 questions)
Issues: Sample ID mismatch, date inconsistency
Corrections: Updated field form
Re-validation: Passed
Final Result: Approved ✓
```

### Handling Failures

**Don't:**
- Ignore failed validations
- Skip re-validation
- Deliver without resolving
- Make corrections without verification

**Do:**
- Investigate thoroughly
- Correct root causes
- Verify corrections
- Re-run validation
- Document resolution

### Continuous Improvement

**Review trends:**
- Common failure types
- Frequent error sources
- Process improvements needed
- Training requirements

**Implement improvements:**
- Update field forms
- Enhance training
- Refine processes
- Update questionnaires

### Quality Culture

**Promote quality:**
- Make QA/QC standard practice
- Train all team members
- Celebrate high quality
- Learn from failures
- Continuous improvement

## Advanced Topics

### Complex Validations

**Multi-step validations:**
1. Check data completeness
2. Verify data consistency
3. Validate against standards
4. Cross-reference documents
5. Check regulatory compliance

**Hierarchical checks:**
```
Level 1: Basic data presence
Level 2: Format validation
Level 3: Value range checks
Level 4: Cross-document consistency
Level 5: Regulatory compliance
```

### QA/QC Metrics

**Track metrics:**
- Pass rate (% of processes passing)
- Common failure types
- Time to resolution
- Re-validation rate
- Quality trends over time

**Example metrics:**
```
Month: January 2025
Processes Run: 45
Passed First Time: 38 (84%)
Failed Initial: 7 (16%)
Resolved and Passed: 7 (100%)
Overall Pass Rate: 100%
Avg Resolution Time: 1.2 days
```

### Integration with Workflows

**Embed QA/QC in workflow:**
```
Document Upload
    ↓
Document Processing
    ↓
QA/QC Validation ← [Decision Point]
    ├─ Pass → Report Generation
    └─ Fail → Correction → Re-validate
```

## Future Enhancements

**Planned features:**
- Automated process triggering
- Email notifications
- Custom questionnaire creation
- Batch validation
- Advanced reporting
- Trend analysis
- Mobile access
- API integration
- Machine learning validation
- Predictive quality scoring

## Resources

### Internal Resources
- [Questionnaires Guide](./questionnaires.md)
- [User Manual](./user-manual.md)
- [Project Management](./project-management.md)

### Quality Standards
- ISO 9001 Quality Management
- ISO/IEC 17025 Laboratory Standards
- Environmental regulations
- Client-specific requirements

---

*Quality is not an act, it is a habit. - Aristotle*
