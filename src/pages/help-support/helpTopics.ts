import gettingStartedIcon from '@/assets/Help_Getting_Started.svg';
import documentUploadIcon from '@/assets/Help_Document_Upload.svg';
import scanningIcon from '@/assets/Help_Scanning.svg';
import contentLibraryIcon from '@/assets/Help_Content_Library.svg';
import batchProcessingIcon from '@/assets/Help_Batch_Processing.svg';
import specialtyConfigurationIcon from '@/assets/Help_Specialty_Configuration.svg';
import accountSecurityIcon from '@/assets/Help_Account_Security.svg';
import rolesPermissionsIcon from '@/assets/Help_Roles_Permissions.svg';

export interface HelpQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  iconSrc: string;
  questions: HelpQuestion[];
}

export const helpTopics: HelpTopic[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    iconSrc: gettingStartedIcon,
    questions: [
      {
        id: 'setup-account',
        question: 'How do I set up my ClinSync account?',
        answer:
          "To set up your ClinSync account, your organization admin will send you an invitation email. Click the link, create a password meeting the security requirements (min 12 characters, mixed case, number, symbol), and complete your profile. You'll be guided through a brief onboarding walkthrough of the dashboard and key features.",
      },
      {
        id: 'browsers-devices',
        question: 'What browsers and devices are supported?',
        answer:
          'ClinSync supports the latest versions of Chrome, Edge, Firefox, and Safari on desktop and laptop devices. For the best experience, use a screen resolution of at least 1280×720.',
      },
      {
        id: 'navigate-dashboard',
        question: 'How do I navigate the dashboard?',
        answer:
          'Use the sidebar on the left to move between the Dashboard, Content Library, Scan History, and Settings. The dashboard home shows an overview of your inventory, coverage, risk trends, and review backlog.',
      },
      {
        id: 'organization-configuration',
        question: "Where can I find my organization's configuration?",
        answer:
          "Your organization's configuration is available under Settings. Admin users can manage organization details, specialty configuration, and user access from there.",
      },
    ],
  },
  {
    id: 'document-upload',
    title: 'Document Upload',
    iconSrc: documentUploadIcon,
    questions: [
      {
        id: 'file-formats',
        question: 'What file formats are accepted for upload?',
        answer:
          'ClinSync accepts PDF, DOCX, DOC, TXT, RTF, and HTML files. Medical imaging formats (DICOM) are supported with the Advanced Imaging add-on. All files are validated on upload for format integrity before processing.',
      },
      {
        id: 'file-size-limit',
        question: 'Is there a file size limit?',
        answer:
          'Yes. Each file can be up to 50 MB. Larger documents should be split into smaller files before uploading.',
      },
      {
        id: 'multiple-upload',
        question: 'Can I upload multiple documents at once?',
        answer:
          'Yes. You can drag and drop or select multiple files in the upload area. Each file is added to the upload queue, where you can track its progress individually.',
      },
      {
        id: 'tag-specialties',
        question: 'How do I tag documents with specialties during upload?',
        answer:
          'While adding content, use the specialty selector to assign one or more specialties to your documents. Specialties can also be updated later from the Content Library.',
      },
    ],
  },
  {
    id: 'scanning-analysis',
    title: 'Scanning & Analysis',
    iconSrc: scanningIcon,
    questions: [
      {
        id: 'automated-scanning',
        question: 'How does the automated scanning work?',
        answer:
          'ClinSync uses AI-powered natural language processing to analyze clinical documents. When you initiate a scan, the system extracts key medical terms, checks against specialty-specific validation rules, and assigns a risk level based on content accuracy and completeness. Results typically appear within 2–5 minutes.',
      },
      {
        id: 'risk-levels',
        question: 'What does each risk level (High, Medium, Low) mean?',
        answer:
          'High risk indicates significant accuracy or completeness issues that need immediate review. Medium risk indicates issues that should be reviewed soon. Low risk indicates minor or no issues were found.',
      },
      {
        id: 'scan-duration',
        question: 'How long does a typical scan take?',
        answer:
          'Most scans complete within 2–5 minutes. Larger documents or batches with many documents may take longer.',
      },
      {
        id: 'rescan',
        question: 'Can I re-scan a document after edits?',
        answer:
          'Yes. After replacing or updating a document, you can start a new scan from the document details page. Previous scan results remain available in Scan History.',
      },
    ],
  },
  {
    id: 'content-library',
    title: 'Content Library',
    iconSrc: contentLibraryIcon,
    questions: [
      {
        id: 'search-filter',
        question: 'How do I search and filter documents?',
        answer:
          'Use the search bar at the top of the Content Library to search by title, scan ID, specialty, or keyword. Apply filters for document type, date range, risk level, and scan status using the filter controls. You can also sort columns by clicking their headers.',
      },
      {
        id: 'document-versions',
        question: 'What is the difference between document versions?',
        answer:
          'Each time a document is replaced, a new version is created. The latest version is used for scanning, while earlier versions are kept for reference and audit purposes.',
      },
      {
        id: 'export',
        question: 'How do I export documents or reports?',
        answer:
          'Select the documents you want in the Content Library and choose Export from the actions menu. Scan reports can be exported from the scan results page.',
      },
      {
        id: 'bulk-select',
        question: 'Can I bulk-select documents for actions?',
        answer:
          'Yes. Use the checkboxes in the Content Library table to select multiple documents, then choose an action and click Apply.',
      },
    ],
  },
  {
    id: 'batch-processing',
    title: 'Batch Processing',
    iconSrc: batchProcessingIcon,
    questions: [
      {
        id: 'what-is-batch',
        question: 'What is batch processing and when should I use it?',
        answer:
          'Batch processing lets you scan or perform actions on multiple documents simultaneously. Use it when you have several documents to process at once — select documents from the library, choose an action (scan, export, re-assign specialty), and submit. Progress is tracked in the Batch History tab.',
      },
      {
        id: 'batch-history',
        question: 'How do I view batch history?',
        answer:
          'Open the Batch History tab to see all submitted batches along with their status, document count, and submission date.',
      },
      {
        id: 'cancel-batch',
        question: 'Can I cancel a batch in progress?',
        answer:
          'Yes. You can cancel a batch from Batch History while it is still in progress. Documents that have already been processed will keep their results.',
      },
      {
        id: 'batch-partial-failure',
        question: 'What happens if a batch partially fails?',
        answer:
          'Successfully processed documents keep their results, and failed documents are marked with an error. You can review the failures and retry only those documents.',
      },
    ],
  },
  {
    id: 'specialty-configuration',
    title: 'Specialty Configuration',
    iconSrc: specialtyConfigurationIcon,
    questions: [
      {
        id: 'assign-specialties',
        question: 'How are specialties assigned to documents?',
        answer:
          'Specialties are assigned during document upload, either manually via the specialty selector or automatically based on content analysis during scanning. Admin users can configure default specialty assignments per document type in Settings > Specialty Configuration.',
      },
      {
        id: 'customize-specialties',
        question: 'Can I customize the specialty list?',
        answer:
          'Admin users can add, rename, or deactivate specialties in Settings > Specialty Configuration. Changes apply to your entire organization.',
      },
      {
        id: 'validation-pipelines',
        question: 'What are validation pipelines?',
        answer:
          'Validation pipelines are sets of specialty-specific rules that documents are checked against during scanning. Each specialty can have its own pipeline.',
      },
      {
        id: 'specialty-mappings',
        question: 'How do specialty mappings affect scanning?',
        answer:
          "A document's specialty determines which validation pipeline is used during scanning, which affects the checks performed and the resulting risk level.",
      },
    ],
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    iconSrc: accountSecurityIcon,
    questions: [
      {
        id: 'change-password',
        question: 'How do I change my password?',
        answer:
          "Go to Settings > Profile Details and click 'Change Password'. You'll need to enter your current password and then your new password twice. New passwords must meet the organization's security policy (minimum 12 characters with mixed case, numbers, and symbols). You'll be logged out of other sessions after the change.",
      },
      {
        id: 'session-timeout',
        question: 'What are the session timeout policies?',
        answer:
          "Sessions expire automatically after a period of inactivity defined by your organization's security policy. You'll need to sign in again once your session expires.",
      },
      {
        id: 'data-encryption',
        question: 'How is my data encrypted?',
        answer:
          'All data is encrypted in transit using TLS and encrypted at rest using industry-standard encryption.',
      },
      {
        id: 'security-contact',
        question: 'Who can I contact for security concerns?',
        answer:
          "Contact your organization's admin or reach out to the ClinSync support team to report any security concerns.",
      },
    ],
  },
  {
    id: 'roles-permissions',
    title: 'Roles & Permissions',
    iconSrc: rolesPermissionsIcon,
    questions: [
      {
        id: 'available-roles',
        question: 'What roles are available in ClinSync?',
        answer:
          "ClinSync offers three roles: Viewer (read-only access to documents and reports), Editor (can upload, scan, and manage documents), and Admin (full access including user management, specialty configuration, and organization settings). Your role is assigned by your organization's admin.",
      },
      {
        id: 'role-change',
        question: 'How do I request a role change?',
        answer: "Contact your organization's admin to request a role change.",
      },
      {
        id: 'role-capabilities',
        question: 'What can each role see and do?',
        answer:
          'Viewers can view documents and reports. Editors can additionally upload, scan, and manage documents. Admins have full access, including user management, specialty configuration, and organization settings.',
      },
      {
        id: 'team-permissions',
        question: 'Can permissions be customized per team?',
        answer:
          "Permissions are currently managed through the three standard roles. Contact your organization's admin if your team needs different access.",
      },
    ],
  },
];
